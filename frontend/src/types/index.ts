export * from './api'

/* ──────────────── Tipos de aplicação (não vêm da API) ──────────────── */

/**
 * Item do carrinho — estado client-side.
 * A API não expõe endpoint de carrinho; o carrinho vive no CartContext
 * e é convertido em PedidoDTO no checkout.
 */
export interface CartItem {
  produtoId: number
  nome: string
  preco: number
  quantidade: number
  estoque: number
  statusClube: boolean
}
