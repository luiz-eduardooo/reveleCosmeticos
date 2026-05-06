package com.projeto.security.service;

import com.projeto.security.entities.Produto;
import org.springframework.stereotype.Service;
import java.math.RoundingMode;
import java.math.BigDecimal;

@Service
public class CalculadoraDePrecoService {

    private static final BigDecimal DESCONTO_PADRAO_CLUBE = new BigDecimal("0.20");


    public BigDecimal calcular(Produto produto, boolean isAssinante) {
        if (!produto.getStatusClube() || !isAssinante) {
            return produto.getPreco();
        }

        BigDecimal percentualDesconto = produto.getDescontoEspecial() != null
                ? produto.getDescontoEspecial()
                : DESCONTO_PADRAO_CLUBE;

        BigDecimal multiplicador = BigDecimal.ONE.subtract(percentualDesconto);
        return produto.getPreco()
                .multiply(multiplicador)
                .setScale(2, RoundingMode.HALF_UP);  // ← novo
    }
}