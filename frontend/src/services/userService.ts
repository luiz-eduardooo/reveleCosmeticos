import { api } from '@/lib/axios'
import type { UserResponseDTO, UserUpdateDTO } from '@/types'

/**
 * Serviço de usuários.
 * Endpoints conforme api-spec.json (tag user-controller).
 */
export const userService = {
  /** GET /usuarios/perfil — dados do usuário autenticado. */
  async getPerfil(): Promise<UserResponseDTO> {
    const { data } = await api.get<UserResponseDTO>('/usuarios/perfil')
    return data
  },

  /** PUT /usuarios/{id} — atualiza nome e/ou e-mail. */
  async atualizar(
    id: string,
    payload: UserUpdateDTO,
  ): Promise<UserResponseDTO> {
    const { data } = await api.put<UserResponseDTO>(
      `/usuarios/${id}`,
      payload,
    )
    return data
  },

  /** DELETE /usuarios/{id} — remove a conta. */
  async deletar(id: string): Promise<void> {
    await api.delete(`/usuarios/${id}`)
  },

  /** GET /usuarios/admin/users — lista todos os usuários (admin). */
  async listarTodos(): Promise<UserResponseDTO[]> {
    const { data } = await api.get<UserResponseDTO[]>(
      '/usuarios/admin/users',
    )
    return data
  },
}
