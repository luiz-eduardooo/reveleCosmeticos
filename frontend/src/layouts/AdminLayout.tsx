import { useState } from 'react'
import { Link, NavLink, Outlet, ScrollRestoration, useNavigate } from 'react-router-dom'
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Sparkles,
  Store,
  Users,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/helpers'
import { Avatar } from '@/components'

/** Itens de navegação do painel admin. */
const adminNav = [
  { to: ROUTES.admin, label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: ROUTES.adminProdutos, label: 'Produtos', icon: Package, end: false },
  { to: ROUTES.adminPedidos, label: 'Pedidos', icon: ClipboardList, end: false },
  { to: ROUTES.adminUsuarios, label: 'Usuários', icon: Users, end: false },
  {
    to: ROUTES.adminAssinaturas,
    label: 'Assinaturas',
    icon: Sparkles,
    end: false,
  },
]

/**
 * Layout do painel administrativo.
 * Sidebar fixa (248px) no desktop, drawer no mobile, topbar e
 * área de conteúdo. Já está dentro do AdminRoute (checa role ADMIN).
 */
export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate(ROUTES.home)
  }

  return (
    <div className="min-h-screen bg-ink-50 lg:grid lg:grid-cols-[248px_1fr]">
      {/* ───── Sidebar (desktop) ───── */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-ink-200 bg-white lg:flex">
        <SidebarContent
          userName={user?.name ?? ''}
          onNavigate={() => {}}
          onLogout={handleLogout}
        />
      </aside>

      {/* ───── Drawer (mobile) ───── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-900/45"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-white shadow-e4">
            <SidebarContent
              userName={user?.name ?? ''}
              onNavigate={() => setDrawerOpen(false)}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      )}

      {/* ───── Main ───── */}
      <div className="flex min-w-0 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-5 border-b border-ink-200 bg-white px-5 py-3.5 sm:px-7">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menu"
              className="flex h-9 w-9 items-center justify-center rounded-sm text-ink-700 hover:bg-ink-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.06em] text-ink-500">
              Painel administrativo
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 font-mono text-[0.66rem] uppercase tracking-[0.06em] text-success sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Online
            </span>
            <Link
              to={ROUTES.home}
              className="flex items-center gap-1.5 text-[0.82rem] text-ink-600 hover:text-ink-900"
            >
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">Ver loja</span>
            </Link>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="mx-auto w-full max-w-[1440px] flex-1 p-5 sm:p-7">
          <Outlet />
        </main>
      </div>

      <ScrollRestoration />
    </div>
  )
}

/* ──────────────── Conteúdo da sidebar ──────────────── */

function SidebarContent({
  userName,
  onNavigate,
  onLogout,
}: {
  userName: string
  onNavigate: () => void
  onLogout: () => void
}) {
  return (
    <>
      {/* Marca */}
      <div className="flex items-center justify-between border-b border-ink-200 px-5 py-5">
        <Link to={ROUTES.admin} className="flex items-center gap-3">
          <img
            src="/revele-logo.png"
            alt="Revele"
            className="h-9 w-auto"
          />
          <span className="flex flex-col">
            <b className="font-body text-[0.74rem] font-medium tracking-[0.18em] text-ink-900">
              REVELE
            </b>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-wine-700">
              Admin
            </span>
          </span>
        </Link>
      </div>

      {/* Navegação */}
      <nav className="flex flex-1 flex-col gap-px overflow-y-auto px-3 py-5">
        <span className="mb-2 px-3 font-body text-[0.66rem] font-medium uppercase tracking-[0.16em] text-ink-500">
          Gestão
        </span>
        {adminNav.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-3 rounded-sm px-3 py-2.5 text-[0.88rem] transition-colors',
                  isActive
                    ? 'bg-wine-50 font-medium text-wine-700'
                    : 'text-ink-700 hover:bg-ink-50 hover:text-ink-900',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-sm bg-wine-600" />
                  )}
                  <Icon className="h-4 w-4 flex-shrink-0 opacity-80" />
                  {item.label}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Rodapé */}
      <div className="flex items-center gap-3 border-t border-ink-200 px-5 py-4">
        <Avatar name={userName} size="sm" gradient />
        <div className="min-w-0 flex-1">
          <b className="block truncate font-body text-[0.82rem] font-medium text-ink-900">
            {userName}
          </b>
          <span className="font-mono text-[0.66rem] uppercase tracking-[0.06em] text-ink-500">
            Administrador
          </span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          aria-label="Sair"
          className="flex h-8 w-8 items-center justify-center rounded-sm text-ink-500 hover:bg-ink-50 hover:text-danger"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </>
  )
}

/* ──────────────── Cabeçalho de página admin ──────────────── */

export function AdminPageHead({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
      <div>
        <h1 className="font-display text-[2.25rem] font-normal leading-tight tracking-[-0.005em] text-ink-900">
          {title}
        </h1>
        {description && (
          <p className="m-0 mt-2 max-w-[60ch] text-[0.92rem] text-ink-600">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}
