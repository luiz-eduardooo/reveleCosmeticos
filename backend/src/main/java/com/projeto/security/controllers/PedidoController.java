package com.projeto.security.controllers;

import com.projeto.security.DTOS.pedido.PedidoDTO;
import com.projeto.security.DTOS.pedido.PedidoResponseDTO;
import com.projeto.security.entities.User;
import com.projeto.security.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService service;

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> criarPedido(
            @RequestBody @Valid PedidoDTO dto,
            @AuthenticationPrincipal User userLogado) {
        PedidoResponseDTO pedido = service.criarPedido(userLogado, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(pedido);
    }

    @GetMapping("/meus")
    public ResponseEntity<Page<PedidoResponseDTO>> listarMeusPedidos(
            @AuthenticationPrincipal User userLogado,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(service.listarMeusPedidos(userLogado, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponseDTO> buscarPedido(
            @PathVariable UUID id,
            @AuthenticationPrincipal User userLogado) {
        return ResponseEntity.ok(service.buscarPedido(id, userLogado));
    }
}