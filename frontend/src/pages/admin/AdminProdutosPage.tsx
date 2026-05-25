import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PackageX, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { produtoService } from '@/services/produtoService'
import { useApi } from '@/hooks/useApi'
import { ROUTES } from '@/lib/constants'
import { formatCurrency, getErrorMessage } from '@/lib/helpers'
import { AdminPageHead } from '@/layouts/AdminLayout'
import {
  Button,
  ConfirmModal,
  EmptyState,
  ErrorState,
  Input,
  SkeletonRow,
  useToast,
} from '@/components'
import {
  AdminCard,
  AdminTable,
  AdminTag,
  Td,
  Th,
} from '@/components/admin/AdminUI'
import type { ProdutoResponseDTO } from '@/types'

/**
 * Listagem de produtos no painel admin.
 * GET /produtos, com busca client-side e exclusão via DELETE
 * /produtos/{id} (confirmada por modal).
 */
export function AdminProdutosPage() {
  const { data, isLoading, error, refetch } = useApi(
    () => produtoService.listar(),
    [],
  )
  const toast = useToast()
  const navigate = useNavigate()

  const [busca, setBusca] = useState('')
  const [produtoParaExcluir, setProdutoParaExcluir] =
    useState<ProdutoResponseDTO | null>(null)
  const [excluindo, setExcluindo] = useState(false)

  const produtos = data ?? []

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return produtos
    return produtos.filter(
      (p) =>
        p.nome.toLowerCase().includes(termo) ||
        p.descricao.toLowerCase().includes(termo),
    )
  }, [produtos, busca])

  async function confirmarExclusao() {
    if (!produtoParaExcluir) return
    setExcluindo(true)
    try {
      await produtoService.deletar(produtoParaExcluir.id)
      toast.success('Produto excluído', {
        description: produtoParaExcluir.nome,
      })
      setProdutoParaExcluir(null)
      refetch()
    } catch (err) {
      toast.error('Não foi possível excluir', {
        description: getErrorMessage(err),
      })
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <>
      <AdminPageHead
        title="Produtos"
        description="Gerencie o catálogo da Revele Cosméticos."
        action={
          <Link to={ROUTES.adminProdutoNovo}>
            <Button
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Novo produto
            </Button>
          </Link>
        }
      />

      <AdminCard>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-200 bg-bg-soft px-6 py-4">
          <span className="text-small text-ink-600">
            {isLoading
              ? 'Carregando…'
              : `${produtosFiltrados.length} ${produtosFiltrados.length === 1 ? 'produto' : 'produtos'}`}
          </span>
          <div className="w-full sm:w-64">
            <Input
              placeholder="Buscar produto"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* Estados */}
        {isLoading && (
          <div>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} cols={5} />
            ))}
          </div>
        )}

        {error && !isLoading && (
          <ErrorState message={error} onRetry={refetch} />
        )}

        {!isLoading && !error && produtosFiltrados.length === 0 && (
          <EmptyState
            icon={<PackageX className="h-6 w-6" />}
            title={
              busca
                ? 'Nenhum produto encontrado'
                : 'Nenhum produto cadastrado'
            }
            description={
              busca
                ? 'Tente outro termo de busca.'
                : 'Comece criando o primeiro produto do catálogo.'
            }
            action={
              !busca ? (
                <Link to={ROUTES.adminProdutoNovo}>
                  <Button variant="primary" size="sm">
                    Criar produto
                  </Button>
                </Link>
              ) : undefined
            }
          />
        )}

        {!isLoading && !error && produtosFiltrados.length > 0 && (
          <AdminTable>
            <thead>
              <tr>
                <Th>Produto</Th>
                <Th align="right">Preço</Th>
                <Th align="right">Estoque</Th>
                <Th align="center">Clube</Th>
                <Th align="right">Ações</Th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.map((produto) => (
                <tr key={produto.id} className="hover:bg-bg-soft">
                  <Td>
                    <div>
                      <span className="block font-display text-[0.95rem] font-medium text-ink-900">
                        {produto.nome}
                      </span>
                      <span className="font-mono text-[0.7rem] text-ink-500">
                        #{produto.id}
                      </span>
                    </div>
                  </Td>
                  <Td align="right">
                    <span className="font-mono text-[0.8rem] text-ink-900">
                      {formatCurrency(produto.preco)}
                    </span>
                  </Td>
                  <Td align="right">
                    {produto.estoque <= 0 ? (
                      <AdminTag kind="off">Esgotado</AdminTag>
                    ) : (
                      <span className="font-mono text-[0.8rem]">
                        {produto.estoque}
                      </span>
                    )}
                  </Td>
                  <Td align="center">
                    {produto.statusClube ? (
                      <AdminTag kind="club">Clube</AdminTag>
                    ) : (
                      <span className="text-ink-400">—</span>
                    )}
                  </Td>
                  <Td align="right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            ROUTES.adminProdutoEditar(produto.id),
                          )
                        }
                        aria-label={`Editar ${produto.nome}`}
                        className="flex h-8 w-8 items-center justify-center rounded-sm border border-transparent text-ink-600 hover:border-ink-200 hover:bg-ink-100 hover:text-ink-900"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setProdutoParaExcluir(produto)}
                        aria-label={`Excluir ${produto.nome}`}
                        className="flex h-8 w-8 items-center justify-center rounded-sm border border-transparent text-ink-600 hover:border-danger/30 hover:text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        )}
      </AdminCard>

      <ConfirmModal
        open={produtoParaExcluir !== null}
        title="Excluir produto?"
        description={
          produtoParaExcluir
            ? `"${produtoParaExcluir.nome}" será removido permanentemente do catálogo.`
            : ''
        }
        confirmLabel="Excluir produto"
        cancelLabel="Cancelar"
        isLoading={excluindo}
        onConfirm={confirmarExclusao}
        onCancel={() => setProdutoParaExcluir(null)}
      />
    </>
  )
}
