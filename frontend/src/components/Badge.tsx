import type { ReactNode } from 'react'
import { cn } from '@/lib/helpers'
import type { StatusAssinatura } from '@/types'

/* ──────────────── Badge ──────────────── */

type BadgeVariant =
  | 'club'
  | 'promo'
  | 'new'
  | 'sold'
  | 'soft-wine'
  | 'success'
  | 'warning'

interface BadgeProps {
  variant?: BadgeVariant
  icon?: ReactNode
  children: ReactNode
  className?: string
}

const badgeVariants: Record<BadgeVariant, string> = {
  club: 'bg-wine-600 text-white',
  promo: 'bg-ink-900 text-white',
  new: 'bg-white text-ink-900 border border-ink-900',
  sold: 'bg-ink-100 text-ink-600 border border-ink-200',
  'soft-wine': 'bg-wine-50 text-wine-700 border border-wine-100',
  success: 'bg-success-soft text-success border border-success',
  warning: 'bg-warning-soft text-warning border border-warning',
}

/**
 * Badge — etiqueta curta em caixa alta.
 * Apenas a variante "club" usa vinho de marca; as demais são discretas
 * para não competir com a paleta principal.
 */
export function Badge({
  variant = 'soft-wine',
  icon,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-xs px-2.5 py-[5px]',
        'font-body text-[0.7rem] font-medium uppercase leading-none tracking-wide2',
        badgeVariants[variant],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}

/* ──────────────── Status pill ──────────────── */

type StatusKind =
  | 'active'
  | 'paused'
  | 'cancelled'
  | 'progress'
  | 'shipped'
  | 'delivered'

interface StatusPillProps {
  status: StatusKind
  children: ReactNode
  className?: string
}

const statusVariants: Record<StatusKind, string> = {
  active: 'bg-success-soft text-success',
  paused: 'bg-warning-soft text-warning',
  cancelled: 'bg-ink-100 text-ink-500',
  progress: 'bg-info-soft text-info',
  shipped: 'bg-wine-50 text-wine-700',
  delivered: 'bg-success-soft text-success',
}

/**
 * Pílula de status — com marcador circular antes do texto.
 * Usada em pedidos e assinaturas.
 */
export function StatusPill({ status, children, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill px-2.5 py-[5px]',
        'font-body text-[0.7rem] font-medium uppercase leading-none tracking-[0.1em]',
        statusVariants[status],
        className,
      )}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-current"
        aria-hidden
      />
      {children}
    </span>
  )
}

/* Mapa de StatusAssinatura da API -> StatusPill. */
const assinaturaStatusMap: Record<
  StatusAssinatura,
  { kind: StatusKind; label: string }
> = {
  ATIVA: { kind: 'active', label: 'Ativa' },
  PAUSADA: { kind: 'paused', label: 'Pausada' },
  CANCELADA: { kind: 'cancelled', label: 'Cancelada' },
}

/** Pílula pronta a partir do enum de status de assinatura da API. */
export function AssinaturaStatusPill({
  status,
}: {
  status: StatusAssinatura
}) {
  const cfg = assinaturaStatusMap[status]
  return <StatusPill status={cfg.kind}>{cfg.label}</StatusPill>
}
