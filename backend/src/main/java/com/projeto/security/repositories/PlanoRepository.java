package com.projeto.security.repositories;

import com.projeto.security.entities.Plano;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PlanoRepository extends JpaRepository<Plano, UUID>{

}
