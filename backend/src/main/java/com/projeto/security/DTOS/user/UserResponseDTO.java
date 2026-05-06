package com.projeto.security.DTOS.user;

import java.util.UUID;

public record UserResponseDTO(String email, String cpf, String name, UUID id){}
