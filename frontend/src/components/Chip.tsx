import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/helpers'

interface ChipProps {
  children: ReactNode
  /** Estado ativo (selecionado) — fundo escuro. */
  active?: boolean
  /** Exibe o "×" de remoção (chips de filtro aplicado). */
  removable?: boolean
  onClick?: () => void
  className?: string
}

/**
 * Chip de filtro — pílula clicável.
 * No estado ativo o fundo é ink-900; chips aplicados mostram um "×".
 */
export function Chip({
  children,
  active = false,
  removable = false,
  onClick,
  className,
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5',
        'font-body text-[0.8rem] leading-tight transition-colors duration-150 focus-ring',
        active
          ? 'border-ink-900 bg-ink-900 text-white'
          : 'border-ink-300 bg-white text-ink-700 hover:border-ink-900 hover:text-ink-900',
        className,
      )}
    >
      {children}
      {removable && active && (
        <X className="h-3 w-3 opacity-70" aria-hidden />
      )}
    </button>
  )
}
