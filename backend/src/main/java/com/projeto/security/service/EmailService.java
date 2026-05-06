package com.projeto.security.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String emailFrom;

    @Value("${app.email.from-nome}")
    private String emailFromNome;

    @Async
    public void enviar(String destinatario, String assunto, String htmlBody) {
        try {
            MimeMessage mensagem = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensagem, true, "UTF-8");

            helper.setFrom(emailFrom, emailFromNome);
            helper.setTo(destinatario);
            helper.setSubject(assunto);
            helper.setText(htmlBody, true);  // true = HTML

            mailSender.send(mensagem);
            log.info("Email enviado para {} — assunto: {}", destinatario, assunto);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Falha ao enviar email para {}: {}", destinatario, e.getMessage(), e);
            // Não relança — falha de email NÃO derruba o caso de uso (ver explicação abaixo)
        }
    }
}