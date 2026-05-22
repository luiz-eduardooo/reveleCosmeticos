import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { STORAGE_KEYS } from '@/lib/constants'
import { storage } from '@/lib/helpers'
import type { CartItem, PedidoDTO, ProdutoResponseDTO } from '@/types'

interface CartContextValue {
  items: CartItem[]
  /** Quantidade total de unidades no carrinho. */
  totalItems: number
  /** Soma dos subtotais (preço × quantidade). */
  totalPrice: number
  isEmpty: boolean
  addItem: (produto: ProdutoResponseDTO, quantidade?: number) => void
  removeItem: (produtoId: number) => void
  updateQuantity: (produtoId: number, quantidade: number) => void
  clear: () => void
  /** Converte o carrinho no payload aceito por POST /pedidos. */
  toPedidoDTO: () => PedidoDTO
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

/**
 * Estado global do carrinho.
 *
 * A API não expõe endpoints de carrinho — o POST /pedidos recebe todos
 * os itens de uma vez. Portanto o carrinho é mantido no cliente e
 * persistido em localStorage, sendo convertido em PedidoDTO no checkout.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(
    () => storage.get<CartItem[]>(STORAGE_KEYS.cart) ?? [],
  )

  /** Persiste qualquer alteração do carrinho. */
  useEffect(() => {
    storage.set(STORAGE_KEYS.cart, items)
  }, [items])

  const addItem = useCallback(
    (produto: ProdutoResponseDTO, quantidade = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.produtoId === produto.id)
        if (existing) {
          // Soma respeitando o limite de estoque.
          const nova = Math.min(
            existing.quantidade + quantidade,
            produto.estoque,
          )
          return prev.map((i) =>
            i.produtoId === produto.id ? { ...i, quantidade: nova } : i,
          )
        }
        return [
          ...prev,
          {
            produtoId: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: Math.min(quantidade, produto.estoque),
            estoque: produto.estoque,
            statusClube: produto.statusClube,
          },
        ]
      })
    },
    [],
  )

  const removeItem = useCallback((produtoId: number) => {
    setItems((prev) => prev.filter((i) => i.produtoId !== produtoId))
  }, [])

  const updateQuantity = useCallback(
    (produtoId: number, quantidade: number) => {
      setItems((prev) =>
        prev
          .map((i) => {
            if (i.produtoId !== produtoId) return i
            const clamped = Math.max(0, Math.min(quantidade, i.estoque))
            return { ...i, quantidade: clamped }
          })
          // quantidade 0 remove o item
          .filter((i) => i.quantidade > 0),
      )
    },
    [],
  )

  const clear = useCallback(() => setItems([]), [])

  const toPedidoDTO = useCallback(
    (): PedidoDTO => ({
      itens: items.map((i) => ({
        produtoId: i.produtoId,
        quantidade: i.quantidade,
      })),
    }),
    [items],
  )

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((sum, i) => sum + i.quantidade, 0)
    const totalPrice = items.reduce(
      (sum, i) => sum + i.preco * i.quantidade,
      0,
    )
    return {
      items,
      totalItems,
      totalPrice,
      isEmpty: items.length === 0,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      toPedidoDTO,
    }
  }, [items, addItem, removeItem, updateQuantity, clear, toPedidoDTO])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

/** Hook de acesso ao carrinho. */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart deve ser usado dentro de <CartProvider>')
  }
  return ctx
}
