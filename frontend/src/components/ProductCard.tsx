import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { cn, formatCurrency } from '@/lib/helpers'
import type { ProdutoResponseDTO } from '@/types'
import { Badge } from './Badge'
import { BottlePlaceholder } from './BottlePlaceholder'

interface ProductCardProps {
  produto: ProdutoResponseDTO
}

/**
 * Card de produto da grade/catálogo.
 *
 * Renderiza apenas os campos que a API devolve em ProdutoResponseDTO:
 * nome, descrição, preço, estoque e statusClube. A imagem é um frasco
 * vetorial (a API não retorna imagem na listagem); a categoria não
 * existe no contrato, então não é exibida como dado.
 */
export function ProductCard({ produto }: ProductCardProps) {
  const semEstoque = produto.estoque <= 0
  const poucoEstoque = !semEstoque && produto.estoque <= 5

  return (
    <Link
      to={ROUTES.produtoDetalhe(produto.id)}
      className={cn(
        'group flex flex-col overflow-hidden rounded-md border border-ink-200 bg-white',
        'transition-[box-shadow,transform] duration-200',
        'hover:-translate-y-0.5 hover:shadow-e3 focus-ring',
        semEstoque && 'opacity-75',
      )}
    >
      {/* Imagem */}
      <div
        className={cn(
          'relative flex aspect-[4/5] items-center justify-center',
          semEstoque ? 'bg-ink-100' : 'bg-ink-50',
        )}
      >
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {produto.statusClube && (
            <Badge
              variant="club"
              icon={<Sparkles className="h-2.5 w-2.5" />}
            >
              Clube
            </Badge>
          )}
          {semEstoque && <Badge variant="sold">Esgotado</Badge>}
          {poucoEstoque && (
            <Badge variant="warning">Últimas unidades</Badge>
          )}
        </div>

        <BottlePlaceholder variant={produto.id} muted={semEstoque} />
      </div>

      {/* Corpo */}
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <h3 className="font-display text-[1.2rem] font-medium leading-tight text-ink-900">
          {produto.nome}
        </h3>
        <p className="line-clamp-2 text-small text-ink-500">
          {produto.descricao}
        </p>

        <div className="mt-auto flex items-baseline gap-3 pt-3">
          <span className="font-body text-body font-medium text-ink-900">
            {formatCurrency(produto.preco)}
          </span>
          {semEstoque ? (
            <span className="font-mono text-micro text-ink-500">
              Indisponível
            </span>
          ) : (
            <span className="font-mono text-micro text-ink-500">
              {produto.estoque} em estoque
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
