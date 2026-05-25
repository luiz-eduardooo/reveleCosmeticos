import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Package, Search } from 'lucide-react'
import { pedidoService } from '@/services/pedidoService'
import { ROUTES } from '@/lib/constants'
import { formatCurrency, formatDateTime, getErrorMessage } from '@/lib/helpers'
import { AdminPageHead } from '@/layouts/AdminLayout'
import {
  Button,
  EmptyState,
  Input,
  Spinner,
} from '@/components'
import {
  AdminCard,
  AdminCardHead,
  AdminTable,
  Td,
  Th,
} from '@/components/admin/AdminUI'
import type { PedidoResponseDTO } from '@/types'

/**
 * Pedidos no painel admin.
 *
 * Limitação da API: a spec não expõe um endpoint para listar todos
 * os pedidos (só GET /pedidos/{id} e GET /pedidos/meus). Esta tela
 * oferece consulta de pedido por ID via GET /pedidos/{id}. Quando o
 * backend disponibilizar um GET /pedidos (admin), basta trocar esta
 * busca por uma listagem paginada — o componente de tabela já existe.
 */
export function AdminPedidosPage() {
  const [termoId, setTermoId] = useState('')
  const [pedido, setPedido] = useState<PedidoResponseDTO | null>(null)
  const [buscando, setBuscando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [buscou, setBuscou] = useState(false)

  async function buscarPedido() {
    const id = termoId.trim()
    if (!id) return
    setBuscando(true)
    setErro(null)
    setBuscou(true)
    try {
      const resultado = await pedidoService.buscar(id)
      setPedido(resultado)
    } catch (err) {
      setPedido(null)
      setErro(getErrorMessage(err))
    } finally {
      setBuscando(false)
    }
  }

  return (
    <>
      <AdminPageHead
        title="Pedidos"
        description="Consulte um pedido pelo seu identificador."
      />

      {/* Aviso sobre a limitação da API */}
      <div className="mb-5 rounded-md border border-info/30 bg-info-soft px-5 py-3.5 text-small text-info">
        A API atual permite consultar pedidos individualmente por ID. A
        listagem completa de pedidos depende de um endpoint
        administrativo no backend.
      </div>

      <AdminCard>
        <AdminCardHead title="Buscar pedido" />
        <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="ID do pedido"
              placeholder="Cole o identificador (UUID) do pedido"
              value={termoId}
              onChange={(e) => setTermoId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscarPedido()}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <Button
            variant="primary"
            onClick={buscarPedido}
            isLoading={buscando}
            loadingText="Buscando…"
          >
            Buscar
          </Button>
        </div>
      </AdminCard>

      {/* Resultado */}
      {buscando && (
        <div className="mt-5">
          <Spinner centered label="Buscando pedido" />
        </div>
      )}

      {!buscando && erro && buscou && (
        <div className="mt-5">
          <AdminCard>
            <EmptyState
              icon={<ClipboardList className="h-6 w-6" />}
              title="Pedido não encontrado"
              description={erro}
            />
          </AdminCard>
        </div>
      )}

      {!buscando && pedido && (
        <div className="mt-5">
          <AdminCard>
            <AdminCardHead
              title={`Pedido #${pedido.id.slice(0, 8).toUpperCase()}`}
              meta={formatDateTime(pedido.dataPedido)}
              action={
                <Link to={ROUTES.pedidoDetalhe(pedido.id)}>
                  <Button variant="ghost" size="sm">
                    Abrir detalhe
                  </Button>
                </Link>
              }
            />
            <div className="border-b border-ink-200 px-6 py-4">
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.1em] text-ink-500">
                Cliente
              </span>
              <p className="m-0 mt-1 font-body text-[0.95rem] font-medium text-ink-900">
                {pedido.nomeUsuario}
              </p>
            </div>
            <AdminTable>
              <thead>
                <tr>
                  <Th>Produto</Th>
                  <Th align="right">Qtd.</Th>
                  <Th align="right">Unitário</Th>
                  <Th align="right">Subtotal</Th>
                </tr>
              </thead>
              <tbody>
                {pedido.itens.map((item) => (
                  <tr key={item.produtoId} className="hover:bg-bg-soft">
                    <Td>
                      <span className="flex items-center gap-2">
                        <Package className="h-3.5 w-3.5 text-ink-400" />
                        {item.nomeProduto}
                      </span>
                    </Td>
                    <Td align="right">
                      <span className="font-mono text-[0.8rem]">
                        {item.quantidade}
                      </span>
                    </Td>
                    <Td align="right">
                      <span className="font-mono text-[0.8rem]">
                        {formatCurrency(item.precoUnitario)}
                      </span>
                    </Td>
                    <Td align="right">
                      <span className="font-mono text-[0.8rem] text-ink-900">
                        {formatCurrency(item.subtotal)}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </AdminTable>
            <div className="flex items-baseline justify-between bg-bg-soft px-6 py-4">
              <span className="font-body text-[0.95rem] font-medium text-ink-900">
                Valor total
              </span>
              <span className="font-display text-h4 font-medium text-ink-900">
                {formatCurrency(pedido.valorTotal)}
              </span>
            </div>
          </AdminCard>
        </div>
      )}
    </>
  )
}
