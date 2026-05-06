package com.projeto.security.user;

import com.projeto.security.DTOS.produto.ProdutoCreateDTO;
import com.projeto.security.DTOS.produto.ProdutoResponseDTO;
import com.projeto.security.DTOS.produto.ProdutoUpdateDTO;
import com.projeto.security.entities.Produto;
import com.projeto.security.exception.ProdutoJaExistenteException;
import com.projeto.security.exception.ProdutoNaoEncontradoException;
import com.projeto.security.repositories.ProdutoRepository;
import com.projeto.security.service.ProdutoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProdutoServiceTest {

    @Mock private ProdutoRepository repository;

    private ProdutoService service;
    private Produto produtoBase;

    @BeforeEach
    void setUp() {
        service = new ProdutoService(repository);

        produtoBase = new Produto();
        produtoBase.setId(1L);
        produtoBase.setNome("Hidratante");
        produtoBase.setDescricao("Hidratante facial");
        produtoBase.setPreco(new BigDecimal("49.90"));
        produtoBase.setEstoque(50);
        produtoBase.setStatusClube(false);
    }

    // ===== criarProduto =====

    @Test
    void deveCriarProdutoComCamposObrigatorios() {
        ProdutoCreateDTO dto = new ProdutoCreateDTO(
                "Hidratante", "Hidratante facial", new BigDecimal("49.90"),
                null, 50, null, null
        );
        when(repository.existsByNome("Hidratante")).thenReturn(false);
        when(repository.save(any(Produto.class))).thenAnswer(inv -> {
            Produto p = inv.getArgument(0);
            p.setId(1L);
            return p;
        });

        ProdutoResponseDTO result = service.criarProduto(dto);

        ArgumentCaptor<Produto> captor = ArgumentCaptor.forClass(Produto.class);
        verify(repository).save(captor.capture());
        Produto salvo = captor.getValue();
        assertEquals("Hidratante", salvo.getNome());
        assertEquals(new BigDecimal("49.90"), salvo.getPreco());
        assertEquals(50, salvo.getEstoque());
        assertEquals("Hidratante", result.nome());
    }

    @Test
    void deveCriarProdutoDoClubeComStatusEDesconto() {
        ProdutoCreateDTO dto = new ProdutoCreateDTO(
                "Sérum", "Sérum facial", new BigDecimal("99.90"),
                null, 30, new BigDecimal("0.30"), true
        );
        when(repository.existsByNome("Sérum")).thenReturn(false);
        when(repository.save(any(Produto.class))).thenAnswer(inv -> {
            Produto p = inv.getArgument(0);
            p.setId(2L);
            return p;
        });

        service.criarProduto(dto);

        ArgumentCaptor<Produto> captor = ArgumentCaptor.forClass(Produto.class);
        verify(repository).save(captor.capture());
        Produto salvo = captor.getValue();
        assertTrue(salvo.getStatusClube());
        assertEquals(new BigDecimal("0.30"), salvo.getDescontoEspecial());
    }

    @Test
    void naoDeveCriarProdutoComNomeJaExistente() {
        ProdutoCreateDTO dto = new ProdutoCreateDTO(
                "Hidratante", "...", new BigDecimal("49.90"),
                null, 50, null, null
        );
        when(repository.existsByNome("Hidratante")).thenReturn(true);

        assertThrows(ProdutoJaExistenteException.class, () -> service.criarProduto(dto));
        verify(repository, never()).save(any());
    }

    // ===== modificarProduto =====

    @Test
    void deveModificarApenasCamposEnviadosNoUpdate() {
        ProdutoUpdateDTO dto = new ProdutoUpdateDTO(
                null, null, new BigDecimal("59.90"), null, null, null, null
        );
        when(repository.findById(1L)).thenReturn(Optional.of(produtoBase));
        when(repository.save(any(Produto.class))).thenReturn(produtoBase);

        service.modificarProduto(1L, dto);

        // Só preço deve ter mudado
        assertEquals(new BigDecimal("59.90"), produtoBase.getPreco());
        assertEquals("Hidratante", produtoBase.getNome());          // não mudou
        assertEquals("Hidratante facial", produtoBase.getDescricao()); // não mudou
        assertEquals(50, produtoBase.getEstoque());                  // não mudou
    }

    @Test
    void naoDeveModificarProdutoInexistente() {
        ProdutoUpdateDTO dto = new ProdutoUpdateDTO(
                "Novo nome", null, null, null, null, null, null
        );
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ProdutoNaoEncontradoException.class, () ->
                service.modificarProduto(99L, dto)
        );
        verify(repository, never()).save(any());
    }

    // ===== deletarProduto =====

    @Test
    void deveDeletarProdutoExistente() {
        when(repository.findById(1L)).thenReturn(Optional.of(produtoBase));

        service.deletarProduto(1L);

        verify(repository).delete(produtoBase);
    }

    @Test
    void naoDeveDeletarProdutoInexistente() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ProdutoNaoEncontradoException.class, () ->
                service.deletarProduto(99L)
        );
        verify(repository, never()).delete(any());
    }

    // ===== listarProdutos =====

    @Test
    void deveListarTodosOsProdutos() {
        when(repository.findAll()).thenReturn(List.of(produtoBase));

        List<ProdutoResponseDTO> result = service.listarProdutos();

        assertEquals(1, result.size());
        assertEquals("Hidratante", result.get(0).nome());
    }

    // ===== procurarProduto =====

    @Test
    void deveBuscarProdutoExistentePorId() {
        when(repository.findById(1L)).thenReturn(Optional.of(produtoBase));

        ProdutoResponseDTO result = service.procurarProduto(1L);

        assertEquals(1L, result.id());
        assertEquals("Hidratante", result.nome());
    }

    @Test
    void naoDeveBuscarProdutoInexistente() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ProdutoNaoEncontradoException.class, () ->
                service.procurarProduto(99L)
        );
    }
}