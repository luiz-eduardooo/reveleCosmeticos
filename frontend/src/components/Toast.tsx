import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/helpers'

/* ──────────────── Tipos ──────────────── */

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: number
  variant: ToastVariant
  title: string
  description?: string
}

interface ToastOptions {
  description?: string
  /** Duração em ms antes do auto-dismiss (padrão 5000; 0 desativa). */
  duration?: number
}

interface ToastContextValue {
  success: (title: string, options?: ToastOptions) => void
  error: (title: string, options?: ToastOptions) => void
  warning: (title: string, options?: ToastOptions) => void
  info: (title: string, options?: ToastOptions) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

/* ──────────────── Provider ──────────────── */

const DEFAULT_DURATION = 5000

/**
 * Provedor de toasts.
 * Renderiza a pilha no canto superior direito (desktop) / inferior
 * central (mobile), com auto-dismiss em 5s.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const push = useCallback(
    (variant: ToastVariant, title: string, options?: ToastOptions) => {
      const id = ++counter.current
      const toast: Toast = {
        id,
        variant,
        title,
        description: options?.description,
      }
      setToasts((prev) => [...prev, toast])

      const duration = options?.duration ?? DEFAULT_DURATION
      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration)
        timers.current.set(id, timer)
      }
    },
    [dismiss],
  )

  const value = useMemo<ToastContextValue>(
    () => ({
      success: (title, opts) => push('success', title, opts),
      error: (title, opts) => push('error', title, opts),
      warning: (title, opts) => push('warning', title, opts),
      info: (title, opts) => push('info', title, opts),
      dismiss,
    }),
    [push, dismiss],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

/** Hook de acesso ao sistema de toasts. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast deve ser usado dentro de <ToastProvider>')
  }
  return ctx
}

/* ──────────────── Apresentação ──────────────── */

const variantConfig: Record<
  ToastVariant,
  { icon: ReactNode; accent: string; iconColor: string }
> = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5" />,
    accent: 'border-l-success',
    iconColor: 'text-success',
  },
  error: {
    icon: <XCircle className="h-5 w-5" />,
    accent: 'border-l-danger',
    iconColor: 'text-danger',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" />,
    accent: 'border-l-warning',
    iconColor: 'text-warning',
  },
  info: {
    icon: <Info className="h-5 w-5" />,
    accent: 'border-l-ink-900',
    iconColor: 'text-info',
  },
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[]
  onDismiss: (id: number) => void
}) {
  if (toasts.length === 0) return null

  return createPortal(
    <div
      className={cn(
        'pointer-events-none fixed z-[200] flex flex-col gap-3',
        // mobile: inferior central — desktop: superior direito
        'bottom-6 left-1/2 -translate-x-1/2',
        'sm:bottom-auto sm:left-auto sm:right-6 sm:top-6 sm:translate-x-0',
      )}
      role="region"
      aria-label="Notificações"
    >
      {toasts.map((toast) => {
        const cfg = variantConfig[toast.variant]
        return (
          <div
            key={toast.id}
            role="alert"
            className={cn(
              'pointer-events-auto flex w-[min(380px,calc(100vw-3rem))] items-start gap-4',
              'rounded-md border border-ink-200 border-l-[3px] bg-white px-5 py-4 shadow-e3',
              cfg.accent,
            )}
          >
            <span className={cn('mt-px flex-shrink-0', cfg.iconColor)}>
              {cfg.icon}
            </span>
            <div className="min-w-0 flex-1">
              <b className="block text-[0.9rem] font-medium text-ink-900">
                {toast.title}
              </b>
              {toast.description && (
                <p className="m-0 mt-0.5 text-[0.8rem] leading-relaxed text-ink-600">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Fechar notificação"
              className="-mr-1 flex-shrink-0 rounded-sm p-0.5 text-ink-500 hover:text-ink-900 focus-ring"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>,
    document.body,
  )
}
