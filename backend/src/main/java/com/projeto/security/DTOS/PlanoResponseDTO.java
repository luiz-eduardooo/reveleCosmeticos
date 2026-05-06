package com.projeto.security.DTOS;

import com.projeto.security.ENUMS.Cobranca;

import java.math.BigDecimal;
import java.util.UUID;

public record PlanoResponseDTO(String nome, String descricao, BigDecimal preco, Cobranca intervaloCobranca, UUID id){
}
