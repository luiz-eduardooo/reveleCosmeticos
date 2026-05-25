import { api } from '@/lib/axios'
import type {
  PageableParams,
  PagePedidoResponseDTO,
  PedidoDTO,
  PedidoResponseDTO,
} from '@/types'

/**
 * Serviço de pedidos.
 * Endpoints conforme api-spec.json (tag pedido-controller).
 */
export const pedidoService = {
  /** POST /pedidos — cria um pedido com os itens informados. */
  async criar(payload: PedidoDTO): Promise<PedidoResponseDTO> {
    const { data } = await api.post<PedidoResponseDTO>('/pedidos', payload)
    return data
  },

  /** GET /pedidos/{id} — busca um pedido pelo id (uuid). */
  async buscar(id: string): Promise<PedidoResponseDTO> {
    const { data } = await api.get<PedidoResponseDTO>(`/pedidos/${id}`)
    return data
  },

  /**
   * GET /pedidos/meus — pedidos do usuário autenticado, paginados.
   *
   * O endpoint espera um Pageable; o Spring lê os parâmetros planos
   * page, size e sort da query string.
   */
  async listarMeus(
    pageable: PageableParams,
  ): Promise<PagePedidoResponseDTO> {
    const { data } = await api.get<PagePedidoResponseDTO>('/pedidos/meus', {
      params: {
        page: pageable.page,
        size: pageable.size,
        sort: pageable.sort,
      },
    })
    return data
  },
}
