package com.projeto.security.security;

import com.projeto.security.entities.User;
import com.projeto.security.repositories.UserRepository;
import com.projeto.security.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
@AllArgsConstructor
@Slf4j
public class SecurityFilter extends OncePerRequestFilter {
    private final TokenService tokenService;

    private final UserRepository repository;

    private String recoverToken(HttpServletRequest request){
        String authorization = request.getHeader("Authorization");
        if(authorization == null || !authorization.startsWith("Bearer ")){
            return null;
        }
        return authorization.replace("Bearer ", "");
    }


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = recoverToken(request);
        try{if (token != null) {
            User user = repository.findByEmail(tokenService.validarToken(token)).orElseThrow(()-> new UsernameNotFoundException("Usuario não encontrado"));
            var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);


        }}
        catch (Exception e){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Token inválido ou expirado\"}");
            return;
        }
        log.debug("Requisição: {} {}", request.getMethod(), request.getRequestURI());
        filterChain.doFilter(request, response);
    }
}
