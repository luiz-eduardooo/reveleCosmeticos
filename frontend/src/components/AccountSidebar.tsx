import { NavLink } from 'react-router-dom'
import { Package, Sparkles, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/helpers'
import { Avatar } from './Avatar'

/** Itens de navegação da área de conta do cliente. */
const accountNav = [
  { to: ROUTES.pedidos, label: 'Meus pedidos', icon: Package },
  { to: ROUTES.assinatura, label: 'Minha assinatura', icon: Sparkles },
  { to: ROUTES.perfil, label: 'Meu perfil', icon: User },
]

/**
 * Barra lateral das telas de conta.
 * Exibe o cartão do usuário e a navegação entre pedidos, assinatura
 * e perfil. No mobile vira uma faixa de navegação horizontal.
 */
export function AccountSidebar() {
  const { user } = useAuth()

  return (
    <aside className="lg:sticky lg:top-[88px]">
      {/* Cartão do usuário — só desktop */}
      {user && (
        <div className="mb-5 hidden flex-col gap-3 rounded-md border border-ink-200 p-5 lg:flex">
          <Avatar name={user.name} size="lg" gradient />
          <div>
            <div className="font-display text-[1.15rem] font-medium leading-tight text-ink-900">
              {user.name}
            </div>
            <div className="mt-0.5 font-mono text-[0.7rem] uppercase tracking-[0.06em] text-wine-700">
              {user.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
            </div>
          </div>
        </div>
      )}

      {/* Navegação */}
      <nav className="flex gap-1 overflow-x-auto lg:flex-col">
        {accountNav.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-shrink-0 items-center gap-3 rounded-sm px-3.5 py-2.5 text-[0.9rem] transition-colors',
                  isActive
                    ? 'bg-wine-50 font-medium text-wine-700'
                    : 'text-ink-700 hover:bg-ink-50 hover:text-ink-900',
                )
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0 opacity-80" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

/**
 * Casca de página de conta — sidebar + conteúdo.
 * Usada por Pedidos, Assinatura e Perfil.
 */
export function AccountShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-container px-5 py-9 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-10">
        <AccountSidebar />
        <div>{children}</div>
      </div>
    </div>
  )
}

/** Cabeçalho padrão das páginas de conta. */
export function AccountHead({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <header className="mb-7">
      <span className="eyebrow text-wine-600">{eyebrow}</span>
      <h1 className="my-3 font-display text-[2.5rem] font-normal leading-[1.05] tracking-[-0.005em] text-ink-900">
        {title}
      </h1>
      {description && (
        <p className="m-0 max-w-[60ch] text-ink-600">{description}</p>
      )}
    </header>
  )
}
