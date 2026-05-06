package com.projeto.security.DTOS.produto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;


import java.math.BigDecimal;

public record ProdutoCreateDTO(@NotBlank String nome, @NotBlank String descricao, @NotNull @Positive BigDecimal preco, String imagem, @NotNull @Min(1) Integer estoque, BigDecimal descontoEspecial, Boolean statusClube){
}
