package com.projeto.security.user;

import com.projeto.security.DTOS.AssinaturaDTO;
import com.projeto.security.DTOS.AssinaturaResponseDTO;
import com.projeto.security.ENUMS.Cobranca;
import com.projeto.security.ENUMS.Status;
import com.projeto.security.entities.Assinatura;
import com.projeto.security.entities.Plano;
import com.projeto.security.entities.User;
import com.projeto.security.exception.*;
import com.projeto.security.repositories.AssinaturaRepository;
import com.projeto.security.repositories.PlanoRepository;
import com.projeto.security.service.AssinaturaService;
import com.projeto.security.service.EmailService;
import com.projeto.security.service.EmailTemplateService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssinaturaServiceTest {

    @Mock private AssinaturaRepository repository;
    @Mock private PlanoRepository planoRepository;
    @Mock private EmailService emailService;
    @Mock private EmailTemplateService emailTemplate;

    private final Clock clockFixo = Clock.fixed(
            Instant.parse("2026-04-22T10:00:00Z"),
            ZoneOffset.UTC
    );

    private AssinaturaService service;
    private User userTeste;
    private Plano plano;

    @BeforeEach
    void setUp() {
        service = new AssinaturaService(
                repository, clockFixo, planoRepository,
                emailTemplate, emailService
        );

        userTeste = new User();
        userTeste.setId(UUID.randomUUID());
        userTeste.setName("Luiz");
        userTeste.setEmail("luiz@teste.com");

        plano = new Plano();
        plano.setId(UUID.randomUUID());
        plano.setNome("Clube Revele Mensal");
        plano.setPreco(new BigDecimal("30.00"));
        plano.setIntervaloCobranca(Cobranca.MENSAL);
    }

    // ===== criarAssinatura =====

    @Test
    void deveCriarAssinaturaComDatasCorretasEStatusAtiva() {
        when(repository.findByUserAndStatus(userTeste, Status.ATIVA)).thenReturn(Optional.empty());
        when(planoRepository.findById(plano.getId())).thenReturn(Optional.of(plano));
        when(repository.save(any(Assinatura.class))).thenAnswer(inv -> {
            Assinatura a = inv.getArgument(0);
            a.setId(UUID.randomUUID());
            return a;
        });

        AssinaturaResponseDTO result = service.criarAssinatura(
                new AssinaturaDTO(plano.getId()), userTeste
        );

        LocalDateTime inicioEsperado = LocalDateTime.of(2026, 4, 22, 10, 0);
        ArgumentCaptor<Assinatura> captor = ArgumentCaptor.forClass(Assinatura.class);
        verify(repository).save(captor.capture());
        Assinatura salva = captor.getValue();

        assertEquals(Status.ATIVA, salva.getStatus());
        assertEquals(inicioEsperado, salva.getInicioAssinatura());
        assertEquals(inicioEsperado.plusMonths(1), salva.getFimAssinatura());
        assertEquals(userTeste, salva.getUser());
        assertEquals(plano, salva.getPlano());
    }

    @Test
    void naoDeveCriarAssinaturaSeUserJaTemAtiva() {
        Assinatura existente = new Assinatura();
        existente.setStatus(Status.ATIVA);
        existente.setFimAssinatura(LocalDateTime.of(2026, 5, 22, 10, 0));

        when(repository.findByUserAndStatus(userTeste, Status.ATIVA))
                .thenReturn(Optional.of(existente));

        assertThrows(AssinaturaJaAtivaException.class, () ->
                service.criarAssinatura(new AssinaturaDTO(plano.getId()), userTeste)
        );
        verify(repository, never()).save(any());
    }

    @Test
    void naoDeveCriarAssinaturaSePlanoNaoExiste() {
        when(repository.findByUserAndStatus(userTeste, Status.ATIVA)).thenReturn(Optional.empty());
        when(planoRepository.findById(plano.getId())).thenReturn(Optional.empty());

        assertThrows(PlanoNaoEncontradoException.class, () ->
                service.criarAssinatura(new AssinaturaDTO(plano.getId()), userTeste)
        );
        verify(repository, never()).save(any());
    }

    @Test
    void deveEnviarEmailAposCriarAssinatura() {
        when(repository.findByUserAndStatus(userTeste, Status.ATIVA)).thenReturn(Optional.empty());
        when(planoRepository.findById(plano.getId())).thenReturn(Optional.of(plano));
        when(repository.save(any(Assinatura.class))).thenAnswer(inv -> inv.getArgument(0));
        when(emailTemplate.assinaturaCriada(any(Assinatura.class))).thenReturn("<html>...</html>");

        service.criarAssinatura(new AssinaturaDTO(plano.getId()), userTeste);

        verify(emailService).enviar(eq("luiz@teste.com"), anyString(), eq("<html>...</html>"));
    }

    // ===== isAssinante =====

    @Test
    void isAssinanteDeveRetornarTrueQuandoTemAtivaDentroDoPrazo() {
        Assinatura ativa = new Assinatura();
        ativa.setStatus(Status.ATIVA);
        ativa.setFimAssinatura(LocalDateTime.of(2026, 5, 22, 10, 0));  // futuro

        when(repository.findByUserAndStatus(userTeste, Status.ATIVA))
                .thenReturn(Optional.of(ativa));

        assertTrue(service.isAssinante(userTeste));
    }

    @Test
    void isAssinanteDeveRetornarFalseQuandoAtivaJaExpirou() {
        Assinatura expirada = new Assinatura();
        expirada.setStatus(Status.ATIVA);
        expirada.setFimAssinatura(LocalDateTime.of(2026, 4, 1, 10, 0));  // passado

        when(repository.findByUserAndStatus(userTeste, Status.ATIVA))
                .thenReturn(Optional.of(expirada));

        assertFalse(service.isAssinante(userTeste));
    }

    @Test
    void isAssinanteDeveRetornarFalseQuandoNaoTemAssinatura() {
        when(repository.findByUserAndStatus(userTeste, Status.ATIVA))
                .thenReturn(Optional.empty());

        assertFalse(service.isAssinante(userTeste));
    }

    // ===== cancelar =====

    @Test
    void deveCancelarAssinatura() {
        UUID id = UUID.randomUUID();
        Assinatura assinatura = criarAssinaturaPadrao(id);
        when(repository.findById(id)).thenReturn(Optional.of(assinatura));
        when(repository.save(any(Assinatura.class))).thenReturn(assinatura);

        AssinaturaResponseDTO result = service.cancelarAssinatura(id, userTeste);

        assertEquals(Status.CANCELADA, assinatura.getStatus());
        verify(repository).save(assinatura);
    }

    @Test
    void naoDeveCancelarAssinaturaInexistente() {
        UUID id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(AssinaturaInexistenteException.class, () ->
                service.cancelarAssinatura(id, userTeste)
        );
        verify(repository, never()).save(any());
    }

    @Test
    void naoDeveCancelarAssinaturaDeOutroUser() {
        User outro = new User();
        outro.setId(UUID.randomUUID());
        UUID id = UUID.randomUUID();
        Assinatura assinatura = criarAssinaturaPadrao(id);
        when(repository.findById(id)).thenReturn(Optional.of(assinatura));

        assertThrows(UserDistinctException.class, () ->
                service.cancelarAssinatura(id, outro)
        );
        verify(repository, never()).save(any());
    }

    // ===== pausar =====

    @Test
    void devePausarAssinatura() {
        UUID id = UUID.randomUUID();
        Assinatura assinatura = criarAssinaturaPadrao(id);
        when(repository.findById(id)).thenReturn(Optional.of(assinatura));
        when(repository.save(any(Assinatura.class))).thenReturn(assinatura);

        service.pausarAssinatura(id, userTeste);

        assertEquals(Status.PAUSADA, assinatura.getStatus());
        verify(repository).save(assinatura);
    }

    @Test
    void naoDevePausarAssinaturaInexistente() {
        UUID id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(AssinaturaInexistenteException.class, () ->
                service.pausarAssinatura(id, userTeste)
        );
        verify(repository, never()).save(any());
    }

    @Test
    void naoDevePausarAssinaturaDeOutroUser() {
        User outro = new User();
        outro.setId(UUID.randomUUID());
        UUID id = UUID.randomUUID();
        Assinatura assinatura = criarAssinaturaPadrao(id);
        when(repository.findById(id)).thenReturn(Optional.of(assinatura));

        assertThrows(UserDistinctException.class, () ->
                service.pausarAssinatura(id, outro)
        );
        verify(repository, never()).save(any());
    }

    // ===== Helper =====

    private Assinatura criarAssinaturaPadrao(UUID id) {
        Assinatura a = new Assinatura();
        a.setId(id);
        a.setUser(userTeste);
        a.setPlano(plano);
        a.setStatus(Status.ATIVA);
        a.setInicioAssinatura(LocalDateTime.of(2026, 4, 22, 10, 0));
        a.setFimAssinatura(LocalDateTime.of(2026, 5, 22, 10, 0));
        return a;
    }
    // ===== renovar =====

    @Test
    void deveRenovarAssinaturaAtivaEstendendoOFimAtual() {
        UUID id = UUID.randomUUID();
        Assinatura assinatura = criarAssinaturaPadrao(id);
        // fim = 22/maio (mês após o clockFixo de 22/abril)
        LocalDateTime fimAtual = LocalDateTime.of(2026, 5, 22, 10, 0);
        assinatura.setFimAssinatura(fimAtual);

        when(repository.findById(id)).thenReturn(Optional.of(assinatura));
        when(repository.save(any(Assinatura.class))).thenReturn(assinatura);
        when(emailTemplate.assinaturaRenovada(any(Assinatura.class))).thenReturn("<html>...</html>");

        service.renovarAssinatura(id, userTeste);

        // Estendeu a partir do fim atual: 22/maio + 1 mês = 22/junho
        assertEquals(LocalDateTime.of(2026, 6, 22, 10, 0), assinatura.getFimAssinatura());
        verify(repository).save(assinatura);
    }

    @Test
    void deveRenovarAssinaturaExpiradaRecomeçandoDeAgora() {
        UUID id = UUID.randomUUID();
        Assinatura assinatura = criarAssinaturaPadrao(id);
        // fim = 1/abril (antes do clockFixo de 22/abril) — expirada
        assinatura.setFimAssinatura(LocalDateTime.of(2026, 4, 1, 10, 0));

        when(repository.findById(id)).thenReturn(Optional.of(assinatura));
        when(repository.save(any(Assinatura.class))).thenReturn(assinatura);
        when(emailTemplate.assinaturaRenovada(any(Assinatura.class))).thenReturn("<html>...</html>");

        service.renovarAssinatura(id, userTeste);

        // Recomeçou de agora (22/abril): 22/abril + 1 mês = 22/maio
        assertEquals(LocalDateTime.of(2026, 5, 22, 10, 0), assinatura.getFimAssinatura());
    }

    @Test
    void naoDeveRenovarAssinaturaCancelada() {
        UUID id = UUID.randomUUID();
        Assinatura assinatura = criarAssinaturaPadrao(id);
        assinatura.setStatus(Status.CANCELADA);

        when(repository.findById(id)).thenReturn(Optional.of(assinatura));

        assertThrows(AssinaturaNaoRenovavelException.class, () ->
                service.renovarAssinatura(id, userTeste)
        );
        verify(repository, never()).save(any());
    }

    @Test
    void naoDeveRenovarAssinaturaPausada() {
        UUID id = UUID.randomUUID();
        Assinatura assinatura = criarAssinaturaPadrao(id);
        assinatura.setStatus(Status.PAUSADA);

        when(repository.findById(id)).thenReturn(Optional.of(assinatura));

        assertThrows(AssinaturaNaoRenovavelException.class, () ->
                service.renovarAssinatura(id, userTeste)
        );
        verify(repository, never()).save(any());
    }

    @Test
    void naoDeveRenovarAssinaturaInexistente() {
        UUID id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(AssinaturaInexistenteException.class, () ->
                service.renovarAssinatura(id, userTeste)
        );
        verify(repository, never()).save(any());
    }

    @Test
    void naoDeveRenovarAssinaturaDeOutroUser() {
        User outro = new User();
        outro.setId(UUID.randomUUID());
        UUID id = UUID.randomUUID();
        Assinatura assinatura = criarAssinaturaPadrao(id);
        when(repository.findById(id)).thenReturn(Optional.of(assinatura));

        assertThrows(UserDistinctException.class, () ->
                service.renovarAssinatura(id, outro)
        );
        verify(repository, never()).save(any());
    }

    @Test
    void deveEnviarEmailAposRenovar() {
        UUID id = UUID.randomUUID();
        Assinatura assinatura = criarAssinaturaPadrao(id);
        when(repository.findById(id)).thenReturn(Optional.of(assinatura));
        when(repository.save(any(Assinatura.class))).thenReturn(assinatura);
        when(emailTemplate.assinaturaRenovada(any(Assinatura.class))).thenReturn("<html>...</html>");

        service.renovarAssinatura(id, userTeste);

        verify(emailService).enviar(eq("luiz@teste.com"), anyString(), eq("<html>...</html>"));
    }
}