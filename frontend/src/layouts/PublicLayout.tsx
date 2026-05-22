import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

/**
 * Layout público — usado por todas as telas com Header e Footer
 * (páginas públicas e telas de cliente autenticado).
 */
export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {/* Restaura o scroll ao topo a cada navegação. */}
      <ScrollRestoration />
    </div>
  )
}
