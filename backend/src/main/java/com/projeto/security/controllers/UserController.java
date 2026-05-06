package com.projeto.security.controllers;

import com.projeto.security.DTOS.*;
import com.projeto.security.DTOS.user.UserCadastroDTO;
import com.projeto.security.DTOS.user.UserLoginDTO;
import com.projeto.security.DTOS.user.UserResponseDTO;
import com.projeto.security.DTOS.user.UserUpdateDTO;
import com.projeto.security.entities.User;
import com.projeto.security.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/usuarios")
@AllArgsConstructor
public class UserController {

    private final UserService service;


    @PostMapping("/cadastrar")
    public ResponseEntity<UserResponseDTO> userRegister(@RequestBody @Valid UserCadastroDTO dto){
        return ResponseEntity.ok().body(service.registerUser(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDTO> userLogin(@RequestBody @Valid UserLoginDTO dto){
        return ResponseEntity.ok().body(service.loginUser(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id){
        service.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> putUser(@PathVariable UUID id, @RequestBody @Valid UserUpdateDTO dados,
                                                   @AuthenticationPrincipal User userLogado){
        return ResponseEntity.ok().body(service.putUser(id, dados, userLogado));
    }

    @GetMapping("/admin/users")
    public ResponseEntity<List<UserResponseDTO>> getUsers(){
        return ResponseEntity.status(200).body(service.listUsers());
    }

    @GetMapping("/perfil")
    public ResponseEntity<UserResponseDTO> getProfile(@AuthenticationPrincipal User userLogado){
        return ResponseEntity.status(200).body(service.getProfile(userLogado));
    }

}
