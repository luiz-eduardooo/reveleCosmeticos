import type { ReactNode } from 'react'
import { AlertCircle, RotateCw } from 'lucide-react'
import { Button } from './Button'

/* ──────────────── Error state ──────────────── */

interface ErrorStateProps {
  /** Mensagem de erro legível. */
  message?: string
  /** Callback de retry — exibe o botão "Tentar de novo" se presente. */
  onRetry?: () => void
  /** Título da seção de erro. */
  title?: string
}

/**
 * Estado de erro padrão para falhas de chamada à API.
 * Atende a regra de qualidade: todo componente que chama a API trata
 * loading / erro (mensagem clara + retry) / sucesso.
 */
export function ErrorState({
  message = 'Algo deu errado ao carregar estas informações.',
  onRetry,
  title = 'Não foi possível carregar',
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-pill bg-danger-soft text-danger">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-h4 font-medium text-ink-900">
          {title}
        </h3>
        <p className="m-0 max-w-[44ch] text-small text-ink-600">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCw className="h-3.5 w-3.5" />}
        >
          Tentar de novo
        </Button>
      )}
    </div>
  )
}

/* ──────────────── Empty state ──────────────── */

interface EmptyStateProps {
  /** Ícone decorativo no topo. */
  icon?: ReactNode
  title: string
  description?: string
  /** Slot de ação (geralmente um Button ou Link). */
  action?: ReactNode
}

/**
 * Estado vazio — exibido quando uma listagem retorna sem itens.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-13 text-center">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-pill bg-ink-50 text-ink-400">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <h3 className="font-display text-h4 font-medium text-ink-900">
          {title}
        </h3>
        {description && (
          <p className="m-0 max-w-[44ch] text-small text-ink-600">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}
