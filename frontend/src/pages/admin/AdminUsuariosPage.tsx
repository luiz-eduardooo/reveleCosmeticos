import { useMemo, useState } from 'react'
import { Users } from 'lucide-react'
import { userService } from '@/services/userService'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/contexts/AuthContext'
import { AdminPageHead } from '@/layouts/AdminLayout'
import {
  Avatar,
  Badge,
  EmptyState,
  ErrorState,
  Input,
  SkeletonRow,
} from '@/components'
import {
  AdminCard,
  AdminTable,
  Td,
  Th,
} from '@/components/admin/AdminUI'

/**
 * Listagem de usuários no painel admin.
 * GET /usuarios/admin/users, com busca client-side por nome/e-mail.
 */
export function AdminUsuariosPage() {
  const { data, isLoading, error, refetch } = useApi(
    () => userService.listarTodos(),
    [],
  )
  const { user: usuarioAtual } = useAuth()

  const [busca, setBusca] = useState('')

  const usuarios = data ?? []

  const usuariosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return usuarios
    return usuarios.filter(
      (u) =>
        u.name.toLowerCase().includes(termo) ||
        u.email.toLowerCase().includes(termo),
    )
  }, [usuarios, busca])

  const totalAdmins = usuarios.filter((u) => u.role === 'ADMIN').length

  return (
    <>
      <AdminPageHead
        title="Usuários"
        description="Todos os usuários cadastrados na plataforma."
      />

      <AdminCard>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-200 bg-bg-soft px-6 py-4">
          <span className="text-small text-ink-600">
            {isLoading ? (
              'Carregando…'
            ) : (
              <>
                {usuariosFiltrados.length}{' '}
                {usuariosFiltrados.length === 1 ? 'usuário' : 'usuários'}
                {!busca && totalAdmins > 0 && (
                  <span className="text-ink-400">
                    {' '}
                    · {totalAdmins}{' '}
                    {totalAdmins === 1 ? 'admin' : 'admins'}
                  </span>
                )}
              </>
            )}
          </span>
          <div className="w-full sm:w-64">
            <Input
              placeholder="Buscar por nome ou e-mail"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        {/* Estados */}
        {isLoading && (
          <div>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} cols={3} />
            ))}
          </div>
        )}

        {error && !isLoading && (
          <ErrorState message={error} onRetry={refetch} />
        )}

        {!isLoading && !error && usuariosFiltrados.length === 0 && (
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title={
              busca
                ? 'Nenhum usuário encontrado'
                : 'Nenhum usuário cadastrado'
            }
            description={
              busca ? 'Tente outro termo de busca.' : undefined
            }
          />
        )}

        {!isLoading && !error && usuariosFiltrados.length > 0 && (
          <AdminTable>
            <thead>
              <tr>
                <Th>Usuário</Th>
                <Th>E-mail</Th>
                <Th align="center">Papel</Th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-bg-soft">
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={usuario.name} size="sm" />
                      <div>
                        <span className="block font-body text-[0.9rem] font-medium text-ink-900">
                          {usuario.name}
                          {usuario.id === usuarioAtual?.id && (
                            <span className="ml-2 font-mono text-[0.66rem] text-ink-400">
                              (você)
                            </span>
                          )}
                        </span>
                        <span className="font-mono text-[0.68rem] text-ink-500">
                          {usuario.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <span className="text-[0.85rem] text-ink-700">
                      {usuario.email}
                    </span>
                  </Td>
                  <Td align="center">
                    {usuario.role === 'ADMIN' ? (
                      <Badge variant="soft-wine">Admin</Badge>
                    ) : (
                      <Badge variant="sold">Cliente</Badge>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        )}
      </AdminCard>
    </>
  )
}
