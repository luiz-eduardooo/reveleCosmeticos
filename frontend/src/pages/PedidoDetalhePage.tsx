import { Link, useParams } from 'react-router-dom'
import { ChevronRight, Package, User } from 'lucide-react'
import { pedidoService } from '@/services/pedidoService'
import { useApi } from '@/hooks/useApi'
import { ROUTES } from '@/lib/constants'
import { formatCurrency, formatDateTime } from '@/lib/helpers'
import { Button, ErrorState, Skeleton } from '@/components'
import { BottlePlaceholder } from '@/components/BottlePlaceholder'

/**
 * Página de detalhe de um pedido.
 * Busca via GET /pedidos/{id} — o id é um uuid.
 */
export function PedidoDetalhePage() {
  const { id } = useParams<{ id: string }>()

  const { data: pedido, isLoading, error, refetch } = useApi(
    () => pedidoService.buscar(id ?? ''),
    [id],
  )

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[760px] px-5 py-9 sm:px-8">
        <Skeleton className="mb-6 h-3.5 w-64" />
        <Skeleton className="mb-3 h-10 w-1/2" />
        <Skeleton className="mb-8 h-4 w-1/3" />
        <Skeleton className="h-64 w-full rounded-md" />
      </div>
    )
  }

  if (error || !pedido) {
    return (
      <div className="mx-auto max-w-[760px] px-5 py-13 sm:px-8">
        <ErrorState
          message={error ?? 'Pedido não encontrado.'}
          onRetry={refetch}
        />
        <div className="mt-6 text-center">
          <Link to={ROUTES.pedidos}>
            <Button variant="secondary" size="sm">
              Voltar aos pedidos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const qtdItens = pedido.itens.reduce((sum, i) => sum + i.quantidade, 0)

  return (
    <div className="mx-auto max-w-[760px] px-5 py-7 pb-13 sm:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-[0.78rem] text-ink-500">
        <Link to={ROUTES.pedidos} className="hover:text-ink-900">
          Meus pedidos
        </Link>
        <ChevronRight className="h-3 w-3 text-ink-400" />
        <span className="text-ink-900">
          #{pedido.id.slice(0, 8).toUpperCase()}
        </span>
      </nav>

      {/* Cabeçalho */}
      <header className="mb-8">
        <span className="eyebrow text-wine-600">Detalhe do pedido</span>
        <h1 className="my-3 font-display text-[2.25rem] font-normal leading-tight text-ink-900">
          Pedido #{pedido.id.slice(0, 8).toUpperCase()}
        </h1>
        <p className="m-0 text-ink-600">
          Realizado em {formatDateTime(pedido.dataPedido)}
        </p>
      </header>

      {/* Cliente */}
      <div className="mb-4 flex items-center gap-3 rounded-md border border-ink-200 bg-white p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-pill bg-wine-50 text-wine-700">
          <User className="h-5 w-5" />
        </div>
        <div>
          <div className="font-mono text-[0.66rem] uppercase tracking-[0.1em] text-ink-500">
            Cliente
          </div>
          <div className="font-body text-[0.95rem] font-medium text-ink-900">
            {pedido.nomeUsuario}
          </div>
        </div>
      </div>

      {/* Itens */}
      <div className="rounded-md border border-ink-200 bg-white">
        <div className="flex items-center gap-2 border-b border-ink-200 px-5 py-4">
          <Package className="h-4 w-4 text-wine-600" />
          <h2 className="font-display text-h4 font-medium text-ink-900">
            Itens ({qtdItens})
          </h2>
        </div>

        <div className="flex flex-col">
          {pedido.itens.map((item) => (
            <div
              key={item.produtoId}
              className="flex items-center gap-4 border-b border-ink-200 px-5 py-4 last:border-b-0"
            >
              <Link
                to={ROUTES.produtoDetalhe(item.produtoId)}
                className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-sm bg-ink-50"
              >
                <BottlePlaceholder
                  variant={item.produtoId}
                  className="w-[55%]"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <Link
                  to={ROUTES.produtoDetalhe(item.produtoId)}
                  className="font-display text-[1.05rem] font-medium leading-tight text-ink-900 hover:text-wine-700"
                >
                  {item.nomeProduto}
                </Link>
                <div className="text-small text-ink-500">
                  {item.quantidade} ×{' '}
                  {formatCurrency(item.precoUnitario)}
                </div>
              </div>

              <span className="font-body text-body font-medium text-ink-900">
                {formatCurrency(item.subtotal)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-baseline justify-between bg-bg-soft px-5 py-4">
          <span className="font-body text-body font-medium text-ink-900">
            Valor total
          </span>
          <span className="font-display text-h3 font-medium text-ink-900">
            {formatCurrency(pedido.valorTotal)}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <Link to={ROUTES.pedidos}>
          <Button variant="secondary" size="sm">
            ← Voltar aos pedidos
          </Button>
        </Link>
      </div>
    </div>
  )
}
