package com.projeto.security.service;

import com.projeto.security.DTOS.*;
import com.projeto.security.DTOS.user.UserCadastroDTO;
import com.projeto.security.DTOS.user.UserLoginDTO;
import com.projeto.security.DTOS.user.UserResponseDTO;
import com.projeto.security.DTOS.user.UserUpdateDTO;
import com.projeto.security.entities.User;
import com.projeto.security.exception.UserAlreadyExistsException;
import com.projeto.security.exception.UserDistinctException;
import com.projeto.security.exception.UsuarioNaoEncontradoException;
import com.projeto.security.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;

    public UserResponseDTO registerUser(UserCadastroDTO dados){
        User user = new User();
        user.setName(dados.name());
        user.setEmail(dados.email());
        user.setCpf(dados.cpf());
        user.setPassword(passwordEncoder.encode(dados.password()));
        if(repository.existsByEmailOrCpf(user.getEmail(), user.getCpf())){
            throw new UserAlreadyExistsException("Usuário ja existe!");
        }
        User userSalvo = repository.save(user);
        return toResponseDTO(userSalvo);
    }

    public TokenResponseDTO loginUser(UserLoginDTO dados){
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(dados.email(), dados.password());
        User user = (User) authenticationManager.authenticate(authentication).getPrincipal();
        return new TokenResponseDTO(tokenService.gerarToken(user));
    }

    public UserResponseDTO putUser(UUID id, UserUpdateDTO dados, User userLogado){
        if(!userLogado.getId().equals(id)){
            throw new UserDistinctException("Você só pode editar seu próprio perfil!");
        }

        if (dados.email() != null) userLogado.setEmail(dados.email());
        if (dados.name() != null) userLogado.setName(dados.name());

        User userSalvo = repository.save(userLogado);
        return toResponseDTO(userSalvo);
    }

    public void deleteUser(UUID id){
        User user = repository.findById(id).orElseThrow(()-> new UsuarioNaoEncontradoException("Usuário não encontrado!"));
        repository.delete(user);
    }

    public List<UserResponseDTO> listUsers(){
        return repository.findAll().stream().map(this::toResponseDTO)
                .toList();
    }

    public UserResponseDTO getProfile(User userLogado){
        return toResponseDTO(userLogado);
    }

    private UserResponseDTO toResponseDTO(User userLogado){
        return new UserResponseDTO(userLogado.getEmail(), userLogado.getCpf(), userLogado.getName(), userLogado.getId());
    }

}
