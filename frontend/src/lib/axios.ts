import axios, { AxiosError } from 'axios'
import { API_BASE_URL, STORAGE_KEYS, ROUTES } from './constants'
import { storage } from './helpers'


export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})


api.interceptors.request.use((config) => {
  const token = storage.getRaw(STORAGE_KEYS.token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


let onUnauthorized: (() => void) | null = null

export function registerUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler
}

let isHandlingUnauthorized = false

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      storage.remove(STORAGE_KEYS.token)
      storage.remove(STORAGE_KEYS.user)

      onUnauthorized?.()

      if (!isHandlingUnauthorized) {
        isHandlingUnauthorized = true
        const onLoginPage = window.location.pathname === ROUTES.login
        if (!onLoginPage) {
          const redirect = encodeURIComponent(
            window.location.pathname + window.location.search,
          )
          window.location.href = `${ROUTES.login}?redirect=${redirect}`
        }
        setTimeout(() => {
          isHandlingUnauthorized = false
        }, 0)
      }
    }
    return Promise.reject(error)
  },
)
