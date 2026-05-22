import { api } from '@/lib/axios'
import type { PlanoDTO, PlanoResponseDTO } from '@/types'

/**
 * Serviço de planos do Clube.
 * Endpoints conforme api-spec.json (tag plano-controller).
 */
export const planoService = {
  /** GET /planos/ — lista todos os planos. */
  async listar(): Promise<PlanoResponseDTO[]> {
    const { data } = await api.get<PlanoResponseDTO[]>('/planos/')
    return data
  },

  /** POST /planos — cria um plano (admin). */
  async criar(payload: PlanoDTO): Promise<PlanoResponseDTO> {
    const { data } = await api.post<PlanoResponseDTO>('/planos', payload)
    return data
  },

  /** PUT /planos/{id} — atualiza um plano (admin). */
  async atualizar(
    id: string,
    payload: PlanoDTO,
  ): Promise<PlanoResponseDTO> {
    const { data } = await api.put<PlanoResponseDTO>(
      `/planos/${id}`,
      payload,
    )
    return data
  },

  /** DELETE /planos/{id} — remove um plano (admin). */
  async deletar(id: string): Promise<void> {
    await api.delete(`/planos/${id}`)
  },
}
