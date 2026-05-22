import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '@/lib/helpers'

interface UseApiResult<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  /** Reexecuta a chamada (usado pelo botão "Tentar de novo"). */
  refetch: () => void
}

/**
 * Hook que encapsula o ciclo loading / erro / sucesso de uma chamada
 * à API, atendendo a regra de qualidade dos três estados.
 *
 * @param fetcher  função assíncrona que retorna os dados
 * @param deps     dependências que disparam um novo fetch ao mudar
 *
 * @example
 *   const { data, isLoading, error, refetch } = useApi(
 *     () => produtoService.listar(), [],
 *   )
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = [],
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Incrementado por refetch() para forçar nova execução.
  const [reloadKey, setReloadKey] = useState(0)

  const refetch = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)
    setError(null)

    fetcher()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err))
          setData(null)
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
    // O fetcher é intencionalmente omitido das deps: o chamador
    // controla a reexecução via `deps` + reloadKey.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey])

  return { data, isLoading, error, refetch }
}
