import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ROUTES } from '@/lib/constants'

interface AuthLayoutProps {
  /** Texto do selo no painel editorial. */
  badge: string
  /** Citação editorial exibida no painel lateral. */
  quote: string
  /** Conteúdo do formulário. */
  children: ReactNode
}

/**
 * Casca das telas de autenticação.
 * Split de duas colunas: painel editorial escuro à esquerda
 * (oculto no mobile) e o formulário à direita.
 */
export function AuthLayout({ badge, quote, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Painel editorial */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink-900 p-12 text-white lg:flex">
        <Link
          to={ROUTES.home}
          className="relative z-10 font-display text-[1.75rem] font-light"
        >
          Revele <em className="not-italic text-wine-300">.</em>
        </Link>

        <div className="relative z-10 flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 font-mono text-[0.66rem] uppercase tracking-eyebrow text-wine-300">
            <span className="h-1.5 w-1.5 rounded-full bg-wine-300" />
            {badge}
          </span>
          <p className="m-0 max-w-[24ch] font-display text-[2rem] font-light italic leading-snug text-white">
            {quote}
          </p>
          <span className="font-body text-[0.8rem] text-ink-400">
            — Equipe Revele
          </span>
        </div>

        <span className="relative z-10 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-ink-500">
          Cosméticos curados · Clube de assinatura
        </span>

        {/* Anel decorativo */}
        <div
          className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full border border-wine-800"
          aria-hidden
        >
          <div className="absolute inset-12 rounded-full border border-dashed border-wine-800/60" />
        </div>
      </aside>

      {/* Painel do formulário */}
      <main className="flex items-center justify-center bg-bg-soft px-5 py-10 sm:px-8">
        <div className="w-full max-w-[440px]">
          {/* Marca visível só no mobile */}
          <Link
            to={ROUTES.home}
            className="mb-8 block font-display text-[1.5rem] font-light text-ink-900 lg:hidden"
          >
            Revele <em className="not-italic text-wine-600">.</em>
          </Link>
          {children}
        </div>
      </main>
    </div>
  )
}
