package com.projeto.security.ENUMS;

import java.time.LocalDateTime;

public enum Cobranca {
    MENSAL(1),
    TRIMESTRAL(3),
    ANUAL(12);

    private final int meses;

    Cobranca(int meses) {
        this.meses = meses;
    }

        public LocalDateTime calcularFim(LocalDateTime agora){
            return agora.plusMonths(meses);
        }
}
