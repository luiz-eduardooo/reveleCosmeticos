import {
  forwardRef,
  useId,
  type TextareaHTMLAttributes,
} from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/helpers'

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helper?: string
  error?: string
}

/** Área de texto multilinha — mesmo padrão visual do Input. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helper, error, id, className, disabled, ...rest }, ref) => {
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

        <textarea
          ref={ref}
          id={fieldId}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={
            error
              ? `${fieldId}-error`
              : helper
                ? `${fieldId}-helper`
                : undefined
          }
          className={cn(
            'min-h-24 w-full resize-y rounded-sm border bg-white px-3.5 py-3 font-body text-[0.95rem] text-ink-900',
            'transition-[border-color,box-shadow] duration-150 placeholder:text-ink-400',
            'hover:border-ink-500 focus:border-wine-600 focus:outline-none focus:ring-[3px] focus:ring-wine-100',
            !hasError && 'border-ink-300',
            hasError &&
              'border-danger ring-[3px] ring-danger-soft focus:border-danger focus:ring-danger-soft',
            disabled &&
              'cursor-not-allowed border-ink-200 bg-ink-50 text-ink-400',
            className,
          )}
          {...rest}
        />

        {error && (
          <span
            id={`${fieldId}-error`}
            className="flex items-center gap-1 text-micro text-danger"
          >
            <AlertCircle className="h-3 w-3 flex-shrink-0" />
            {error}
          </span>
        )}
        {!error && helper && (
          <span id={`${fieldId}-helper`} className="text-micro text-ink-500">
            {helper}
          </span>
        )}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
