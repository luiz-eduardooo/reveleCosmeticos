import axios, { AxiosError } from 'axios'
import { API_BASE_URL, STORAGE_KEYS, ROUTES } from './constants'
import { storage } from './helpers'

/**
 * Instância Axios central da aplicação.
 *
 * - Interceptor de request: injeta "Authorization: Bearer {token}".
 * - Interceptor de response: ao receber 401 (token expirado/inválido),
 *   limpa a sessão e redireciona para o login.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

/* ──────────────── Request: injeta o JWT ──────────────── */

api.interceptors.request.use((config) => {
  const token = storage.getRaw(STORAGE_KEYS.token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/* ──────────────── Response: trata 401 ──────────────── */

/**
 * Callback opcional registrado pelo AuthContext para limpar o estado
 * de auth em memória. Evita acoplar o axios diretamente ao React.
 */
let onUnauthorized: (() => void) | null = null

export function registerUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler
}

/** Evita múltiplos redirects simultâneos quando várias requests falham. */
let isHandlingUnauthorized = false

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirou (24h, sem refresh) ou é inválido.
      storage.remove(STORAGE_KEYS.token)
      storage.remove(STORAGE_KEYS.user)

      onUnauthorized?.()

      if (!isHandlingUnauthorized) {
        isHandlingUnauthorized = true
        const onLoginPage = window.location.pathname === ROUTES.login
        if (!onLoginPage) {
          // Preserva o destino para retornar após o login.
          const redirect = encodeURIComponent(
            window.location.pathname + window.location.search,
          )
          window.location.href = `${ROUTES.login}?redirect=${redirect}`
        }
        // Libera a flag no próximo ciclo de eventos.
        setTimeout(() => {
          isHandlingUnauthorized = false
        }, 0)
      }
    }
    return Promise.reject(error)
  },
)
