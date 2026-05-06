package com.projeto.security.service;

import com.projeto.security.entities.Assinatura;
import com.projeto.security.entities.Pedido;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class EmailTemplateService {

    private static final DateTimeFormatter FORMATO_DATA =
            DateTimeFormatter.ofPattern("dd/MM/yyyy 'às' HH:mm", new Locale("pt", "BR"));


    public String assinaturaRenovada(Assinatura assinatura) {
        String nomeUsuario = assinatura.getUser().getName();
        String nomePlano = assinatura.getPlano().getNome();
        String novoFim = assinatura.getFimAssinatura().format(FORMATO_DATA);

        return String.format("""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h1 style="color: #333;">Assinatura renovada!</h1>
            <p>Olá %s,</p>
            <p>Sua assinatura do plano <strong>%s</strong> foi renovada com sucesso.</p>
            <p>Novo vencimento: <strong>%s</strong>.</p>
            <p>Continue aproveitando os descontos exclusivos do clube.</p>
            <p>— Revele Cosméticos</p>
        </body>
        </html>
        """, nomeUsuario, nomePlano, novoFim);
    }

    public String pedidoConfirmado(Pedido pedido) {
        String nomeUsuario = pedido.getUser().getName();
        String dataFormatada = pedido.getDataPedido().format(FORMATO_DATA);

        StringBuilder itens = new StringBuilder();
        pedido.getItens().forEach(item -> {
            itens.append("<li>")
                    .append(item.getProduto().getNome())
                    .append(" — Qtd: ").append(item.getQuantidade())
                    .append(" — R$ ").append(item.getSubtotal())
                    .append("</li>");
        });

        return String.format("""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h1 style="color: #333;">Pedido confirmado!</h1>
                <p>Olá %s,</p>
                <p>Seu pedido foi recebido com sucesso em %s.</p>
                <h3>Itens:</h3>
                <ul>%s</ul>
                <p><strong>Total: R$ %s</strong></p>
                <p>Em breve você receberá novidades sobre o status.</p>
                <p>— Revele Cosméticos</p>
            </body>
            </html>
            """, nomeUsuario, dataFormatada, itens.toString(), pedido.getValorTotalPedido());
    }

    public String assinaturaCriada(Assinatura assinatura) {
        String nomeUsuario = assinatura.getUser().getName();
        String nomePlano = assinatura.getPlano().getNome();
        String fimAssinatura = assinatura.getFimAssinatura().format(FORMATO_DATA);

        return String.format("""
            <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h1 style="color: #333;">Bem-vindo ao clube Revele!</h1>
                <p>Olá %s,</p>
                <p>Sua assinatura do plano <strong>%s</strong> foi ativada.</p>
                <p>Próxima cobrança em: <strong>%s</strong>.</p>
                <p>A partir de agora, você tem acesso aos descontos exclusivos do clube.</p>
                <p>— Revele Cosméticos</p>
            </body>
            </html>
            """, nomeUsuario, nomePlano, fimAssinatura);
    }
}