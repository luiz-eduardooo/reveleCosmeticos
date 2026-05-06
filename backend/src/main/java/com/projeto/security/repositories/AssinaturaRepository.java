package com.projeto.security.repositories;

import com.projeto.security.ENUMS.Status;
import com.projeto.security.entities.Assinatura;
import com.projeto.security.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AssinaturaRepository extends JpaRepository<Assinatura, UUID> {

    Optional<Assinatura> findByUserAndStatus(User user, Status status);

    // Mantém findByUser se você usa em outros lugares
    Optional<Assinatura> findByUser(User user);
}