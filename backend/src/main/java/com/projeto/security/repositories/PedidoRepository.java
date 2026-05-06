package com.projeto.security.repositories;

import com.projeto.security.entities.Pedido;
import com.projeto.security.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PedidoRepository extends JpaRepository<Pedido, UUID> {

    Page<Pedido> findByUserOrderByDataPedidoDesc(User user, Pageable pageable);
}