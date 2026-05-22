import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children?: ReactNode
  /** Slot de ações no rodapé (geralmente botões). */
  footer?: ReactNode
  /** Largura máxima do modal. */
  size?: 'sm' | 'md'
  /** Esconde o botão X do canto. */
  hideCloseButton?: boolean
}

/**
 * Modal base — renderizado em portal, com overlay escuro.
 * Fecha ao pressionar ESC ou clicar fora; trava o scroll do body
 * enquanto aberto e devolve o foco ao elemento anterior ao fechar.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'sm',
  hideCloseButton = false,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  // Fecha com ESC e trava o scroll do body.
  useEffect(() => {
    if (!open) return

    previousFocus.current = document.activeElement as HTMLElement

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Move o foco para o diálogo.
    dialogRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = originalOverflow
      previousFocus.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/45 p-6"
      onMouseDown={(e) => {
        // Fecha apenas se o clique começou no overlay, não no diálogo.
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={
          'relative w-full rounded-lg bg-white p-8 shadow-e4 outline-none ' +
          (size === 'md' ? 'max-w-lg' : 'max-w-[440px]')
        }
      >
        {!hideCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-sm text-ink-500 hover:bg-ink-50 hover:text-ink-900 focus-ring"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <h3
          id="modal-title"
          className="mb-3 pr-8 font-display text-[1.5rem] font-medium leading-tight text-ink-900"
        >
          {title}
        </h3>

        {children && (
          <div className="text-[0.95rem] leading-relaxed text-ink-600">
            {children}
          </div>
        )}

        {footer && (
          <div className="mt-7 flex justify-end gap-3">{footer}</div>
        )}
      </div>
    </div>,
    document.body,
  )
}

/* ──────────────── Confirm modal ──────────────── */

interface ConfirmModalProps {
  open: boolean
  title: string
  /** Mensagem explicativa da consequência da ação. */
  description: string
  /** Rótulo do botão de confirmação. */
  confirmLabel?: string
  /** Rótulo do botão de cancelamento. */
  cancelLabel?: string
  /** Estiliza a confirmação como ação destrutiva (vermelho). */
  destructive?: boolean
  /** Exibe loading no botão de confirmação. */
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Modal de confirmação — usado para toda ação destrutiva
 * (cancelar assinatura, remover do carrinho, deletar produto).
 */
export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            className={
              destructive
                ? 'bg-danger text-white hover:bg-[#9A2E2E] hover:text-white'
                : undefined
            }
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="m-0">{description}</p>
    </Modal>
  )
}
