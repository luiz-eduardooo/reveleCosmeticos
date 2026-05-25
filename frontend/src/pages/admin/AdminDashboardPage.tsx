import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Package,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import { produtoService } from '@/services/produtoService'
import { userService } from '@/services/userService'
import { assinaturaService } from '@/services/assinaturaService'
import { useApi } from '@/hooks/useApi'
import { ROUTES } from '@/lib/constants'
import { formatCurrency } from '@/lib/helpers'
import { AdminPageHead } from '@/layouts/AdminLayout'
import { Button, ErrorState, Skeleton } from '@/components'
import {
  AdminCard,
  AdminCardHead,
  AdminTable,
  AdminTag,
  Kpi,
  Td,
  Th,
} from '@/components/admin/AdminUI'

/**
 * Dashboard administrativo.
 * Agrega indicadores a partir dos endpoints disponíveis: produtos,
 * usuários e assinaturas. A spec não expõe métricas prontas, então
 * os KPIs são calculados no cliente sobre as listas reais.
 */
export function AdminDashboardPage() {
  const produtos = useApi(() => produtoService.listar(), [])
  const usuarios = useApi(() => userService.listarTodos(), [])
  const assinaturas = useApi(() => assinaturaService.listarTodas(), [])

  const isLoading =
    produtos.isLoading || usuarios.isLoading || assinaturas.isLoading
  const hasError =
    produtos.error || usuarios.error || assinaturas.error

  function retryAll() {
    produtos.refetch()
    usuarios.refetch()
    assinaturas.refetch()
  }

  // Agregações
  const listaProdutos = produtos.data ?? []
  const listaUsuarios = usuarios.data ?? []
  const listaAssinaturas = assinaturas.data ?? []

  const assinaturasAtivas = listaAssinaturas.filter(
    (a) => a.status === 'ATIVA',
  )
  const receitaRecorrente = assinaturasAtivas.reduce(
    (sum, a) => sum + a.precoPlano,
    0,
  )
  const semEstoque = listaProdutos.filter((p) => p.estoque <= 0).length

  return (
    <>
      <AdminPageHead
        title="Dashboard"
        description="Visão geral da operação da Revele Cosméticos."
      />

      {hasError && !isLoading && (
        <AdminCard>
          <ErrorState
            message="Não foi possível carregar alguns indicadores."
            onRetry={retryAll}
          />
        </AdminCard>
      )}

      {!hasError && (
        <>
          {/* KPIs */}
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-md border border-ink-200 bg-white p-6"
                >
                  <Skeleton className="mb-4 h-3 w-20" />
                  <Skeleton className="h-9 w-24" />
                </div>
              ))
            ) : (
              <>
                <Kpi
                  label="Produtos"
                  value={listaProdutos.length}
                  icon={<Package className="h-3.5 w-3.5" />}
                />
                <Kpi
                  label="Usuários"
                  value={listaUsuarios.length}
                  icon={<Users className="h-3.5 w-3.5" />}
                />
                <Kpi
                  label="Assinaturas ativas"
                  value={assinaturasAtivas.length}
                  icon={<Sparkles className="h-3.5 w-3.5" />}
                  accent
                />
                <Kpi
                  label="Receita recorrente"
                  value={
                    <span className="text-[1.6rem]">
                      {formatCurrency(receitaRecorrente)}
                    </span>
                  }
                  icon={<TrendingUp className="h-3.5 w-3.5" />}
                  accent
                />
              </>
            )}
          </div>

          {/* Alertas operacionais */}
          {!isLoading && semEstoque > 0 && (
            <div className="mb-6 flex items-center justify-between gap-4 rounded-md border border-warning/30 bg-warning-soft px-5 py-4">
              <span className="text-small text-warning">
                {semEstoque}{' '}
                {semEstoque === 1
                  ? 'produto está'
                  : 'produtos estão'}{' '}
                sem estoque.
              </span>
              <Link to={ROUTES.adminProdutos}>
                <Button variant="secondary" size="sm">
                  Revisar produtos
                </Button>
              </Link>
            </div>
          )}

          {/* Tabela: produtos recentes */}
          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <AdminCard>
              <AdminCardHead
                title="Produtos"
                meta={`${listaProdutos.length} no catálogo`}
                action={
                  <Link to={ROUTES.adminProdutos}>
                    <Button
                      variant="ghost"
                      size="sm"
                      rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                    >
                      Ver todos
                    </Button>
                  </Link>
                }
              />
              {isLoading ? (
                <div className="p-6">
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : listaProdutos.length === 0 ? (
                <p className="p-6 text-small text-ink-500">
                  Nenhum produto cadastrado.
                </p>
              ) : (
                <AdminTable>
                  <thead>
                    <tr>
                      <Th>Produto</Th>
                      <Th align="right">Preço</Th>
                      <Th align="right">Estoque</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {listaProdutos.slice(0, 5).map((p) => (
                      <tr key={p.id} className="hover:bg-bg-soft">
                        <Td>
                          <span className="font-display text-[0.95rem] font-medium text-ink-900">
                            {p.nome}
                          </span>
                        </Td>
                        <Td align="right">
                          <span className="font-mono text-[0.8rem]">
                            {formatCurrency(p.preco)}
                          </span>
                        </Td>
                        <Td align="right">
                          {p.estoque <= 0 ? (
                            <AdminTag kind="off">Esgotado</AdminTag>
                          ) : (
                            <span className="font-mono text-[0.8rem]">
                              {p.estoque}
                            </span>
                          )}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </AdminTable>
              )}
            </AdminCard>

            {/* Card: assinaturas */}
            <AdminCard>
              <AdminCardHead
                title="Assinaturas"
                action={
                  <Link to={ROUTES.adminAssinaturas}>
                    <Button
                      variant="ghost"
                      size="sm"
                      rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                    >
                      Ver todas
                    </Button>
                  </Link>
                }
              />
              <div className="flex flex-col gap-4 p-6">
                {isLoading ? (
                  <Skeleton className="h-24 w-full" />
                ) : (
                  <>
                    <ResumoLinha
                      label="Ativas"
                      value={assinaturasAtivas.length}
                    />
                    <ResumoLinha
                      label="Pausadas"
                      value={
                        listaAssinaturas.filter(
                          (a) => a.status === 'PAUSADA',
                        ).length
                      }
                    />
                    <ResumoLinha
                      label="Canceladas"
                      value={
                        listaAssinaturas.filter(
                          (a) => a.status === 'CANCELADA',
                        ).length
                      }
                    />
                    <div className="mt-1 border-t border-ink-200 pt-4">
                      <ResumoLinha
                        label="Total"
                        value={listaAssinaturas.length}
                        strong
                      />
                    </div>
                  </>
                )}
              </div>
            </AdminCard>
          </div>
        </>
      )}
    </>
  )
}

function ResumoLinha({
  label,
  value,
  strong = false,
}: {
  label: string
  value: number
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={
          strong
            ? 'font-body text-[0.95rem] font-medium text-ink-900'
            : 'text-small text-ink-600'
        }
      >
        {label}
      </span>
      <span
        className={
          strong
            ? 'font-display text-h4 font-medium text-ink-900'
            : 'font-mono text-[0.85rem] text-ink-900'
        }
      >
        {value}
      </span>
    </div>
  )
}
