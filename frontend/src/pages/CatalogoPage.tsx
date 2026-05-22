import { useMemo, useState } from 'react'
import { PackageX, Search, SlidersHorizontal } from 'lucide-react'
import { produtoService } from '@/services/produtoService'
import { useApi } from '@/hooks/useApi'
import {
  Button,
  EmptyState,
  ErrorState,
  Input,
  ProductCardSkeleton,
  Select,
} from '@/components'
import { ProductCard } from '@/components/ProductCard'

type SortKey = 'relevancia' | 'preco-asc' | 'preco-desc' | 'nome'

/**
 * Catálogo de produtos.
 *
 * Consome GET /produtos e aplica, no cliente, os filtros que o
 * contrato da API permite de fato: busca textual (nome/descrição),
 * filtro "apenas Clube" (statusClube) e ordenação. Categorias não
 * existem no DTO, portanto não há filtro de categoria.
 */
export function CatalogoPage() {
  const { data, isLoading, error, refetch } = useApi(
    () => produtoService.listar(),
    [],
  )

  const [busca, setBusca] = useState('')
  const [apenasClube, setApenasClube] = useState(false)
  const [apenasEstoque, setApenasEstoque] = useState(false)
  const [sort, setSort] = useState<SortKey>('relevancia')

  const produtos = data ?? []

  /** Lista filtrada e ordenada — recalculada a cada mudança. */
  const produtosVisiveis = useMemo(() => {
    let lista = [...produtos]

    const termo = busca.trim().toLowerCase()
    if (termo) {
      lista = lista.filter(
        (p) =>
          p.nome.toLowerCase().includes(termo) ||
          p.descricao.toLowerCase().includes(termo),
      )
    }
    if (apenasClube) {
      lista = lista.filter((p) => p.statusClube)
    }
    if (apenasEstoque) {
      lista = lista.filter((p) => p.estoque > 0)
    }

    switch (sort) {
      case 'preco-asc':
        lista.sort((a, b) => a.preco - b.preco)
        break
      case 'preco-desc':
        lista.sort((a, b) => b.preco - a.preco)
        break
      case 'nome':
        lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
        break
      // 'relevancia' mantém a ordem da API
    }
    return lista
  }, [produtos, busca, apenasClube, apenasEstoque, sort])

  const temFiltros = Boolean(busca) || apenasClube || apenasEstoque

  function limparFiltros() {
    setBusca('')
    setApenasClube(false)
    setApenasEstoque(false)
  }

  return (
    <>
      {/* Cabeçalho */}
      <div className="border-b border-ink-200 bg-bg-soft">
        <div className="mx-auto max-w-container px-5 py-10 sm:px-8">
          <span className="eyebrow text-wine-600">Catálogo</span>
          <h1 className="my-3 font-display text-[2.5rem] font-light leading-none tracking-[-0.01em] text-ink-900 sm:text-[3.5rem]">
            Todos os produtos
          </h1>
          <p className="m-0 max-w-[54ch] text-ink-600">
            A curadoria completa da Revele — fórmulas honestas para cada
            momento da sua rotina.
          </p>
        </div>
      </div>

      {/* Corpo */}
      <div className="mx-auto grid max-w-container gap-8 px-5 py-9 sm:px-8 lg:grid-cols-[248px_1fr] lg:gap-10">
        {/* Filtros */}
        <aside className="flex flex-col gap-6">
          <div>
            <h4 className="mb-4 flex items-center gap-2 font-body text-[0.74rem] font-medium uppercase tracking-[0.16em] text-ink-700">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filtros
            </h4>
            <Input
              placeholder="Buscar produtos"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          <div className="border-t border-ink-200 pt-6">
            <FilterToggle
              checked={apenasClube}
              onChange={setApenasClube}
              label="Apenas Clube"
              hint="Produtos com preço de assinante"
              accent
            />
          </div>

          <div className="border-t border-ink-200 pt-6">
            <FilterToggle
              checked={apenasEstoque}
              onChange={setApenasEstoque}
              label="Somente em estoque"
              hint="Esconde itens esgotados"
            />
          </div>

          {temFiltros && (
            <Button variant="ghost" size="sm" onClick={limparFiltros}>
              Limpar filtros
            </Button>
          )}
        </aside>

        {/* Grade */}
        <div>
          {/* Barra de ferramentas */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-ink-200 pb-5">
            <span className="font-body text-[0.88rem] text-ink-700">
              {isLoading ? (
                'Carregando…'
              ) : (
                <>
                  <b className="font-medium text-ink-900">
                    {produtosVisiveis.length}
                  </b>{' '}
                  {produtosVisiveis.length === 1 ? 'produto' : 'produtos'}
                </>
              )}
            </span>
            <div className="w-44">
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Ordenar por"
              >
                <option value="relevancia">Relevância</option>
                <option value="preco-asc">Menor preço</option>
                <option value="preco-desc">Maior preço</option>
                <option value="nome">Nome (A–Z)</option>
              </Select>
            </div>
          </div>

          {/* Estado: loading */}
          {isLoading && (
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Estado: erro */}
          {error && !isLoading && (
            <ErrorState message={error} onRetry={refetch} />
          )}

          {/* Estado: sucesso com resultados */}
          {!isLoading && !error && produtosVisiveis.length > 0 && (
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
              {produtosVisiveis.map((produto) => (
                <ProductCard key={produto.id} produto={produto} />
              ))}
            </div>
          )}

          {/* Estado: sucesso sem resultados */}
          {!isLoading && !error && produtosVisiveis.length === 0 && (
            <EmptyState
              icon={<PackageX className="h-6 w-6" />}
              title={
                temFiltros
                  ? 'Nenhum produto encontrado'
                  : 'Catálogo vazio'
              }
              description={
                temFiltros
                  ? 'Tente ajustar os filtros ou a busca.'
                  : 'Ainda não há produtos cadastrados.'
              }
              action={
                temFiltros ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={limparFiltros}
                  >
                    Limpar filtros
                  </Button>
                ) : undefined
              }
            />
          )}
        </div>
      </div>
    </>
  )
}

/* ──────────────── Toggle de filtro ──────────────── */

function FilterToggle({
  checked,
  onChange,
  label,
  hint,
  accent = false,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  hint: string
  accent?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between gap-3 rounded-sm border p-4 text-left transition-colors ${
        accent
          ? 'border-wine-100 bg-wine-50'
          : 'border-ink-200 bg-white hover:border-ink-300'
      }`}
    >
      <span className="flex flex-col">
        <b
          className={`text-[0.85rem] font-medium ${
            accent ? 'text-wine-700' : 'text-ink-900'
          }`}
        >
          {label}
        </b>
        <span
          className={`text-[0.72rem] ${
            accent ? 'text-wine-700/80' : 'text-ink-500'
          }`}
        >
          {hint}
        </span>
      </span>
      <span
        className={`relative h-5 w-9 flex-shrink-0 rounded-pill transition-colors ${
          checked ? 'bg-wine-600' : 'bg-ink-300'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-e1 transition-all ${
            checked ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  )
}
