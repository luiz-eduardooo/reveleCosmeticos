import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Package, ShoppingBag } from 'lucide-react'
import { pedidoService } from '@/services/pedidoService'
import { useApi } from '@/hooks/useApi'
import { ROUTES } from '@/lib/constants'
import { formatCurrency, formatDateTime } from '@/lib/helpers'
import {
  AccountShell,
  AccountHead,
} from '@/components/AccountSidebar'
import {
  Button,
  EmptyState,
  ErrorState,
  SkeletonRow,
} from '@/components'

/** Itens por página da listagem de pedidos. */
const PAGE_SIZE = 8

/**
 * Página "Meus pedidos".
 * Lista paginada via GET /pedidos/meus, ordenada pela data mais
 * recente. Cada linha leva ao detalhe do pedido.
 */
export function PedidosPage() {
  const [page, setPage] = useState(0)

  const { data, isLoading, error, refetch } = useApi(
    () =>
      pedidoService.listarMeus({
        page,
        size: PAGE_SIZE,
        sort: ['dataPedido,desc'],
      }),
    [page],
  )

  const pedidos = data?.content ?? []

  return (
    <AccountShell>
      <AccountHead
        eyebrow="Conta"
        title="Meus pedidos"
        description="Acompanhe o histórico e o status de todas as suas compras."
      />

      {/* Estado: loading */}
      {isLoading && (
        <div className="overflow-hidden rounded-md border border-ink-200 bg-white">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} cols={4} />
          ))}
        </div>
      )}

      {/* Estado: erro */}
      {error && !isLoading && (
        <div className="rounded-md border border-ink-200 bg-white">
          <ErrorState message={error} onRetry={refetch} />
        </div>
      )}

      {/* Estado: vazio */}
      {!isLoading && !error && pedidos.length === 0 && (
        <div className="rounded-md border border-ink-200 bg-white">
          <EmptyState
            icon={<ShoppingBag className="h-6 w-6" />}
            title="Nenhum pedido ainda"
            description="Quando você fizer sua primeira compra, ela aparecerá aqui."
            action={
              <Link to={ROUTES.produtos}>
                <Button variant="primary" size="sm">
                  Explorar o catálogo
                </Button>
              </Link>
            }
          />
        </div>
      )}

      {/* Estado: sucesso */}
      {!isLoading && !error && pedidos.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            {pedidos.map((pedido) => {
              const qtdItens = pedido.itens.reduce(
                (sum, i) => sum + i.quantidade,
                0,
              )
              return (
                <Link
                  key={pedido.id}
                  to={ROUTES.pedidoDetalhe(pedido.id)}
                  className="group flex items-center gap-4 rounded-md border border-ink-200 bg-white p-5 transition-shadow hover:shadow-e2"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-pill bg-wine-50 text-wine-700">
                    <Package className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[0.78rem] text-ink-900">
                        #{pedido.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-0.5 text-small text-ink-500">
                      {formatDateTime(pedido.dataPedido)} ·{' '}
                      {qtdItens} {qtdItens === 1 ? 'item' : 'itens'}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-body text-body font-medium text-ink-900">
                      {formatCurrency(pedido.valorTotal)}
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-ink-400 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )
            })}
          </div>

          {/* Paginação */}
          {data && data.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <span className="text-small text-ink-500">
                Página {data.number + 1} de {data.totalPages} ·{' '}
                {data.totalElements} pedidos
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={data.first}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  leftIcon={<ChevronLeft className="h-3.5 w-3.5" />}
                >
                  Anterior
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={data.last}
                  onClick={() => setPage((p) => p + 1)}
                  rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </AccountShell>
  )
}
