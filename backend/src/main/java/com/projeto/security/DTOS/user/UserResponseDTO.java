package com.projeto.security.DTOS.user;

import com.projeto.security.ENUMS.Role;

import java.util.UUID;

public record UserResponseDTO(String email, Role role, String name, UUID id){}
