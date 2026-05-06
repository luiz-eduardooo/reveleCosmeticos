package com.projeto.security.service;

import com.projeto.security.DTOS.pedido.ItemPedidoDTO;
import com.projeto.security.DTOS.pedido.PedidoDTO;
import com.projeto.security.DTOS.pedido.PedidoResponseDTO;
import com.projeto.security.entities.Pedido;
import com.projeto.security.entities.Produto;
import com.projeto.security.entities.User;
import com.projeto.security.exception.ProdutoNaoEncontradoException;
import com.projeto.security.repositories.PedidoRepository;
import com.projeto.security.repositories.ProdutoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    @Mock private PedidoRepository pedidoRepository;
    @Mock private ProdutoRepository produtoRepository;
    @Mock private AssinaturaService assinaturaService;
    @Mock private CalculadoraDePrecoService calculadoraDePreco;
    @Mock private EmailService emailService;
    @Mock private EmailTemplateService emailTemplate;

    private final Clock clockFixo = Clock.fixed(
            Instant.parse("2026-04-22T10:00:00Z"),
            ZoneOffset.UTC
    );

    private PedidoService service;

    private User userTeste;
    private Produto produtoBase;

    @BeforeEach
    void setUp() {
        service = new PedidoService(
                pedidoRepository, produtoRepository,
                assinaturaService, calculadoraDePreco,
                clockFixo, emailService, emailTemplate
        );

        userTeste = new User();
        userTeste.setId(UUID.randomUUID());
        userTeste.setName("Luiz");
        userTeste.setEmail("luiz@teste.com");

        produtoBase = new Produto();
        produtoBase.setId(1L);
        produtoBase.setNome("Hidratante");
        produtoBase.setPreco(new BigDecimal("100.00"));
        produtoBase.setStatusClube(true);
    }

    // ===== Comportamento principal =====

    @Test
    void devePassarIsAssinanteTrueParaCalculadoraQuandoUserEhAssinante() {
        // ARRANGE
        PedidoDTO dto = new PedidoDTO(List.of(new ItemPedidoDTO(1L, 2)));
        when(assinaturaService.isAssinante(userTeste)).thenReturn(true);
        when(produtoRepository.findAllById(List.of(1L))).thenReturn(List.of(produtoBase));
        when(calculadoraDePreco.calcular(produtoBase, true)).thenReturn(new BigDecimal("80.00"));
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(inv -> inv.getArgument(0));

        // ACT
        service.criarPedido(userTeste, dto);

        // ASSERT
        verify(calculadoraDePreco).calcular(produtoBase, true);
    }

    @Test
    void devePassarIsAssinanteFalseParaCalculadoraQuandoUserNaoEhAssinante() {
        PedidoDTO dto = new PedidoDTO(List.of(new ItemPedidoDTO(1L, 2)));
        when(assinaturaService.isAssinante(userTeste)).thenReturn(false);
        when(produtoRepository.findAllById(List.of(1L))).thenReturn(List.of(produtoBase));
        when(calculadoraDePreco.calcular(produtoBase, false)).thenReturn(new BigDecimal("100.00"));
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(inv -> inv.getArgument(0));

        service.criarPedido(userTeste, dto);

        verify(calculadoraDePreco).calcular(produtoBase, false);
    }

    @Test
    void devePersistirPedidoComPrecoUnitarioCalculadoEDataDoClock() {
        // ARRANGE
        PedidoDTO dto = new PedidoDTO(List.of(new ItemPedidoDTO(1L, 2)));
        when(assinaturaService.isAssinante(userTeste)).thenReturn(true);
        when(produtoRepository.findAllById(List.of(1L))).thenReturn(List.of(produtoBase));
        when(calculadoraDePreco.calcular(produtoBase, true)).thenReturn(new BigDecimal("80.00"));
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(inv -> inv.getArgument(0));

        // ACT
        service.criarPedido(userTeste, dto);

        // ASSERT — captura o Pedido que foi pro save e inspeciona
        ArgumentCaptor<Pedido> captor = ArgumentCaptor.forClass(Pedido.class);
        verify(pedidoRepository).save(captor.capture());

        Pedido pedidoSalvo = captor.getValue();
        assertEquals(userTeste, pedidoSalvo.getUser());
        assertEquals(LocalDateTime.of(2026, 4, 22, 10, 0), pedidoSalvo.getDataPedido());
        assertEquals(1, pedidoSalvo.getItens().size());
        assertEquals(new BigDecimal("80.00"), pedidoSalvo.getItens().get(0).getPrecoUnitario());
        assertEquals(2, pedidoSalvo.getItens().get(0).getQuantidade());
    }

    @Test
    void deveCalcularValorTotalComoSomaDosSubtotais() {
        // 2 produtos diferentes
        Produto produto2 = new Produto();
        produto2.setId(2L);
        produto2.setNome("Sabonete");
        produto2.setPreco(new BigDecimal("50.00"));
        produto2.setStatusClube(false);

        PedidoDTO dto = new PedidoDTO(List.of(
                new ItemPedidoDTO(1L, 2),  // 80 * 2 = 160
                new ItemPedidoDTO(2L, 3)   // 50 * 3 = 150
        ));

        when(assinaturaService.isAssinante(userTeste)).thenReturn(true);
        when(produtoRepository.findAllById(List.of(1L, 2L)))
                .thenReturn(List.of(produtoBase, produto2));
        when(calculadoraDePreco.calcular(produtoBase, true)).thenReturn(new BigDecimal("80.00"));
        when(calculadoraDePreco.calcular(produto2, true)).thenReturn(new BigDecimal("50.00"));
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(inv -> inv.getArgument(0));

        PedidoResponseDTO result = service.criarPedido(userTeste, dto);

        assertEquals(new BigDecimal("310.00"), result.valorTotal());
    }

    // ===== Validações =====

    @Test
    void deveLancarExceptionQuandoProdutoNaoExiste() {
        PedidoDTO dto = new PedidoDTO(List.of(
                new ItemPedidoDTO(1L, 2),
                new ItemPedidoDTO(99L, 1)
        ));

        when(assinaturaService.isAssinante(userTeste)).thenReturn(false);
        when(produtoRepository.findAllById(List.of(1L, 99L)))
                .thenReturn(List.of(produtoBase));  // só achou o 1L, falta o 99L

        ProdutoNaoEncontradoException ex = assertThrows(
                ProdutoNaoEncontradoException.class,
                () -> service.criarPedido(userTeste, dto)
        );

        assertEquals(List.of(99L), ex.getIdsNaoEncontrados());
        verify(pedidoRepository, never()).save(any());
    }

    @Test
    void deveDeduplicarIdsAntesDeBuscarNoBanco() {
        // Cliente manda 2 vezes o mesmo produto (cenário do front bugado)
        PedidoDTO dto = new PedidoDTO(List.of(
                new ItemPedidoDTO(1L, 2),
                new ItemPedidoDTO(1L, 3)
        ));

        when(assinaturaService.isAssinante(userTeste)).thenReturn(false);
        when(produtoRepository.findAllById(List.of(1L)))  // só 1 ID, mesmo recebendo 2
                .thenReturn(List.of(produtoBase));
        when(calculadoraDePreco.calcular(produtoBase, false)).thenReturn(new BigDecimal("100.00"));
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(inv -> inv.getArgument(0));

        service.criarPedido(userTeste, dto);

        // Verifica que foi UMA query só ao banco com ID único
        verify(produtoRepository).findAllById(List.of(1L));
    }

    // ===== Side effect: email =====

    @Test
    void deveEnviarEmailDeConfirmacaoAposCriarPedido() {
        PedidoDTO dto = new PedidoDTO(List.of(new ItemPedidoDTO(1L, 1)));
        when(assinaturaService.isAssinante(userTeste)).thenReturn(false);
        when(produtoRepository.findAllById(List.of(1L))).thenReturn(List.of(produtoBase));
        when(calculadoraDePreco.calcular(produtoBase, false)).thenReturn(new BigDecimal("100.00"));
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(inv -> inv.getArgument(0));
        when(emailTemplate.pedidoConfirmado(any(Pedido.class))).thenReturn("<html>...</html>");

        service.criarPedido(userTeste, dto);

        verify(emailService).enviar(eq("luiz@teste.com"), anyString(), eq("<html>...</html>"));
    }
}