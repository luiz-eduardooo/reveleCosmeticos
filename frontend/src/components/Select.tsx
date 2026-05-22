import {
  forwardRef,
  useId,
  type SelectHTMLAttributes,
  type ReactNode,
} from 'react'
import { AlertCircle, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/helpers'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  helper?: string
  error?: string
  children: ReactNode
}

/** Campo de seleção — chevron customizado, mesmo padrão visual do Input. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helper, error, id, className, disabled, children, ...rest }, ref) => {
    const autoId = useId()
    const fieldId = id ?? autoId
    const hasError = Boolean(error)

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={fieldId}
            className="text-[0.8rem] font-medium tracking-[0.02em] text-ink-800"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            className={cn(
              'w-full appearance-none rounded-sm border bg-white py-3 pl-3.5 pr-10 font-body text-[0.95rem] text-ink-900',
              'transition-[border-color,box-shadow] duration-150',
              'hover:border-ink-500 focus:border-wine-600 focus:outline-none focus:ring-[3px] focus:ring-wine-100',
              !hasError && 'border-ink-300',
              hasError &&
                'border-danger ring-[3px] ring-danger-soft focus:border-danger',
              disabled &&
                'cursor-not-allowed border-ink-200 bg-ink-50 text-ink-400',
              className,
            )}
            {...rest}
          >
            {children}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-500"
            aria-hidden
          />
        </div>

        {error && (
          <span className="flex items-center gap-1 text-micro text-danger">
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            {error}
          </span>
        )}
        {!error && helper && (
          <span className="text-micro text-ink-500">{helper}</span>
        )}
      </div>
    )
  },
)

Select.displayName = 'Select'
