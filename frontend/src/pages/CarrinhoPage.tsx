import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { ROUTES } from '@/lib/constants'
import { formatCurrency } from '@/lib/helpers'
import {
  Badge,
  Button,
  ConfirmModal,
  EmptyState,
} from '@/components'
import { BottlePlaceholder } from '@/components/BottlePlaceholder'
import type { CartItem } from '@/types'

/**
 * Página do carrinho.
 * O carrinho é client-side (CartContext); esta tela não chama a API.
 * A remoção de item é confirmada por modal, conforme as regras.
 */
export function CarrinhoPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } =
    useCart()
  const navigate = useNavigate()

  /** Item marcado para remoção (aguardando confirmação). */
  const [itemParaRemover, setItemParaRemover] = useState<CartItem | null>(
    null,
  )

  /* ───── Carrinho vazio ───── */
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-container px-5 py-13 sm:px-8">
        <EmptyState
          icon={<ShoppingBag className="h-6 w-6" />}
          title="Sua sacola está vazia"
          description="Explore o catálogo e adicione os produtos que combinam com a sua rotina."
          action={
            <Link to={ROUTES.produtos}>
              <Button variant="primary">Ver o catálogo</Button>
            </Link>
          }
        />
      </div>
    )
  }

  function confirmarRemocao() {
    if (itemParaRemover) {
      removeItem(itemParaRemover.produtoId)
      setItemParaRemover(null)
    }
  }

  return (
    <div className="mx-auto max-w-container px-5 py-7 pb-13 sm:px-8">
      {/* Cabeçalho */}
      <header className="mb-8 border-b border-ink-200 pb-8">
        <span className="eyebrow text-wine-600">Sua sacola</span>
        <h1 className="my-3 font-display text-[2.5rem] font-light leading-none tracking-[-0.012em] text-ink-900 sm:text-[3.5rem]">
          Carrinho
        </h1>
        <p className="m-0 text-ink-600">
          {totalItems} {totalItems === 1 ? 'item' : 'itens'} na sua sacola.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.55fr_0.85fr]">
        {/* Lista de itens */}
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.produtoId}
              className="grid grid-cols-[88px_1fr] gap-4 rounded-md border border-ink-200 bg-white p-4 sm:grid-cols-[120px_1fr_auto] sm:gap-6 sm:p-5"
            >
              {/* Miniatura */}
              <Link
                to={ROUTES.produtoDetalhe(item.produtoId)}
                className="flex aspect-[4/5] items-center justify-center rounded-sm bg-ink-50"
              >
                <BottlePlaceholder
                  variant={item.produtoId}
                  className="w-[60%]"
                />
              </Link>

              {/* Dados */}
              <div className="flex flex-col gap-1.5">
                {item.statusClube && (
                  <Badge variant="soft-wine">Clube</Badge>
                )}
                <Link
                  to={ROUTES.produtoDetalhe(item.produtoId)}
                  className="font-display text-[1.2rem] font-medium leading-tight text-ink-900 hover:text-wine-700"
                >
                  {item.nome}
                </Link>
                <span className="font-body text-small text-ink-500">
                  {formatCurrency(item.preco)} a unidade
                </span>

                {/* Controles — mobile mostra aqui */}
                <div className="mt-2 flex items-center gap-3 sm:hidden">
                  <QuantityControl
                    value={item.quantidade}
                    max={item.estoque}
                    onChange={(q) => updateQuantity(item.produtoId, q)}
                  />
                  <button
                    type="button"
                    onClick={() => setItemParaRemover(item)}
                    className="flex items-center gap-1 text-micro text-ink-500 hover:text-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remover
                  </button>
                </div>
              </div>

              {/* Controles + subtotal — desktop */}
              <div className="hidden flex-col items-end justify-between sm:flex">
                <button
                  type="button"
                  onClick={() => setItemParaRemover(item)}
                  aria-label={`Remover ${item.nome}`}
                  className="flex h-8 w-8 items-center justify-center rounded-sm text-ink-400 hover:bg-danger-soft hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex flex-col items-end gap-2">
                  <QuantityControl
                    value={item.quantidade}
                    max={item.estoque}
                    onChange={(q) => updateQuantity(item.produtoId, q)}
                  />
                  <span className="font-body text-body font-medium text-ink-900">
                    {formatCurrency(item.preco * item.quantidade)}
                  </span>
                </div>
              </div>

              {/* Subtotal — mobile */}
              <div className="col-span-2 flex justify-between border-t border-ink-200 pt-3 sm:hidden">
                <span className="text-small text-ink-500">Subtotal</span>
                <span className="font-body text-body font-medium text-ink-900">
                  {formatCurrency(item.preco * item.quantidade)}
                </span>
              </div>
            </div>
          ))}

          <Link
            to={ROUTES.produtos}
            className="mt-2 flex items-center gap-1 text-small text-wine-700 hover:text-wine-800"
          >
            ← Continuar comprando
          </Link>
        </div>

        {/* Resumo */}
        <div className="lg:sticky lg:top-[88px] lg:self-start">
          <div className="rounded-md border border-ink-200 bg-white p-6">
            <h2 className="font-display text-h4 font-medium text-ink-900">
              Resumo
            </h2>

            <dl className="mt-5 flex flex-col gap-3 text-small">
              <div className="flex justify-between">
                <dt className="text-ink-600">
                  Subtotal ({totalItems}{' '}
                  {totalItems === 1 ? 'item' : 'itens'})
                </dt>
                <dd className="text-ink-900">
                  {formatCurrency(totalPrice)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-600">Frete</dt>
                <dd className="text-ink-500">Calculado no checkout</dd>
              </div>
            </dl>

            <div className="my-5 border-t border-ink-200" />

            <div className="flex items-baseline justify-between">
              <span className="font-body text-body font-medium text-ink-900">
                Total
              </span>
              <span className="font-display text-h3 font-medium text-ink-900">
                {formatCurrency(totalPrice)}
              </span>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="mt-6"
              onClick={() => navigate(ROUTES.checkout)}
              rightIcon={<ChevronRight className="h-4 w-4" />}
            >
              Finalizar compra
            </Button>

            <p className="mt-4 text-center font-mono text-[0.66rem] uppercase tracking-[0.08em] text-ink-400">
              Pagamento processado com segurança
            </p>
          </div>
        </div>
      </div>

      {/* Confirmação de remoção */}
      <ConfirmModal
        open={itemParaRemover !== null}
        title="Remover item?"
        description={
          itemParaRemover
            ? `"${itemParaRemover.nome}" será removido da sua sacola.`
            : ''
        }
        confirmLabel="Remover"
        cancelLabel="Manter"
        onConfirm={confirmarRemocao}
        onCancel={() => setItemParaRemover(null)}
      />
    </div>
  )
}

/* ──────────────── Controle de quantidade ──────────────── */

function QuantityControl({
  value,
  max,
  onChange,
}: {
  value: number
  max: number
  onChange: (q: number) => void
}) {
  return (
    <div className="flex items-center rounded-sm border border-ink-300">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Diminuir quantidade"
        className="flex h-9 w-9 items-center justify-center text-ink-700 hover:bg-ink-50 disabled:cursor-not-allowed disabled:text-ink-300"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="w-9 text-center font-body text-[0.9rem] font-medium text-ink-900">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Aumentar quantidade"
        className="flex h-9 w-9 items-center justify-center text-ink-700 hover:bg-ink-50 disabled:cursor-not-allowed disabled:text-ink-300"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  )
}
