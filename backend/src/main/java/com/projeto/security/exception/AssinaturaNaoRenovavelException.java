package com.projeto.security.exception;

public class AssinaturaNaoRenovavelException extends RuntimeException {
    public AssinaturaNaoRenovavelException(String message) {
        super(message);
    }
}
