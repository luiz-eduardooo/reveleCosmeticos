import { api } from '@/lib/axios'
import type {
  LoginResponseDTO,
  UserCadastroDTO,
  UserLoginDTO,
  UserResponseDTO,
} from '@/types'

/**
 * Serviço de autenticação.
 * Endpoints conforme api-spec.json (tag user-controller).
 */
export const authService = {
  /** POST /usuarios/login — retorna token + dados do usuário. */
  async login(payload: UserLoginDTO): Promise<LoginResponseDTO> {
    const { data } = await api.post<LoginResponseDTO>(
      '/usuarios/login',
      payload,
    )
    return data
  },

  /** POST /usuarios/cadastrar — cria um novo usuário. */
  async register(payload: UserCadastroDTO): Promise<UserResponseDTO> {
    const { data } = await api.post<UserResponseDTO>(
      '/usuarios/cadastrar',
      payload,
    )
    return data
  },

  /** GET /usuarios/perfil — dados do usuário autenticado. */
  async getProfile(): Promise<UserResponseDTO> {
    const { data } = await api.get<UserResponseDTO>('/usuarios/perfil')
    return data
  },
}
