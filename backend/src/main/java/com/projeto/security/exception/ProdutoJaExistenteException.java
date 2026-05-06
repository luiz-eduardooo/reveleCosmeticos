package com.projeto.security.exception;

public class ProdutoJaExistenteException extends RuntimeException {
    public ProdutoJaExistenteException(String message) {
        super(message);
    }
}
