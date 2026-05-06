package com.projeto.security.DTOS.user;

import jakarta.validation.constraints.Email;

public record UserUpdateDTO(@Email String email, String name) {}
