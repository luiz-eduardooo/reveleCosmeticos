import { AxiosError } from 'axios'
import type { ErroResponse } from '@/types'

/* ──────────────── Formatação ──────────────── */

/** Formata número como moeda brasileira (R$). */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value ?? 0)
}

/** Formata data-hora ISO para o formato brasileiro. */
export function formatDateTime(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/** Formata apenas a data (sem hora). */
export function formatDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

/** Iniciais para fallback de avatar (ex.: "Ana Costa" -> "AC"). */
export function getInitials(name: string): string {
  if (!name?.trim()) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Encurta um UUID para exibição (ex.: "a1b2c3d4...e5f6"). */
export function shortId(id: string): string {
  if (!id || id.length <= 13) return id
  return `${id.slice(0, 8)}…${id.slice(-4)}`
}

/* ──────────────── Tratamento de erro ──────────────── */

/**
 * Extrai uma mensagem legível de qualquer erro de chamada à API.
 * Reconhece o formato estruturado ErroResponse do backend.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ErroResponse | string | undefined

    if (data && typeof data === 'object' && 'mensagem' in data) {
      return data.mensagem
    }
    if (typeof data === 'string' && data.trim()) {
      return data
    }
    if (error.code === 'ERR_NETWORK') {
      return 'Não foi possível conectar ao servidor. Tente novamente em instantes.'
    }
    if (error.response?.status === 404) {
      return 'Recurso não encontrado.'
    }
    if (error.response?.status === 403) {
      return 'Você não tem permissão para esta ação.'
    }
    if (error.response && error.response.status >= 500) {
      return 'Erro interno do servidor. Tente novamente mais tarde.'
    }
    return error.message || 'Ocorreu um erro inesperado.'
  }

  if (error instanceof Error) return error.message
  return 'Ocorreu um erro inesperado.'
}

/**
 * Extrai erros de campo do ErroResponse, para exibir inline em formulários.
 * Retorna um mapa { campo: mensagem } ou objeto vazio.
 */
export function getFieldErrors(error: unknown): Record<string, string> {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ErroResponse | undefined
    if (data && typeof data === 'object' && data.campos) {
      return data.campos
    }
  }
  return {}
}

/* ──────────────── localStorage seguro ──────────────── */

export const storage = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* quota excedida ou indisponível — ignora silenciosamente */
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch {
      /* ignora */
    }
  },
  /** String crua, sem JSON.stringify (usado para o token JWT). */
  getRaw(key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setRaw(key: string, value: string): void {
    try {
      localStorage.setItem(key, value)
    } catch {
      /* ignora */
    }
  },
}

/** Concatena classes condicionalmente (mini utilitário tipo clsx). */
export function cn(...classes: unknown[]): string {
  return classes.filter((c): c is string => typeof c === 'string' && c.length > 0).join(' ')
}
