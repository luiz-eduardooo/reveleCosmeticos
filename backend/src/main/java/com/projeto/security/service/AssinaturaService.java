package com.projeto.security.service;

import com.projeto.security.DTOS.AssinaturaDTO;
import com.projeto.security.DTOS.AssinaturaResponseDTO;
import com.projeto.security.ENUMS.Status;
import com.projeto.security.entities.Assinatura;
import com.projeto.security.entities.Plano;
import com.projeto.security.entities.User;
import com.projeto.security.exception.*;
import com.projeto.security.repositories.AssinaturaRepository;
import com.projeto.security.repositories.PlanoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssinaturaService {
    private final AssinaturaRepository repository;
    private final Clock clock;

    private final PlanoRepository planoRepository;
    private final EmailTemplateService emailTemplate;
    private final EmailService emailService;


    public boolean isAssinante(User user) {
        return repository.findByUserAndStatus(user, Status.ATIVA)
                .map(a -> LocalDateTime.now(clock).isBefore(a.getFimAssinatura()))
                .orElse(false);
    }
    public Assinatura verificarUsuario(UUID idAssinatura, User userLogado){
        Assinatura assinatura = repository.findById(idAssinatura).orElseThrow(()-> new AssinaturaInexistenteException("Assinatura nao encontrada!"));
        if(!assinatura.getUser().getId().equals(userLogado.getId())){
            throw new UserDistinctException("Operação inválida!");
        }
        return assinatura;
    }


    @Transactional
    public AssinaturaResponseDTO criarAssinatura(AssinaturaDTO dto, User userLogado) {
        if (repository.findByUserAndStatus(userLogado, Status.ATIVA).isPresent()) {
            throw new AssinaturaJaAtivaException(
                    "Você já possui uma assinatura. Use o endpoint de renovação."
            );
        }

        Plano plano = planoRepository.findById(dto.planoID())
                .orElseThrow(() -> new PlanoNaoEncontradoException("Plano não encontrado!"));

        LocalDateTime agora = LocalDateTime.now(clock);
        Assinatura assinaturaP = new Assinatura();
        assinaturaP.setUser(userLogado);
        assinaturaP.setStatus(Status.ATIVA);
        assinaturaP.setPlano(plano);
        assinaturaP.setInicioAssinatura(agora);
        assinaturaP.setFimAssinatura(plano.getIntervaloCobranca().calcularFim(agora));

        Assinatura assinatura = repository.save(assinaturaP);

        enviarEmailBoasVindas(assinatura);

        return toResponseDTO(assinatura);
    }

    private void enviarEmailBoasVindas(Assinatura assinatura) {
        String html = emailTemplate.assinaturaCriada(assinatura);
        emailService.enviar(
                assinatura.getUser().getEmail(),
                "Bem-vindo ao clube Revele!",
                html
        );
    }
@Transactional
    public AssinaturaResponseDTO cancelarAssinatura(UUID id, User userLogado){
        return alterarStatus(id, userLogado, Status.CANCELADA);

    }
    private AssinaturaResponseDTO alterarStatus(UUID id, User userLogado, Status status){
        Assinatura assinaturaP = verificarUsuario(id, userLogado);
        assinaturaP.setStatus(status);
        Assinatura assinatura = repository.save(assinaturaP);
        return toResponseDTO(assinatura);
    }
@Transactional
    public AssinaturaResponseDTO pausarAssinatura(UUID id, User userLogado){
        return alterarStatus(id, userLogado, Status.PAUSADA);
    }

    public List<AssinaturaResponseDTO> listarAssinaturas(){
        return repository.findAll().stream().map(this::toResponseDTO).toList();
    }


    private AssinaturaResponseDTO toResponseDTO(Assinatura a) {
        return new AssinaturaResponseDTO(
                a.getId(),
                a.getUser().getName(),
                a.getPlano().getNome(),
                a.getPlano().getPreco(),
                a.getInicioAssinatura(),
                a.getFimAssinatura(),
                a.getStatus()
        );
    }
    @Transactional
    public AssinaturaResponseDTO renovarAssinatura(UUID id, User userLogado) {
        Assinatura assinatura = verificarUsuario(id, userLogado);

        if (assinatura.getStatus() != Status.ATIVA) {
            throw new AssinaturaNaoRenovavelException(
                    "Apenas assinaturas ativas podem ser renovadas. Assine novamente."
            );
        }

        LocalDateTime agora = LocalDateTime.now(clock);
        LocalDateTime baseParaCalculo = assinatura.getFimAssinatura().isBefore(agora)
                ? agora                          // expirou: recomeça do agora
                : assinatura.getFimAssinatura(); // ainda ativa: estende a partir do fim atual

        LocalDateTime novoFim = assinatura.getPlano()
                .getIntervaloCobranca()
                .calcularFim(baseParaCalculo);

        assinatura.setFimAssinatura(novoFim);
        Assinatura salva = repository.save(assinatura);

        enviarEmailRenovacao(salva);

        return toResponseDTO(salva);
    }

    private void enviarEmailRenovacao(Assinatura assinatura) {
        String html = emailTemplate.assinaturaRenovada(assinatura);
        emailService.enviar(
                assinatura.getUser().getEmail(),
                "Assinatura renovada — Revele Cosméticos",
                html
        );
    }

}
