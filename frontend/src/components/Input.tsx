import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/helpers'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  /** Texto auxiliar abaixo do campo. */
  helper?: string
  /** Mensagem de erro — quando presente, ativa o estado de erro. */
  error?: string
  /** Mensagem de sucesso — quando presente, ativa o estado de sucesso. */
  success?: string
  /** Ícone decorativo à esquerda dentro do campo. */
  leftIcon?: ReactNode
}

/**
 * Campo de texto base da Revele.
 * Label sempre visível, helper opcional, estados de erro/sucesso com
 * halo, e toggle de visibilidade automático para type="password".
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helper,
      error,
      success,
      leftIcon,
      type = 'text',
      id,
      className,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId()
    const inputId = id ?? autoId
    const [showPassword, setShowPassword] = useState(false)

    const isPassword = type === 'password'
    const effectiveType = isPassword && showPassword ? 'text' : type

    const hasError = Boolean(error)
    const hasSuccess = Boolean(success) && !hasError

    const describedBy = error
      ? `${inputId}-error`
      : success
        ? `${inputId}-success`
        : helper
          ? `${inputId}-helper`
          : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[0.8rem] font-medium tracking-[0.02em] text-ink-800"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={effectiveType}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={cn(
              'w-full rounded-sm border bg-white px-3.5 py-3 font-body text-[0.95rem] text-ink-900',
              'transition-[border-color,box-shadow] duration-150 placeholder:text-ink-400',
              'hover:border-ink-500 focus:border-wine-600 focus:outline-none focus:ring-[3px] focus:ring-wine-100',
              Boolean(leftIcon) && 'pl-10',
              isPassword && 'pr-11',
              !hasError && !hasSuccess && 'border-ink-300',
              hasError &&
                'border-danger ring-[3px] ring-danger-soft focus:border-danger focus:ring-danger-soft',
              hasSuccess &&
                'border-success ring-[3px] ring-success-soft focus:border-success focus:ring-success-soft',
              disabled &&
                'cursor-not-allowed border-ink-200 bg-ink-50 text-ink-400 hover:border-ink-200',
              className,
            )}
            {...rest}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center p-1 text-ink-500 hover:text-ink-900 focus-ring rounded-sm"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-[18px] w-[18px]" />
              ) : (
                <Eye className="h-[18px] w-[18px]" />
              )}
            </button>
          )}
        </div>

        {error && (
          <span
            id={`${inputId}-error`}
            className="flex items-center gap-1 text-micro text-danger"
          >
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            {error}
          </span>
        )}
        {!error && success && (
          <span
            id={`${inputId}-success`}
            className="flex items-center gap-1 text-micro text-success"
          >
            <Check className="h-3 w-3 flex-shrink-0" />
            {success}
          </span>
        )}
        {!error && !success && helper && (
          <span id={`${inputId}-helper`} className="text-micro text-ink-500">
            {helper}
          </span>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
