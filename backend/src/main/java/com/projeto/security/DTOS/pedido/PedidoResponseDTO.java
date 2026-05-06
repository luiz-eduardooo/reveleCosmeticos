package com.projeto.security.DTOS.pedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record PedidoResponseDTO(
        UUID id,
        String nomeUsuario,
        List<ItemPedidoResponseDTO> itens,
        BigDecimal valorTotal,
        LocalDateTime dataPedido
) {}