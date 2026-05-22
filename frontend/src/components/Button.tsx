import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/helpers'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  /** Exibe spinner e desabilita o botão. */
  isLoading?: boolean
  /** Texto exibido durante o loading (padrão: "Processando…"). */
  loadingText?: string
  /** Ícone à esquerda do texto. */
  leftIcon?: ReactNode
  /** Ícone à direita do texto. */
  rightIcon?: ReactNode
  /** Ocupa 100% da largura disponível. */
  fullWidth?: boolean
}

/* Classes por variante — espelham .btn-* do design system. */
const variantClasses: Record<Variant, string> = {
  primary:
    'bg-wine-600 text-white border-wine-600 hover:bg-wine-700 hover:border-wine-700 active:bg-wine-800',
  secondary:
    'bg-white text-ink-900 border-ink-300 hover:border-ink-900 active:bg-ink-50',
  ghost:
    'bg-transparent text-wine-700 border-transparent hover:text-wine-800 active:text-wine-900 !px-2',
  danger:
    'bg-white text-danger border-ink-300 hover:bg-danger hover:text-white hover:border-danger',
}

/* Classes por tamanho — alturas alvo 32 / 44 / 52px. */
const sizeClasses: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-[0.8rem]',
  md: 'px-[22px] py-3 text-small',
  lg: 'px-7 py-4 text-[0.95rem]',
}

/**
 * Botão base da Revele.
 * Quatro variantes (primary/secondary/ghost/danger) e três tamanhos.
 * O primário é vinho e deve aparecer uma única vez por tela (CTA principal).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      loadingText = 'Processando…',
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={cn(
          // base
          'inline-flex items-center justify-center gap-2 rounded-sm border font-body font-medium leading-none tracking-[0.04em]',
          'transition-all duration-150 focus-ring',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          // estado desabilitado (sobrescreve a variante)
          isDisabled &&
            'cursor-not-allowed border-ink-200 bg-ink-200 text-ink-400 hover:border-ink-200 hover:bg-ink-200 hover:text-ink-400',
          // ghost desabilitado: sem fundo
          isDisabled &&
            variant === 'ghost' &&
            'border-transparent bg-transparent hover:bg-transparent',
          className,
        )}
        {...rest}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            {loadingText}
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
