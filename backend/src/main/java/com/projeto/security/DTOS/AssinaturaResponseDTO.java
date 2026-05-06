package com.projeto.security.DTOS;

import com.projeto.security.ENUMS.Status;
import com.projeto.security.entities.Plano;
import com.projeto.security.entities.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record AssinaturaResponseDTO(UUID id, String nomeUsuario, String nomePlano, BigDecimal precoPlano, LocalDateTime dataInicio, LocalDateTime dataFinal, Status status) {
}
