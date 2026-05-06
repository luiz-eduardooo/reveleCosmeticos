package com.projeto.security.DTOS;

import com.projeto.security.ENUMS.Cobranca;

import java.math.BigDecimal;

public record PlanoDTO(String nome, String descricao, BigDecimal preco, Cobranca intervaloCobranca) {
}
