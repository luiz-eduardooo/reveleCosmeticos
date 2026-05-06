package com.projeto.security.controllers;

import com.projeto.security.DTOS.produto.ProdutoCreateDTO;
import com.projeto.security.DTOS.produto.ProdutoResponseDTO;
import com.projeto.security.DTOS.produto.ProdutoUpdateDTO;
import com.projeto.security.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService service;

    // ===== Públicos =====
    @GetMapping
    public ResponseEntity<List<ProdutoResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarProdutos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.procurarProduto(id));
    }

    // ===== Admin only (protegidos via SecurityConfig) =====
    @PostMapping
    public ResponseEntity<ProdutoResponseDTO> criar(@RequestBody @Valid ProdutoCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criarProduto(dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> modificar(
            @PathVariable Long id,
            @RequestBody @Valid ProdutoUpdateDTO dto) {
        return ResponseEntity.ok(service.modificarProduto(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletarProduto(id);
        return ResponseEntity.noContent().build();
    }
}