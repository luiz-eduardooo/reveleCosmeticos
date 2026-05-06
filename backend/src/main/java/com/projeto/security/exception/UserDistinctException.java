package com.projeto.security.exception;

public class UserDistinctException extends RuntimeException {
    public UserDistinctException(String message) {
        super(message);
    }
}
