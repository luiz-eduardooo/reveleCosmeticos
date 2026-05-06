package com.projeto.security.DTOS;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public record ErroResponse(
        LocalDateTime timestamp,
        int status,
        String erro,
        String mensagem,
        String path,
        Map<String, String> camposInvalidos,  // pra erro de @Valid
        List<Long> idsRelacionados            // pra ProdutoNaoEncontrado
) {
    // Construtor pra erro simples
    public ErroResponse(int status, String erro, String mensagem, String path) {
        this(LocalDateTime.now(), status, erro, mensagem, path, null, null);
    }

    // Construtor pra erro de validação
    public ErroResponse(int status, String erro, String mensagem, String path,
                        Map<String, String> camposInvalidos) {
        this(LocalDateTime.now(), status, erro, mensagem, path, camposInvalidos, null);
    }

    // Construtor pra erro com IDs
    public ErroResponse(int status, String erro, String mensagem, String path,
                        List<Long> idsRelacionados) {
        this(LocalDateTime.now(), status, erro, mensagem, path, null, idsRelacionados);
    }
}