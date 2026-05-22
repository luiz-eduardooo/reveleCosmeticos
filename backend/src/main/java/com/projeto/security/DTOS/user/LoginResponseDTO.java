package com.projeto.security.DTOS.user;

public record LoginResponseDTO(String token, UserResponseDTO usuario) {
}
