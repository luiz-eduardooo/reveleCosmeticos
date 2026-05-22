import { cn } from '@/lib/helpers'

interface SkeletonProps {
  className?: string
  /** Renderiza como círculo (para avatares). */
  circle?: boolean
}

/**
 * Bloco de placeholder com shimmer suave.
 * Compõe estados de loading no lugar do conteúdo real.
 */
export function Skeleton({ className, circle = false }: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'block bg-[length:200%_100%]',
        'bg-gradient-to-r from-ink-100 via-ink-200 to-ink-100',
        'animate-[revele-shimmer_1.6s_ease-in-out_infinite]',
        circle ? 'rounded-full' : 'rounded-sm',
        className,
      )}
    />
  )
}

/** Linha de texto skeleton — largura configurável. */
export function SkeletonText({
  width = '100%',
  className,
}: {
  width?: string
  className?: string
}) {
  return (
    <span
      aria-hidden
      style={{ width }}
      className={cn(
        'block h-3.5 rounded-sm bg-[length:200%_100%]',
        'bg-gradient-to-r from-ink-100 via-ink-200 to-ink-100',
        'animate-[revele-shimmer_1.6s_ease-in-out_infinite]',
        className,
      )}
    />
  )
}

/**
 * Skeleton pronto de um card de produto — espelha o ProductCard real
 * (imagem 4:5 + corpo). Usado na grade do catálogo durante o loading.
 */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-ink-200 bg-white">
      <Skeleton className="aspect-[4/5] rounded-none" />
      <div className="flex flex-col gap-2.5 p-5">
        <Skeleton className="h-2.5 w-1/3" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  )
}

/** Skeleton de uma linha de tabela com N células. */
export function SkeletonRow({ cols = 4 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 border-b border-ink-200 px-4 py-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === 0 ? 'w-1/4' : 'flex-1')}
        />
      ))}
    </div>
  )
}
