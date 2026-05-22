import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  User,
  X,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/helpers'
import { Avatar } from './Avatar'
import { Button } from './Button'

/** Links de navegação principais (públicos). */
const navLinks = [
  { to: ROUTES.home, label: 'Início' },
  { to: ROUTES.produtos, label: 'Produtos' },
  { to: ROUTES.clube, label: 'Clube Revele' },
]

/**
 * Cabeçalho do site — público e autenticado.
 *
 * Sticky com fundo translúcido. Adapta a área direita conforme o
 * estado de autenticação: visitante vê "Entrar"; usuário logado vê
 * um widget com avatar e menu (perfil, pedidos, admin, sair).
 */
export function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false) // menu mobile
  const [userMenuOpen, setUserMenuOpen] = useState(false) // dropdown usuário

  function handleLogout() {
    logout()
    setUserMenuOpen(false)
    setMenuOpen(false)
    navigate(ROUTES.home)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink-200 bg-white/95 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto max-w-container px-5 sm:px-8">
        <div className="flex items-center justify-between gap-6 py-4">
          {/* Marca */}
          <Link
            to={ROUTES.home}
            className="flex flex-shrink-0 items-center gap-3 focus-ring rounded-sm"
          >
            <img
              src="/revele-logo.png"
              alt="Revele Cosméticos"
              className="h-10 w-auto"
            />
          </Link>

          {/* Navegação central — desktop */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === ROUTES.home}
                className={({ isActive }) =>
                  cn(
                    'border-b py-1.5 font-body text-[0.9rem] tracking-[0.02em] transition-colors',
                    isActive
                      ? 'border-wine-600 text-wine-700'
                      : 'border-transparent text-ink-700 hover:text-ink-900',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Área direita */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Carrinho */}
            <Link
              to={ROUTES.carrinho}
              aria-label={`Sacola${totalItems > 0 ? ` (${totalItems} itens)` : ''}`}
              className="relative flex h-10 w-10 items-center justify-center rounded-pill text-ink-700 hover:bg-ink-50 hover:text-ink-900 focus-ring"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.6} />
              {totalItems > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-pill bg-wine-600 px-1 text-[0.6rem] font-medium text-white">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Usuário ou Entrar — desktop */}
            {isAuthenticated && user ? (
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-3 rounded-pill border border-ink-200 bg-white py-1.5 pl-1.5 pr-3.5 transition-colors hover:border-ink-900 focus-ring"
                >
                  <Avatar name={user.name} size="sm" gradient />
                  <span className="flex flex-col text-left leading-tight">
                    <span className="text-[0.82rem] font-medium text-ink-900">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[0.66rem] uppercase tracking-[0.1em] text-wine-600">
                      {user.role === 'ADMIN' ? 'Admin' : 'Cliente'}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 text-ink-500 transition-transform',
                      userMenuOpen && 'rotate-180',
                    )}
                  />
                </button>

                {userMenuOpen && (
                  <>
                    {/* Camada para fechar ao clicar fora */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div
                      role="menu"
                      className="absolute right-0 top-[calc(100%+8px)] z-20 w-56 overflow-hidden rounded-md border border-ink-200 bg-white py-1.5 shadow-e3"
                    >
                      <UserMenuLink
                        to={ROUTES.perfil}
                        icon={<User className="h-4 w-4" />}
                        label="Meu perfil"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <UserMenuLink
                        to={ROUTES.pedidos}
                        icon={<Package className="h-4 w-4" />}
                        label="Meus pedidos"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      {isAdmin && (
                        <UserMenuLink
                          to={ROUTES.admin}
                          icon={<LayoutDashboard className="h-4 w-4" />}
                          label="Painel admin"
                          onClick={() => setUserMenuOpen(false)}
                        />
                      )}
                      <div className="my-1.5 border-t border-ink-200" />
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2 text-left text-[0.88rem] text-ink-600 hover:bg-ink-50 hover:text-danger"
                      >
                        <LogOut className="h-4 w-4" />
                        Sair
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to={ROUTES.login} className="hidden sm:block">
                <Button variant="secondary" size="sm">
                  Entrar
                </Button>
              </Link>
            )}

            {/* Botão menu — mobile */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-pill text-ink-700 hover:bg-ink-50 md:hidden"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="border-t border-ink-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-container flex-col px-5 py-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === ROUTES.home}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'py-3 font-body text-[0.95rem]',
                    isActive
                      ? 'font-medium text-wine-700'
                      : 'text-ink-700',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="my-2 border-t border-ink-200" />

            {isAuthenticated && user ? (
              <>
                <Link
                  to={ROUTES.perfil}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-3 text-[0.95rem] text-ink-700"
                >
                  <User className="h-4 w-4" />
                  Meu perfil
                </Link>
                <Link
                  to={ROUTES.pedidos}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-3 text-[0.95rem] text-ink-700"
                >
                  <Package className="h-4 w-4" />
                  Meus pedidos
                </Link>
                {isAdmin && (
                  <Link
                    to={ROUTES.admin}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-3 text-[0.95rem] text-ink-700"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Painel admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-3 text-left text-[0.95rem] text-danger"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </>
            ) : (
              <Link
                to={ROUTES.login}
                onClick={() => setMenuOpen(false)}
                className="py-2"
              >
                <Button variant="primary" size="sm" fullWidth>
                  Entrar
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

/** Item do dropdown de usuário. */
function UserMenuLink({
  to,
  icon,
  label,
  onClick,
}: {
  to: string
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <Link
      to={to}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-[0.88rem] text-ink-700 hover:bg-ink-50 hover:text-ink-900"
    >
      {icon}
      {label}
    </Link>
  )
}
