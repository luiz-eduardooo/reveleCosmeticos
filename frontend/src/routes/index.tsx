import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { AdminRoute, ProtectedRoute, PublicOnlyRoute } from './guards'
import { PagePlaceholder } from '@/components/PagePlaceholder'
import { PublicLayout } from '@/layouts/PublicLayout'
import { HomePage } from '@/pages/HomePage'
import { CatalogoPage } from '@/pages/CatalogoPage'
import { ProdutoDetalhePage } from '@/pages/ProdutoDetalhePage'
import { ClubePage } from '@/pages/ClubePage'
import { LoginPage } from '@/pages/LoginPage'
import { CadastroPage } from '@/pages/CadastroPage'
import { CarrinhoPage } from '@/pages/CarrinhoPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { PedidosPage } from '@/pages/PedidosPage'
import { PedidoDetalhePage } from '@/pages/PedidoDetalhePage'
import { AssinaturaPage } from '@/pages/AssinaturaPage'
import { PerfilPage } from '@/pages/PerfilPage'

/**
 * Definição central de rotas.
 *
 * Estrutura por área:
 *  - Públicas        -> PublicLayout (Header/Footer) — Fase 3 ✓
 *  - Auth            -> sem layout, bloqueadas para logados — Fase 4
 *  - Cliente (auth)  -> ProtectedRoute + PublicLayout — Fase 5
 *  - Admin           -> AdminRoute + layout admin — Fase 6
 */

export const router = createBrowserRouter([
  /* ─────────── Área pública ─────────── */
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.home, element: <HomePage /> },
      { path: ROUTES.produtos, element: <CatalogoPage /> },
      { path: ROUTES.produtoDetalhe(), element: <ProdutoDetalhePage /> },
      { path: ROUTES.clube, element: <ClubePage /> },
    ],
  },

  /* ─────────── Auth (somente deslogados) ─────────── */
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: ROUTES.login, element: <LoginPage /> },
      { path: ROUTES.cadastro, element: <CadastroPage /> },
    ],
  },

  /* ─────────── Cliente autenticado ─────────── */
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: ROUTES.carrinho, element: <CarrinhoPage /> },
          { path: ROUTES.checkout, element: <CheckoutPage /> },
          { path: ROUTES.pedidos, element: <PedidosPage /> },
          {
            path: ROUTES.pedidoDetalhe(),
            element: <PedidoDetalhePage />,
          },
          { path: ROUTES.assinatura, element: <AssinaturaPage /> },
          { path: ROUTES.perfil, element: <PerfilPage /> },
        ],
      },
    ],
  },

  /* ─────────── Admin (role ADMIN) ─────────── */
  {
    element: <AdminRoute />,
    children: [
      { path: ROUTES.admin, element: <PagePlaceholder title="Dashboard" /> },
      {
        path: ROUTES.adminProdutos,
        element: <PagePlaceholder title="Admin · Produtos" />,
      },
      {
        path: ROUTES.adminProdutoNovo,
        element: <PagePlaceholder title="Admin · Novo produto" />,
      },
      {
        path: ROUTES.adminProdutoEditar(),
        element: <PagePlaceholder title="Admin · Editar produto" />,
      },
      {
        path: ROUTES.adminPedidos,
        element: <PagePlaceholder title="Admin · Pedidos" />,
      },
      {
        path: ROUTES.adminUsuarios,
        element: <PagePlaceholder title="Admin · Usuários" />,
      },
      {
        path: ROUTES.adminAssinaturas,
        element: <PagePlaceholder title="Admin · Assinaturas" />,
      },
    ],
  },

  /* ─────────── Páginas de erro ─────────── */
  {
    path: ROUTES.forbidden,
    element: <PagePlaceholder title="403 — Sem acesso" />,
  },
  {
    path: ROUTES.notFound,
    element: <PagePlaceholder title="404 — Não encontrado" />,
  },
  { path: '*', element: <PagePlaceholder title="404 — Não encontrado" /> },
])
