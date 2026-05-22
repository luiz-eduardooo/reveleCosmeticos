import { api } from '@/lib/axios'
import type { AssinaturaDTO, AssinaturaResponseDTO } from '@/types'

/**
 * Serviço de assinaturas.
 * Endpoints conforme api-spec.json (tag assinatura-controller).
 */
export const assinaturaService = {
  /** POST /assinaturas/ — cria uma assinatura para o plano informado. */
  async assinar(payload: AssinaturaDTO): Promise<AssinaturaResponseDTO> {
    const { data } = await api.post<AssinaturaResponseDTO>(
      '/assinaturas/',
      payload,
    )
    return data
  },

  /** PATCH /assinaturas/{id}/renovar — renova a assinatura. */
  async renovar(id: string): Promise<AssinaturaResponseDTO> {
    const { data } = await api.patch<AssinaturaResponseDTO>(
      `/assinaturas/${id}/renovar`,
    )
    return data
  },

  /**
   * PATCH /assinaturas/{id}/pausar — alterna o status de pausa.
   * O operationId na spec é "alterarStatusAssinatura": o mesmo
   * endpoint pausa e retoma a assinatura.
   */
  async alternarPausa(id: string): Promise<AssinaturaResponseDTO> {
    const { data } = await api.patch<AssinaturaResponseDTO>(
      `/assinaturas/${id}/pausar`,
    )
    return data
  },

  /** PATCH /assinaturas/{id}/cancelar — cancela a assinatura. */
  async cancelar(id: string): Promise<AssinaturaResponseDTO> {
    const { data } = await api.patch<AssinaturaResponseDTO>(
      `/assinaturas/${id}/cancelar`,
    )
    return data
  },

  /** GET /assinaturas/admin — lista todas as assinaturas (admin). */
  async listarTodas(): Promise<AssinaturaResponseDTO[]> {
    const { data } = await api.get<AssinaturaResponseDTO[]>(
      '/assinaturas/admin',
    )
    return data
  },
}
