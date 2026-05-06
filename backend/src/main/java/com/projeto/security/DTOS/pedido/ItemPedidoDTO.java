package com.projeto.security.DTOS.pedido;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ItemPedidoDTO(
        @NotNull Long produtoId,
        @NotNull @Min(1) Integer quantidade
) {}