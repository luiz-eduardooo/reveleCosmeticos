package com.projeto.security.DTOS.pedido;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record PedidoDTO(
        @NotEmpty @Valid List<ItemPedidoDTO> itens
) {}