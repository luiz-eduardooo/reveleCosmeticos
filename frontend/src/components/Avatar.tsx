import { cn, getInitials } from '@/lib/helpers'

type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  /** Nome usado para gerar as iniciais de fallback. */
  name: string
  size?: AvatarSize
  /** Usa o degradê vinho de marca em vez do fundo wine-100. */
  gradient?: boolean
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-7 w-7 text-[0.7rem]',
  md: 'h-10 w-10 text-small',
  lg: 'h-14 w-14 text-body',
}

/**
 * Avatar com fallback de iniciais.
 * A API não fornece imagem de perfil, então o avatar é sempre
 * baseado nas iniciais do nome.
 */
export function Avatar({
  name,
  size = 'md',
  gradient = false,
  className,
}: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex flex-shrink-0 items-center justify-center rounded-pill font-body font-medium tracking-[0.04em]',
        sizeClasses[size],
        gradient
          ? 'bg-gradient-to-br from-wine-200 to-wine-600 text-white'
          : 'bg-wine-100 text-wine-700',
        className,
      )}
    >
      {getInitials(name)}
    </span>
  )
}
