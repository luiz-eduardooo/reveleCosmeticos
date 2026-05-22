import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/helpers'

/* ──────────────── Card base ──────────────── */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adiciona elevação em hover (cards clicáveis). */
  hoverable?: boolean
  /** Remove o padding interno padrão. */
  flush?: boolean
}

/**
 * Contêiner base — borda fina, raio md, fundo branco.
 * Usado como casca para conteúdos diversos.
 */
export function Card({
  hoverable = false,
  flush = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-ink-200 bg-white',
        !flush && 'p-7',
        hoverable &&
          'transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-e3',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/* ──────────────── Info card ──────────────── */

interface InfoCardProps {
  /** Ícone exibido no selo circular vinho-claro. */
  icon: ReactNode
  title: string
  children: ReactNode
  className?: string
}

/** Card informativo — selo de ícone + título serif + descrição. */
export function InfoCard({ icon, title, children, className }: InfoCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-md border border-ink-200 bg-white p-7',
        className,
      )}
    >
      <div className="mb-3 flex h-[42px] w-[42px] items-center justify-center rounded-pill bg-wine-50 text-wine-700">
        {icon}
      </div>
      <h4 className="font-display text-[1.35rem] font-medium text-ink-900">
        {title}
      </h4>
      <p className="m-0 text-[0.95rem] leading-relaxed text-ink-600">
        {children}
      </p>
    </div>
  )
}

/* ──────────────── Featured card ──────────────── */

interface FeaturedCardProps {
  eyebrow?: string
  title: string
  children: ReactNode
  /** Slot de ação no rodapé (geralmente um Button). */
  action?: ReactNode
  className?: string
}

/**
 * Card de destaque — fundo em degradê vinho-claro e selo decorativo.
 * Reservado para chamadas do Clube e ofertas de marca.
 */
export function FeaturedCard({
  eyebrow,
  title,
  children,
  action,
  className,
}: FeaturedCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col gap-4 overflow-hidden rounded-md border border-wine-100 p-8',
        'bg-gradient-to-b from-wine-50 to-white',
        className,
      )}
    >
      {eyebrow && (
        <span className="eyebrow text-wine-600">{eyebrow}</span>
      )}
      <h4 className="font-display text-h3 font-normal leading-tight text-ink-900">
        {title}
      </h4>
      <p className="m-0 max-w-[36ch] text-[0.95rem] text-ink-700">
        {children}
      </p>
      {action && <div className="mt-3">{action}</div>}

      {/* Selo decorativo */}
      <div
        className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 rounded-full border border-wine-200 opacity-50"
        aria-hidden
      >
        <div className="absolute inset-[18px] rounded-full border border-dashed border-wine-300" />
      </div>
    </div>
  )
}
