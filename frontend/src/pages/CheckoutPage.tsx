import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { CheckCircle2, Lock, Package } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { pedidoService } from '@/services/pedidoService'
import { ROUTES } from '@/lib/constants'
import { formatCurrency, getErrorMessage } from '@/lib/helpers'
import { Button, useToast } from '@/components'
import { BottlePlaceholder } from '@/components/BottlePlaceholder'
import type { PedidoResponseDTO } from '@/types'

/**
 * Página de checkout.
 *
 * Revisa os itens do carrinho e cria o pedido via POST /pedidos,
 * convertendo o carrinho client-side em PedidoDTO. A API não modela
 * endereço nem pagamento, então o checkout é uma confirmação do
 * pedido — após o sucesso, o carrinho é limpo.
 */
export function CheckoutPage() {
  const { items, totalItems, totalPrice, toPedidoDTO, clear } = useCart()
  const toast = useToast()
  const navigate = useNavigate()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pedidoCriado, setPedidoCriado] =
    useState<PedidoResponseDTO | null>(null)

  // Carrinho vazio e nenhum pedido recém-criado: volta ao carrinho.
  if (items.length === 0 && !pedidoCriado) {
    return <Navigate to={ROUTES.carrinho} replace />
  }

  async function finalizarPedido() {
    setIsSubmitting(true)
    try {
      const pedido = await pedidoService.criar(toPedidoDTO())
      setPedidoCriado(pedido)
      clear() // esvazia o carrinho após o sucesso
      toast.success('Pedido confirmado!')
    } catch (err) {
      toast.error('Não foi possível finalizar', {
        description: getErrorMessage(err),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ───── Estado de sucesso ───── */
  if (pedidoCriado) {
    return (
      <div className="mx-auto max-w-[640px] px-5 py-13 sm:px-8">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-pill bg-success-soft text-success">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <span className="eyebrow justify-center text-wine-600">
              Pedido confirmado
            </span>
            <h1 className="mt-3 font-display text-h2 font-normal text-ink-900">
              Obrigada pela sua compra!
            </h1>
          </div>
          <p className="m-0 max-w-[44ch] text-ink-600">
            Seu pedido foi registrado e já está em preparação. Você pode
            acompanhar o status em Meus Pedidos.
          </p>

          {/* Resumo do pedido criado */}
          <div className="mt-2 w-full rounded-md border border-ink-200 bg-white p-6 text-left">
            <div className="flex items-center justify-between border-b border-ink-200 pb-4">
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-500">
                Pedido
              </span>
              <span className="font-mono text-small text-ink-900">
                #{pedidoCriado.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col gap-2 py-4">
              {pedidoCriado.itens.map((item) => (
                <div
                  key={item.produtoId}
                  className="flex justify-between text-small"
                >
                  <span className="text-ink-700">
                    {item.quantidade}× {item.nomeProduto}
                  </span>
                  <span className="text-ink-900">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-baseline justify-between border-t border-ink-200 pt-4">
              <span className="font-medium text-ink-900">Total</span>
              <span className="font-display text-h4 font-medium text-ink-900">
                {formatCurrency(pedidoCriado.valorTotal)}
              </span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button
              variant="primary"
              onClick={() =>
                navigate(ROUTES.pedidoDetalhe(pedidoCriado.id))
              }
            >
              Ver detalhes do pedido
            </Button>
            <Link to={ROUTES.produtos}>
              <Button variant="secondary">Continuar comprando</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ───── Checkout ───── */
  return (
    <div className="mx-auto max-w-container px-5 py-7 pb-13 sm:px-8">
      <header className="mb-8 border-b border-ink-200 pb-8">
        <span className="eyebrow text-wine-600">Finalizar compra</span>
        <h1 className="my-3 font-display text-[2.5rem] font-light leading-none tracking-[-0.012em] text-ink-900 sm:text-[3.5rem]">
          Checkout
        </h1>
        <p className="m-0 text-ink-600">
          Revise seu pedido antes de confirmar.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.55fr_0.85fr]">
        {/* Itens */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 font-display text-h4 font-medium text-ink-900">
            <Package className="h-5 w-5 text-wine-600" />
            Itens do pedido
          </h2>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.produtoId}
                className="flex items-center gap-4 rounded-md border border-ink-200 bg-white p-4"
              >
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-sm bg-ink-50">
                  <BottlePlaceholder
                    variant={item.produtoId}
                    className="w-[55%]"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-display text-[1.05rem] font-medium leading-tight text-ink-900">
                    {item.nome}
                  </div>
                  <div className="text-small text-ink-500">
                    {item.quantidade} × {formatCurrency(item.preco)}
                  </div>
                </div>
                <span className="font-body text-body font-medium text-ink-900">
                  {formatCurrency(item.preco * item.quantidade)}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 rounded-sm bg-bg-soft px-4 py-3 text-small text-ink-600">
            O endereço de entrega e a forma de pagamento serão confirmados
            por nossa equipe após a conclusão do pedido.
          </p>
        </div>

        {/* Resumo + confirmação */}
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
                <dd className="text-success">A combinar</dd>
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
              isLoading={isSubmitting}
              loadingText="Confirmando…"
              onClick={finalizarPedido}
              leftIcon={<Lock className="h-4 w-4" />}
            >
              Confirmar pedido
            </Button>

            <Link
              to={ROUTES.carrinho}
              className="mt-4 block text-center text-small text-ink-600 hover:text-ink-900"
            >
              ← Voltar ao carrinho
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
