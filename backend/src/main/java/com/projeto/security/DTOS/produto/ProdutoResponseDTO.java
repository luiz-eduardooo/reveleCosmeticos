package com.projeto.security.DTOS.produto;

import java.math.BigDecimal;

public record ProdutoResponseDTO(Long id, String nome, String descricao, BigDecimal preco, Integer estoque,Boolean statusClube) {
}
