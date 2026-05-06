package com.projeto.security.DTOS.produto;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record ProdutoUpdateDTO(
        String nome,
        String descricao,
        @Positive BigDecimal preco,
        String imagem,
        @PositiveOrZero Integer estoque,
        @PositiveOrZero BigDecimal descontoEspecial,
        Boolean statusClube
) {}
