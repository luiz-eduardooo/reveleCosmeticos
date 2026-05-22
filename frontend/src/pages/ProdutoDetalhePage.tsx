import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Check,
  ChevronRight,
  Leaf,
  Minus,
  PackageX,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react'
import { produtoService } from '@/services/produtoService'
import { useApi } from '@/hooks/useApi'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/lib/constants'
import { formatCurrency } from '@/lib/helpers'
import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  Skeleton,
  useToast,
} from '@/components'
import { BottlePlaceholder } from '@/components/BottlePlaceholder'

/**
 * Página de detalhe de produto.
 * Busca via GET /produtos/{id}. O id da rota é numérico (int64 na spec).
 */
export function ProdutoDetalhePage() {
  const { id } = useParams<{ id: string }>()
  const produtoId = Number(id)
  const idValido = Number.isFinite(produtoId) && produtoId > 0

  const { data: produto, isLoading, error, refetch } = useApi(
    () => produtoService.buscar(produtoId),
    [produtoId],
  )

  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [quantidade, setQuantidade] = useState(1)

  // Id inválido na URL — não tenta buscar.
  if (!idValido) {
    return (
      <div className="mx-auto max-w-container px-5 py-13 sm:px-8">
        <EmptyState
          icon={<PackageX className="h-6 w-6" />}
          title="Produto não encontrado"
          description="O endereço acessado não corresponde a um produto válido."
          action={
            <Link to={ROUTES.produtos}>
              <Button variant="secondary" size="sm">
                Voltar ao catálogo
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  if (isLoading) return <ProdutoDetalheSkeleton />

  if (error || !produto) {
    return (
      <div className="mx-auto max-w-container px-5 py-13 sm:px-8">
        <ErrorState
          message={error ?? 'Produto não encontrado.'}
          onRetry={refetch}
        />
      </div>
    )
  }

  const semEstoque = produto.estoque <= 0
  const poucoEstoque = !semEstoque && produto.estoque <= 5

  function alterarQtd(delta: number) {
    setQuantidade((q) =>
      Math.max(1, Math.min(q + delta, produto?.estoque ?? 1)),
    )
  }

  function handleAddToCart() {
    if (!produto || semEstoque) return
    addItem(produto, quantidade)
    toast.success('Adicionado à sacola', {
      description: `${quantidade}× ${produto.nome}`,
    })
  }

  function handleBuyNow() {
    if (!produto || semEstoque) return
    addItem(produto, quantidade)
    if (!isAuthenticated) {
      navigate(`${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.checkout)}`)
    } else {
      navigate(ROUTES.checkout)
    }
  }

  return (
    <div className="mx-auto max-w-container px-5 py-6 pb-11 sm:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-[0.78rem] text-ink-500">
        <Link to={ROUTES.home} className="hover:text-ink-900">
          Início
        </Link>
        <ChevronRight className="h-3 w-3 text-ink-400" />
        <Link to={ROUTES.produtos} className="hover:text-ink-900">
          Produtos
        </Link>
        <ChevronRight className="h-3 w-3 text-ink-400" />
        <span className="text-ink-900">{produto.nome}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        {/* Galeria */}
        <div>
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-md bg-gradient-to-b from-bg-soft to-ink-50">
            {produto.statusClube && (
              <div className="absolute left-5 top-5">
                <Badge
                  variant="club"
                  icon={<Sparkles className="h-2.5 w-2.5" />}
                >
                  Produto do Clube
                </Badge>
              </div>
            )}
            <div
              className="absolute left-1/2 top-1/2 aspect-square w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-wine-600/25"
              aria-hidden
            >
              <div className="absolute inset-[18px] rounded-full border border-dashed border-wine-600/20" />
            </div>
            <BottlePlaceholder
              variant={produto.id}
              muted={semEstoque}
              className="relative z-10 w-[40%] drop-shadow-[0_24px_32px_rgba(53,12,18,0.18)]"
            />
          </div>

          {/* Faixa de detalhes */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <DetailChip
              icon={<Truck className="h-4 w-4" />}
              label="Envio"
              value="Cuidado"
            />
            <DetailChip
              icon={<Leaf className="h-4 w-4" />}
              label="Fórmula"
              value="Vegana"
            />
            <DetailChip
              icon={<ShieldCheck className="h-4 w-4" />}
              label="Garantia"
              value="30 dias"
            />
          </div>
        </div>

        {/* Buy box */}
        <div className="lg:sticky lg:top-[88px]">
          <p className="m-0 flex items-center gap-3 font-body text-[0.72rem] uppercase tracking-eyebrow text-ink-500">
            <span className="inline-block h-px w-6 bg-wine-600" />
            {produto.statusClube ? 'Produto do Clube' : 'Catálogo Revele'}
          </p>

          <h1 className="my-3 font-display text-[2.5rem] font-normal leading-[1.05] tracking-[-0.01em] text-ink-900 sm:text-[2.75rem]">
            {produto.nome}
          </h1>

          {/* Disponibilidade */}
          <div className="mb-5 flex items-center gap-3">
            {semEstoque ? (
              <Badge variant="sold">Esgotado</Badge>
            ) : poucoEstoque ? (
              <span className="flex items-center gap-1.5 text-[0.82rem] text-warning">
                <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                Últimas {produto.estoque} unidades
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[0.82rem] text-success">
                <Check className="h-3.5 w-3.5" />
                Em estoque
              </span>
            )}
          </div>

          <p className="mb-6 max-w-[46ch] leading-relaxed text-ink-700">
            {produto.descricao}
          </p>

          {/* Preço */}
          <div className="flex flex-col gap-2 border-y border-ink-200 py-5">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-[2.25rem] font-medium text-ink-900">
                {formatCurrency(produto.preco)}
              </span>
            </div>
            <span className="font-mono text-[0.7rem] text-ink-500">
              ou em até 6× de {formatCurrency(produto.preco / 6)} sem juros
            </span>
          </div>

          {/* Quantidade + ações */}
          {!semEstoque && (
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <span className="text-[0.8rem] font-medium text-ink-800">
                  Quantidade
                </span>
                <div className="flex items-center rounded-sm border border-ink-300">
                  <button
                    type="button"
                    onClick={() => alterarQtd(-1)}
                    disabled={quantidade <= 1}
                    aria-label="Diminuir quantidade"
                    className="flex h-10 w-10 items-center justify-center text-ink-700 hover:bg-ink-50 disabled:cursor-not-allowed disabled:text-ink-300"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center font-body text-[0.95rem] font-medium text-ink-900">
                    {quantidade}
                  </span>
                  <button
                    type="button"
                    onClick={() => alterarQtd(1)}
                    disabled={quantidade >= produto.estoque}
                    aria-label="Aumentar quantidade"
                    className="flex h-10 w-10 items-center justify-center text-ink-700 hover:bg-ink-50 disabled:cursor-not-allowed disabled:text-ink-300"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                leftIcon={<ShoppingBag className="h-4 w-4" />}
              >
                Adicionar à sacola
              </Button>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={handleBuyNow}
              >
                Comprar agora
              </Button>
            </div>
          )}

          {semEstoque && (
            <div className="mt-6">
              <Button variant="secondary" size="lg" fullWidth disabled>
                Produto indisponível
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ──────────────── Subcomponentes ──────────────── */

function DetailChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-sm border border-ink-200 bg-white px-4 py-3">
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-wine-50 text-wine-700">
        {icon}
      </span>
      <span className="flex flex-col">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-ink-500">
          {label}
        </span>
        <span className="font-display text-[1.05rem] font-medium leading-tight text-ink-900">
          {value}
        </span>
      </span>
    </div>
  )
}

function ProdutoDetalheSkeleton() {
  return (
    <div className="mx-auto max-w-container px-5 py-6 sm:px-8">
      <Skeleton className="mb-6 h-3.5 w-64" />
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <Skeleton className="aspect-square rounded-md" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}
