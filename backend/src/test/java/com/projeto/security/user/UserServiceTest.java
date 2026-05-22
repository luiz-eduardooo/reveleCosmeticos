package com.projeto.security.user;
import com.projeto.security.DTOS.user.*;
import com.projeto.security.entities.User;
import com.projeto.security.exception.UserAlreadyExistsException;
import com.projeto.security.exception.UserDistinctException;
import com.projeto.security.exception.UsuarioNaoEncontradoException;
import com.projeto.security.repositories.UserRepository;
import com.projeto.security.service.TokenService;
import com.projeto.security.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository repository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private TokenService tokenService;
    @Mock private AuthenticationManager authenticationManager;

    private UserService service;

    private User userTeste;

    @BeforeEach
    void setUp() {
        service = new UserService(repository, passwordEncoder, tokenService, authenticationManager);

        userTeste = new User();
        userTeste.setId(UUID.randomUUID());
        userTeste.setName("Luiz");
        userTeste.setEmail("luiz@teste.com");
        userTeste.setCpf("12345678901");
        userTeste.setPassword("senhaCriptografada");
    }

    // ===== registerUser =====

    @Test
    void deveCadastrarUserComSenhaCriptografada() {
        UserCadastroDTO dto = new UserCadastroDTO("Luiz", "luiz@teste.com", "12345678901", "senha123");
        when(repository.existsByEmailOrCpf(dto.email(), dto.cpf())).thenReturn(false);
        when(passwordEncoder.encode("senha123")).thenReturn("senhaCriptografada");
        when(repository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(UUID.randomUUID());
            return u;
        });

        UserResponseDTO result = service.registerUser(dto);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(repository).save(captor.capture());
        User salvo = captor.getValue();
        assertEquals("senhaCriptografada", salvo.getPassword());
        assertEquals("luiz@teste.com", result.email());
        assertEquals("Luiz", result.name());
    }

    @Test
    void naoDeveCadastrarUserComEmailOuCpfJaExistente() {
        UserCadastroDTO dto = new UserCadastroDTO("Luiz", "luiz@teste.com", "12345678901", "senha123");
        when(repository.existsByEmailOrCpf(dto.email(), dto.cpf())).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> service.registerUser(dto));
        verify(repository, never()).save(any());
    }

    // ===== loginUser =====

    @Test
    void deveLogarERetornarToken() {
        UserLoginDTO dto = new UserLoginDTO("luiz@teste.com", "senha123");
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(userTeste);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenService.gerarToken(userTeste)).thenReturn("jwt-token-fake");

        LoginResponseDTO result = service.loginUser(dto);

        assertEquals("jwt-token-fake", result.token());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    // ===== putUser =====

    @Test
    void deveAtualizarApenasCamposEnviadosNoUpdate() {
        UserUpdateDTO dto = new UserUpdateDTO(null, "Luiz Novo");
        when(repository.save(any(User.class))).thenReturn(userTeste);

        UserResponseDTO result = service.putUser(userTeste.getId(), dto, userTeste);

        assertEquals("Luiz Novo", userTeste.getName());
        assertEquals("luiz@teste.com", userTeste.getEmail());  // não mudou (null no DTO)
        assertEquals("Luiz Novo", result.name());
    }

    @Test
    void naoDeveAtualizarPerfilDeOutroUser() {
        UUID idDeOutro = UUID.randomUUID();
        UserUpdateDTO dto = new UserUpdateDTO(null, "Tentativa Maliciosa");

        assertThrows(UserDistinctException.class, () ->
                service.putUser(idDeOutro, dto, userTeste)
        );
        verify(repository, never()).save(any());
    }

    // ===== deleteUser =====

    @Test
    void deveDeletarUserExistente() {
        when(repository.findById(userTeste.getId())).thenReturn(Optional.of(userTeste));

        service.deleteUser(userTeste.getId());

        verify(repository).delete(userTeste);
    }

    @Test
    void naoDeveDeletarUserInexistente() {
        UUID idInexistente = UUID.randomUUID();
        when(repository.findById(idInexistente)).thenReturn(Optional.empty());

        assertThrows(UsuarioNaoEncontradoException.class, () ->
                service.deleteUser(idInexistente)
        );
        verify(repository, never()).delete(any());
    }

    // ===== listUsers =====

    @Test
    void deveListarTodosOsUsers() {
        when(repository.findAll()).thenReturn(List.of(userTeste));

        List<UserResponseDTO> result = service.listUsers();

        assertEquals(1, result.size());
        assertEquals("luiz@teste.com", result.get(0).email());
    }

    // ===== getProfile =====

    @Test
    void deveRetornarPerfilDoUserLogado() {
        UserResponseDTO result = service.getProfile(userTeste);

        assertEquals(userTeste.getId(), result.id());
        assertEquals("luiz@teste.com", result.email());
        assertEquals("Luiz", result.name());
    }
}