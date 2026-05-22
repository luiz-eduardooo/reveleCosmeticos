import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { ToastProvider } from '@/components'
import { router } from '@/routes'

/**
 * Raiz da aplicação.
 * Ordem dos providers: Toast (mais externo, sem dependências) ->
 * Auth -> Cart -> Router. Guards e páginas acessam todos eles.
 */
export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
