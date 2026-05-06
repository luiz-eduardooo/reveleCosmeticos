package com.projeto.security.service;

import com.projeto.security.DTOS.pedido.ItemPedidoDTO;
import com.projeto.security.DTOS.pedido.ItemPedidoResponseDTO;
import com.projeto.security.DTOS.pedido.PedidoDTO;
import com.projeto.security.DTOS.pedido.PedidoResponseDTO;
import com.projeto.security.entities.ItemPedido;
import com.projeto.security.entities.Pedido;
import com.projeto.security.entities.Produto;
import com.projeto.security.entities.User;
import com.projeto.security.exception.PedidoNaoEncontradoException;
import com.projeto.security.exception.ProdutoNaoEncontradoException;
import com.projeto.security.repositories.PedidoRepository;
import com.projeto.security.repositories.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;
    private final AssinaturaService assinaturaService;
    private final CalculadoraDePrecoService calculadoraDePreco;
    private final Clock clock;
    private final EmailService emailService;
    private final EmailTemplateService emailTemplate;

    @Transactional
    public PedidoResponseDTO criarPedido(User user, PedidoDTO pedidoDTO) {
        boolean isAssinante = assinaturaService.isAssinante(user);
        Map<Long, Produto> produtosPorId = buscarProdutos(pedidoDTO.itens());
        Pedido pedido = montarPedido(user, pedidoDTO.itens(), produtosPorId, isAssinante);

        Pedido pedidoSalvo = pedidoRepository.save(pedido);
        enviarEmailConfirmacao(pedidoSalvo);
        return toResponseDTO(pedidoSalvo);
    }

    private Map<Long, Produto> buscarProdutos(List<ItemPedidoDTO> itens) {
        List<Long> ids = itens.stream()
                .map(ItemPedidoDTO::produtoId)
                .distinct()
                .toList();

        List<Produto> produtos = produtoRepository.findAllById(ids);

        if (produtos.size() != ids.size()) {
            Set<Long> encontrados = produtos.stream()
                    .map(Produto::getId)
                    .collect(Collectors.toSet());
            List<Long> faltantes = ids.stream()
                    .filter(id -> !encontrados.contains(id))
                    .toList();
            throw new ProdutoNaoEncontradoException(faltantes);
        }

        return produtos.stream()
                .collect(Collectors.toMap(Produto::getId, p -> p));
    }

    private Pedido montarPedido(User user, List<ItemPedidoDTO> itensDTO,
                                Map<Long, Produto> produtosPorId, boolean isAssinante) {
        Pedido pedido = new Pedido();
        pedido.setUser(user);
        pedido.setDataPedido(LocalDateTime.now(clock));


        for (ItemPedidoDTO itemDTO : itensDTO) {
            Produto produto = produtosPorId.get(itemDTO.produtoId());
            BigDecimal precoUnitario = calculadoraDePreco.calcular(produto, isAssinante);

            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setProduto(produto);
            item.setQuantidade(itemDTO.quantidade());
            item.setPrecoUnitario(precoUnitario);

            pedido.getItens().add(item);
        }


        return pedido;
    }

    private PedidoResponseDTO toResponseDTO(Pedido pedido) {
        List<ItemPedidoResponseDTO> itens = pedido.getItens().stream()
                .map(this::toItemResponseDTO)
                .toList();

        return new PedidoResponseDTO(
                pedido.getId(),
                pedido.getUser().getName(),
                itens,
                pedido.getValorTotalPedido(),
                pedido.getDataPedido()
        );
    }

    private ItemPedidoResponseDTO toItemResponseDTO(ItemPedido item) {
        return new ItemPedidoResponseDTO(
                item.getProduto().getId(),
                item.getProduto().getNome(),
                item.getQuantidade(),
                item.getPrecoUnitario(),
                item.getSubtotal()
        );
    }

    @Transactional(readOnly = true)
    public Page<PedidoResponseDTO> listarMeusPedidos(User user, Pageable pageable) {
        return pedidoRepository.findByUserOrderByDataPedidoDesc(user, pageable)
                .map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public PedidoResponseDTO buscarPedido(UUID id, User user) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new PedidoNaoEncontradoException(id));

        if (!pedido.getUser().getId().equals(user.getId())) {
            throw new PedidoNaoEncontradoException(id);
        }

        return toResponseDTO(pedido);
    }

    private void enviarEmailConfirmacao(Pedido pedido) {
        String html = emailTemplate.pedidoConfirmado(pedido);
        emailService.enviar(
                pedido.getUser().getEmail(),
                "Pedido confirmado — Revele Cosméticos",
                html
        );
    }
}