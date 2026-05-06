package com.projeto.security.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.projeto.security.entities.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class TokenService {
    @Value("${api.security.token.secret}")
    private String secretKey;
    public String gerarToken(UserDetails user){
        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        return JWT.create().withSubject(user.getUsername()).withIssuedAt(new Date(System.currentTimeMillis()))
                .withExpiresAt(new Date(System.currentTimeMillis()+ 1000L * 60 * 60 * 24)).sign(algorithm);
    }

    public String validarToken(String token){
        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        return JWT.require(algorithm).build().verify(token).getSubject();
    }
}
