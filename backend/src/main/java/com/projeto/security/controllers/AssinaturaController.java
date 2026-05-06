package com.projeto.security.controllers;

import com.projeto.security.DTOS.AssinaturaDTO;
import com.projeto.security.DTOS.AssinaturaResponseDTO;
import com.projeto.security.entities.User;
import com.projeto.security.service.AssinaturaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/assinaturas")
public class AssinaturaController {


    private final AssinaturaService service;


    @PostMapping("/")
    public ResponseEntity<AssinaturaResponseDTO> fazerAssinatura(@RequestBody @Valid AssinaturaDTO dto, @AuthenticationPrincipal User userLogado){
        return ResponseEntity.ok(service.criarAssinatura(dto, userLogado));
    }

    @PatchMapping("/{id}/pausar")
    public ResponseEntity<AssinaturaResponseDTO> alterarStatusAssinatura(@PathVariable UUID id, @AuthenticationPrincipal User userLogado){
        return ResponseEntity.ok(service.pausarAssinatura(id, userLogado));
    }


    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<AssinaturaResponseDTO> cancelarAssinatura(@PathVariable UUID id, @AuthenticationPrincipal User userLogado){
        return ResponseEntity.ok(service.cancelarAssinatura(id, userLogado));
    }
    @GetMapping("/admin")
    public ResponseEntity<List<AssinaturaResponseDTO>> verAssinaturas(){
        return ResponseEntity.ok(service.listarAssinaturas());
    }

    @PatchMapping("/{id}/renovar")
    public ResponseEntity<AssinaturaResponseDTO> renovarAssinatura(
            @PathVariable UUID id,
            @AuthenticationPrincipal User userLogado) {
        return ResponseEntity.ok(service.renovarAssinatura(id, userLogado));
    }


}
