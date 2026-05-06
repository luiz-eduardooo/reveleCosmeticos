package com.projeto.security.exception;

import com.projeto.security.DTOS.ErroResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // ===== Validação de @Valid =====
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest req) {

        Map<String, String> erros = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(erro ->
                erros.put(erro.getField(), erro.getDefaultMessage())
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                new ErroResponse(400, "Dados inválidos",
                        "Verifique os campos da requisição", req.getRequestURI(), erros)
        );
    }

    // ===== Recursos não encontrados =====
    @ExceptionHandler(ProdutoNaoEncontradoException.class)
    public ResponseEntity<ErroResponse> handleProdutoNaoEncontrado(
            ProdutoNaoEncontradoException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ErroResponse(404, "Produto não encontrado",
                        ex.getMessage(), req.getRequestURI(), ex.getIdsNaoEncontrados())
        );
    }

    @ExceptionHandler(UsuarioNaoEncontradoException.class)
    public ResponseEntity<ErroResponse> handleUsuarioNaoEncontrado(
            UsuarioNaoEncontradoException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ErroResponse(404, "Usuário não encontrado",
                        ex.getMessage(), req.getRequestURI())
        );
    }

    @ExceptionHandler(PlanoNaoEncontradoException.class)
    public ResponseEntity<ErroResponse> handlePlanoNaoEncontrado(
            PlanoNaoEncontradoException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ErroResponse(404, "Plano não encontrado",
                        ex.getMessage(), req.getRequestURI())
        );
    }

    @ExceptionHandler(AssinaturaInexistenteException.class)
    public ResponseEntity<ErroResponse> handleAssinaturaInexistente(
            AssinaturaInexistenteException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ErroResponse(404, "Assinatura não encontrada",
                        ex.getMessage(), req.getRequestURI())
        );
    }

    // ===== Conflitos (recurso duplicado) =====
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErroResponse> handleUserAlreadyExists(
            UserAlreadyExistsException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ErroResponse(409, "Usuário já cadastrado",
                        ex.getMessage(), req.getRequestURI())
        );
    }

    @ExceptionHandler(ProdutoJaExistenteException.class)
    public ResponseEntity<ErroResponse> handleProdutoJaExistente(
            ProdutoJaExistenteException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ErroResponse(409, "Produto já cadastrado",
                        ex.getMessage(), req.getRequestURI())
        );
    }

    @ExceptionHandler(AssinaturaJaAtivaException.class)
    public ResponseEntity<ErroResponse> handleAssinaturaJaExistente(
            AssinaturaJaAtivaException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ErroResponse(409, "Assinatura já existe",
                        ex.getMessage(), req.getRequestURI())
        );
    }

    // ===== Forbidden (acesso a recurso de outro user) =====
    @ExceptionHandler(UserDistinctException.class)
    public ResponseEntity<ErroResponse> handleUserDistinct(
            UserDistinctException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                new ErroResponse(403, "Operação não permitida",
                        ex.getMessage(), req.getRequestURI())
        );
    }

    // ===== Spring Security =====
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErroResponse> handleBadCredentials(
            BadCredentialsException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new ErroResponse(401, "Credenciais inválidas",
                        "Email ou senha incorretos", req.getRequestURI())
        );
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErroResponse> handleAuthentication(
            AuthenticationException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new ErroResponse(401, "Não autenticado",
                        ex.getMessage(), req.getRequestURI())
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErroResponse> handleAccessDenied(
            AccessDeniedException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                new ErroResponse(403, "Acesso negado",
                        "Você não tem permissão para acessar este recurso", req.getRequestURI())
        );
    }
    @ExceptionHandler(PedidoNaoEncontradoException.class)
    public ResponseEntity<ErroResponse> handlePedidoNaoEncontrado(
            PedidoNaoEncontradoException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ErroResponse(404, "Pedido não encontrado",
                        ex.getMessage(), req.getRequestURI())
        );
    }

    // ===== Fallback genérico (último recurso) =====
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponse> handleGeneric(
            Exception ex, HttpServletRequest req) {
        log.error("Erro não tratado em {}", req.getRequestURI(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ErroResponse(500, "Erro interno do servidor",
                        "Algo deu errado. Tente novamente.", req.getRequestURI())
        );
    }
    @ExceptionHandler(AssinaturaNaoRenovavelException.class)
    public ResponseEntity<ErroResponse> handleAssinaturaNaoRenovavel(
            AssinaturaNaoRenovavelException ex, HttpServletRequest req) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ErroResponse(409, "Assinatura não pode ser renovada",
                        ex.getMessage(), req.getRequestURI())
        );
    }
}