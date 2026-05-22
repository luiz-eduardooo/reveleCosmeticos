import { cn } from '@/lib/helpers'

type SpinnerSize = 'sm' | 'md' | 'lg'

interface SpinnerProps {
  size?: SpinnerSize
  /** Centraliza o spinner num bloco com padding (estado de loading de página). */
  centered?: boolean
  /** Texto opcional exibido abaixo do spinner quando centralizado. */
  label?: string
  className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-[3px]',
}

/**
 * Indicador de carregamento circular.
 * Usado em botões (sm) e como estado de loading de seções (centered).
 */
export function Spinner({
  size = 'md',
  centered = false,
  label,
  className,
}: SpinnerProps) {
  const circle = (
    <span
      role="status"
      aria-label={label ?? 'Carregando'}
      className={cn(
        'inline-block animate-spin rounded-full border-ink-200 border-t-wine-600',
        sizeClasses[size],
        className,
      )}
    />
  )

  if (!centered) return circle

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      {circle}
      {label && (
        <span className="font-mono text-micro uppercase tracking-eyebrow text-ink-500">
          {label}
        </span>
      )}
    </div>
  )
}
