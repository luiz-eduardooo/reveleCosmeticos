import { api } from '@/lib/axios'
import type {
  ProdutoCreateDTO,
  ProdutoResponseDTO,
  ProdutoUpdateDTO,
} from '@/types'

/**
 * Serviço de produtos.
 * Endpoints conforme api-spec.json (tag produto-controller).
 */
export const produtoService = {
  /** GET /produtos — lista todos os produtos. */
  async listar(): Promise<ProdutoResponseDTO[]> {
    const { data } = await api.get<ProdutoResponseDTO[]>('/produtos')
    return data
  },

  /** GET /produtos/{id} — busca um produto pelo id. */
  async buscar(id: number): Promise<ProdutoResponseDTO> {
    const { data } = await api.get<ProdutoResponseDTO>(`/produtos/${id}`)
    return data
  },

  /** POST /produtos — cria um produto (admin). */
  async criar(payload: ProdutoCreateDTO): Promise<ProdutoResponseDTO> {
    const { data } = await api.post<ProdutoResponseDTO>('/produtos', payload)
    return data
  },

  /** PATCH /produtos/{id} — atualização parcial (admin). */
  async modificar(
    id: number,
    payload: ProdutoUpdateDTO,
  ): Promise<ProdutoResponseDTO> {
    const { data } = await api.patch<ProdutoResponseDTO>(
      `/produtos/${id}`,
      payload,
    )
    return data
  },

  /** DELETE /produtos/{id} — remove um produto (admin). */
  async deletar(id: number): Promise<void> {
    await api.delete(`/produtos/${id}`)
  },
}
