package com.projeto.security.exception;

import lombok.Getter;

import java.util.List;

@Getter
public class ProdutoNaoEncontradoException extends RuntimeException {

    private final List<Long> idsNaoEncontrados;

    public ProdutoNaoEncontradoException(List<Long> idsNaoEncontrados) {
        super("Produtos não encontrados: " + idsNaoEncontrados);
        this.idsNaoEncontrados = idsNaoEncontrados;
    }

    public ProdutoNaoEncontradoException(Long id) {
        this(List.of(id));
    }

}