package com.projeto.security.user;

import com.projeto.security.entities.Produto;
import com.projeto.security.service.CalculadoraDePrecoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CalculadoraDePrecoServiceTest {

    private CalculadoraDePrecoService calculadora;
    private Produto produto;

    @BeforeEach
    void setUp() {
        calculadora = new CalculadoraDePrecoService();
        produto = new Produto();
        produto.setPreco(new BigDecimal("100.00"));
    }

    // ===== Produto fora do clube =====

    @Test
    void deveRetornarPrecoCheioQuandoProdutoNaoEhDoClubeEUserNaoEhAssinante() {
        produto.setStatusClube(false);
        produto.setDescontoEspecial(null);

        BigDecimal preco = calculadora.calcular(produto, false);

        assertEquals(new BigDecimal("100.00"), preco);
    }

    @Test
    void deveRetornarPrecoCheioQuandoProdutoNaoEhDoClubeEUserEhAssinante() {
        produto.setStatusClube(false);
        produto.setDescontoEspecial(null);

        BigDecimal preco = calculadora.calcular(produto, true);

        assertEquals(new BigDecimal("100.00"), preco);
    }

    // ===== Produto do clube, user não-assinante =====

    @Test
    void deveRetornarPrecoCheioQuandoProdutoEhDoClubeEUserNaoEhAssinante() {
        produto.setStatusClube(true);
        produto.setDescontoEspecial(new BigDecimal("0.30"));

        BigDecimal preco = calculadora.calcular(produto, false);

        assertEquals(new BigDecimal("100.00"), preco);
    }

    // ===== Produto do clube, user assinante (cenários de desconto) =====

    @Test
    void deveAplicarDescontoPadraoDe20PorCentoQuandoNaoTemDescontoEspecial() {
        produto.setStatusClube(true);
        produto.setDescontoEspecial(null);

        BigDecimal preco = calculadora.calcular(produto, true);

        assertEquals(new BigDecimal("80.00"), preco);
    }

    @Test
    void deveAplicarDescontoEspecialQuandoFornecido() {
        produto.setStatusClube(true);
        produto.setDescontoEspecial(new BigDecimal("0.30"));

        BigDecimal preco = calculadora.calcular(produto, true);

        assertEquals(new BigDecimal("70.00"), preco);
    }
}