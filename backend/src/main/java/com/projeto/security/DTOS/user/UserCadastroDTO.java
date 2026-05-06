package com.projeto.security.DTOS.user;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.br.CPF;

public record UserCadastroDTO(@NotBlank String name, @NotBlank @Email String email, @NotBlank @CPF String cpf, @NotBlank @Size(min = 6, max = 100) String password) {
}
