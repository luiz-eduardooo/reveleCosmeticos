import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authService } from '@/services/authService'
import { registerUnauthorizedHandler } from '@/lib/axios'
import { STORAGE_KEYS } from '@/lib/constants'
import { storage } from '@/lib/helpers'
import type {
  LoginResponseDTO,
  UserCadastroDTO,
  UserLoginDTO,
  UserResponseDTO,
} from '@/types'

interface AuthContextValue {
  user: UserResponseDTO | null
  isAuthenticated: boolean
  isAdmin: boolean
  /** true enquanto a sessão inicial é restaurada do storage. */
  isInitializing: boolean
  login: (credentials: UserLoginDTO) => Promise<UserResponseDTO>
  register: (payload: UserCadastroDTO) => Promise<UserResponseDTO>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponseDTO | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  /** Encerra a sessão: limpa storage e estado em memória. */
  const logout = useCallback(() => {
    storage.remove(STORAGE_KEYS.token)
    storage.remove(STORAGE_KEYS.user)
    setUser(null)
  }, [])

  /**
   * Restauração da sessão ao montar a aplicação.
   * Se houver token, valida-o buscando o perfil; token inválido
   * dispara 401 -> interceptor faz logout.
   */
  useEffect(() => {
    let cancelled = false

    async function restore() {
      const token = storage.getRaw(STORAGE_KEYS.token)
      if (!token) {
        setIsInitializing(false)
        return
      }

      // Otimista: usa o usuário em cache para evitar flicker.
      const cached = storage.get<UserResponseDTO>(STORAGE_KEYS.user)
      if (cached && !cancelled) setUser(cached)

      try {
        const profile = await authService.getProfile()
        if (!cancelled) {
          setUser(profile)
          storage.set(STORAGE_KEYS.user, profile)
        }
      } catch {
        // 401 já é tratado pelo interceptor; aqui só garante limpeza.
        if (!cancelled) logout()
      } finally {
        if (!cancelled) setIsInitializing(false)
      }
    }

    restore()
    return () => {
      cancelled = true
    }
  }, [logout])

  /** Registra o handler de 401 para sincronizar o estado React. */
  useEffect(() => {
    registerUnauthorizedHandler(() => setUser(null))
  }, [])

  const login = useCallback(
    async (credentials: UserLoginDTO): Promise<UserResponseDTO> => {
      const data: LoginResponseDTO = await authService.login(credentials)
      storage.setRaw(STORAGE_KEYS.token, data.token)
      storage.set(STORAGE_KEYS.user, data.usuario)
      setUser(data.usuario)
      return data.usuario
    },
    [],
  )

  const register = useCallback(
    async (payload: UserCadastroDTO): Promise<UserResponseDTO> => {
      // O cadastro não autentica automaticamente (a API só devolve o
      // UserResponseDTO, sem token). O fluxo segue para o login.
      return authService.register(payload)
    },
    [],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isAdmin: user?.role === 'ADMIN',
      isInitializing,
      login,
      register,
      logout,
    }),
    [user, isInitializing, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** Hook de acesso ao contexto de autenticação. */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  }
  return ctx
}
