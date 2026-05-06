package com.projeto.security.repositories;

import com.projeto.security.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    public boolean existsByEmailOrCpf(String email, String cpf);
    public Optional<User> findByEmail(String email);
}
