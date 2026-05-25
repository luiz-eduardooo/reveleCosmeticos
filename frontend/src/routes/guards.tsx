import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/lib/constants'

/**
 * Tela de carregamento exibida enquanto a sessão é restaurada,
 * evitando redirecionar antes de saber se o usuário está logado.
 */
function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-wine-600"
          aria-hidden
        />
        <span className="font-mono text-micro uppercase tracking-eyebrow text-ink-500">
          Carregando
        </span>
      </div>
    </div>
  )
}

/**
 * Guard de rota autenticada.
 * Redireciona para /login (preservando o destino) se não houver sessão.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth()
  const location = useLocation()

  if (isInitializing) return <AuthLoading />

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`${ROUTES.login}?redirect=${redirect}`} replace />
  }

  return <Outlet />
}

/**
 * Guard de rota administrativa.
 * Exige sessão E role ADMIN; caso contrário envia para 403.
 */
export function AdminRoute() {
  const { isAuthenticated, isAdmin, isInitializing } = useAuth()
  const location = useLocation()

  if (isInitializing) return <AuthLoading />

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`${ROUTES.login}?redirect=${redirect}`} replace />
  }

  if (!isAdmin) {
    return <Navigate to={ROUTES.forbidden} replace />
  }

  return <Outlet />
}

/**
 * Guard inverso: bloqueia rotas de auth (login/cadastro) para quem
 * já está logado. Respeita ?redirect= para devolver o usuário ao
 * destino que o trouxe ao login.
 */
export function PublicOnlyRoute() {
  const { isAuthenticated, isInitializing } = useAuth()
  const [searchParams] = useSearchParams()

  if (isInitializing) return <AuthLoading />

  if (isAuthenticated) {
    const redirect = searchParams.get('redirect')
    return (
      <Navigate
        to={redirect ? decodeURIComponent(redirect) : ROUTES.home}
        replace
      />
    )
  }

  return <Outlet />
}
