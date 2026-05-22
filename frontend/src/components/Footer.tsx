import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { useToast } from './Toast'

/**
 * Rodapé do site — bloco escuro com navegação, newsletter e legais.
 * O formulário de newsletter é decorativo (não há endpoint na API):
 * apenas confirma a inscrição via toast.
 */
export function Footer() {
  const toast = useToast()
  const [email, setEmail] = useState('')

  function handleSubscribe() {
    if (!email.trim() || !email.includes('@')) {
      toast.warning('Informe um e-mail válido')
      return
    }
    toast.success('Inscrição confirmada', {
      description: 'Você receberá nossa curadoria mensal.',
    })
    setEmail('')
  }

  return (
    <footer className="mt-13 bg-ink-900 text-ink-200">
      <div className="mx-auto max-w-container px-5 sm:px-8">
        {/* Topo */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
          {/* Marca */}
          <div className="flex max-w-[280px] flex-col gap-4">
            <span className="font-display text-[2rem] font-light text-white">
              Revele <em className="not-italic text-wine-300">.</em>
            </span>
            <p className="m-0 text-[0.9rem] leading-relaxed text-ink-300">
              Cosméticos curados com a mesma atenção que você dedica a si
              mesma.
            </p>
            <div className="mt-1 flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-pill border border-ink-700 text-ink-300 transition-colors hover:border-ink-200 hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Loja */}
          <FooterColumn title="Loja">
            <FooterLink to={ROUTES.produtos}>Todos os produtos</FooterLink>
            <FooterLink to={ROUTES.clube}>Clube Revele</FooterLink>
            <FooterLink to={ROUTES.carrinho}>Minha sacola</FooterLink>
            <FooterLink to={ROUTES.pedidos}>Meus pedidos</FooterLink>
          </FooterColumn>

          {/* Conta */}
          <FooterColumn title="Conta">
            <FooterLink to={ROUTES.login}>Entrar</FooterLink>
            <FooterLink to={ROUTES.cadastro}>Criar conta</FooterLink>
            <FooterLink to={ROUTES.perfil}>Meu perfil</FooterLink>
            <FooterLink to={ROUTES.assinatura}>Minha assinatura</FooterLink>
          </FooterColumn>

          {/* Newsletter */}
          <div>
            <h5 className="m-0 mb-5 font-body text-[0.72rem] font-medium uppercase tracking-eyebrow text-white">
              Receba a curadoria
            </h5>
            <p className="m-0 mb-4 text-[0.88rem] leading-relaxed text-ink-300">
              Um e-mail por mês com novidades, conteúdos sobre cuidado e
              ofertas exclusivas.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
              placeholder="seu@email.com"
              className="w-full border-0 border-b border-ink-700 bg-transparent py-2.5 font-body text-[0.9rem] text-white outline-none placeholder:text-ink-500 focus:border-wine-300"
            />
            <button
              type="button"
              onClick={handleSubscribe}
              className="mt-4 rounded-sm bg-white px-4 py-2.5 font-body text-[0.8rem] font-medium tracking-[0.06em] text-ink-900 transition-colors hover:bg-ink-200"
            >
              Quero receber
            </button>
          </div>
        </div>

        {/* Base */}
        <div className="flex flex-col gap-3 border-t border-ink-800 py-6 text-[0.75rem] text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Revele Cosméticos. CNPJ 00.000.000/0001-00</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-ink-200">
              Termos
            </a>
            <a href="#" className="hover:text-ink-200">
              Privacidade
            </a>
            <a href="#" className="hover:text-ink-200">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h5 className="m-0 mb-5 font-body text-[0.72rem] font-medium uppercase tracking-eyebrow text-white">
        {title}
      </h5>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">{children}</ul>
    </div>
  )
}

function FooterLink({
  to,
  children,
}: {
  to: string
  children: React.ReactNode
}) {
  return (
    <li>
      <Link
        to={to}
        className="text-[0.9rem] text-ink-300 transition-colors hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}
