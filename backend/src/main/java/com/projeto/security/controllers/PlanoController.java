package com.projeto.security.controllers;

import com.projeto.security.DTOS.PlanoDTO;
import com.projeto.security.DTOS.PlanoResponseDTO;
import com.projeto.security.service.PlanoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/planos")
public class PlanoController {
    @Autowired
    PlanoService service;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<PlanoResponseDTO> createPlan(@RequestBody @Valid PlanoDTO plano){
        return ResponseEntity.ok().body(service.createPlan(plano));
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<PlanoResponseDTO> putPlan(@PathVariable UUID id, @RequestBody @Valid PlanoDTO plano){
       return ResponseEntity.ok().body(service.putPlan(id, plano));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable UUID id){
        service.deletePlan(id);
        return ResponseEntity.noContent().build();
    }
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/")
    public ResponseEntity<List<PlanoResponseDTO>> listarPlanos(){
        return ResponseEntity.status(200).body(service.getPlano());
    }
}
