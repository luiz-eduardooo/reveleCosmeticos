import { useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { assinaturaService } from '@/services/assinaturaService'
import { useApi } from '@/hooks/useApi'
import { STATUS_ASSINATURA_LABEL } from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/helpers'
import { AdminPageHead } from '@/layouts/AdminLayout'
import {
  AssinaturaStatusPill,
  Chip,
  EmptyState,
  ErrorState,
  SkeletonRow,
} from '@/components'
import {
  AdminCard,
  AdminTable,
  Td,
  Th,
} from '@/components/admin/AdminUI'
import type { StatusAssinatura } from '@/types'

type FiltroStatus = 'TODAS' | StatusAssinatura

/**
 * Listagem de assinaturas no painel admin.
 * GET /assinaturas/admin, com filtro por status (client-side).
 */
export function AdminAssinaturasPage() {
  const { data, isLoading, error, refetch } = useApi(
    () => assinaturaService.listarTodas(),
    [],
  )

  const [filtro, setFiltro] = useState<FiltroStatus>('TODAS')

  const assinaturas = data ?? []

  const assinaturasFiltradas = useMemo(() => {
    if (filtro === 'TODAS') return assinaturas
    return assinaturas.filter((a) => a.status === filtro)
  }, [assinaturas, filtro])

  // Contadores por status para os chips.
  const contagem = useMemo(
    () => ({
      TODAS: assinaturas.length,
      ATIVA: assinaturas.filter((a) => a.status === 'ATIVA').length,
      PAUSADA: assinaturas.filter((a) => a.status === 'PAUSADA').length,
      CANCELADA: assinaturas.filter((a) => a.status === 'CANCELADA')
        .length,
    }),
    [assinaturas],
  )

  const filtros: FiltroStatus[] = [
    'TODAS',
    'ATIVA',
    'PAUSADA',
    'CANCELADA',
  ]

  return (
    <>
      <AdminPageHead
        title="Assinaturas"
        description="Todas as assinaturas do Clube Revele."
      />

      <AdminCard>
        {/* Toolbar com filtros */}
        <div className="flex flex-wrap items-center gap-2 border-b border-ink-200 bg-bg-soft px-6 py-4">
          {filtros.map((f) => (
            <Chip
              key={f}
              active={filtro === f}
              onClick={() => setFiltro(f)}
            >
              {f === 'TODAS' ? 'Todas' : STATUS_ASSINATURA_LABEL[f]}
              <span className="ml-1 opacity-60">({contagem[f]})</span>
            </Chip>
          ))}
        </div>

        {/* Estados */}
        {isLoading && (
          <div>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} cols={5} />
            ))}
          </div>
        )}

        {error && !isLoading && (
          <ErrorState message={error} onRetry={refetch} />
        )}

        {!isLoading && !error && assinaturasFiltradas.length === 0 && (
          <EmptyState
            icon={<Sparkles className="h-6 w-6" />}
            title={
              filtro === 'TODAS'
                ? 'Nenhuma assinatura'
                : 'Nenhuma assinatura neste status'
            }
            description={
              filtro === 'TODAS'
                ? 'Ainda não há assinaturas no Clube.'
                : 'Tente outro filtro de status.'
            }
          />
        )}

        {!isLoading && !error && assinaturasFiltradas.length > 0 && (
          <AdminTable>
            <thead>
              <tr>
                <Th>Cliente</Th>
                <Th>Plano</Th>
                <Th align="right">Preço</Th>
                <Th>Período</Th>
                <Th align="center">Status</Th>
              </tr>
            </thead>
            <tbody>
              {assinaturasFiltradas.map((assinatura) => (
                <tr
                  key={assinatura.id}
                  className="hover:bg-bg-soft"
                >
                  <Td>
                    <span className="font-body text-[0.9rem] font-medium text-ink-900">
                      {assinatura.nomeUsuario}
                    </span>
                  </Td>
                  <Td>
                    <span className="text-[0.85rem] text-ink-700">
                      {assinatura.nomePlano}
                    </span>
                  </Td>
                  <Td align="right">
                    <span className="font-mono text-[0.8rem] text-ink-900">
                      {formatCurrency(assinatura.precoPlano)}
                    </span>
                  </Td>
                  <Td>
                    <span className="font-mono text-[0.74rem] text-ink-600">
                      {formatDate(assinatura.dataInicio)} —{' '}
                      {formatDate(assinatura.dataFinal)}
                    </span>
                  </Td>
                  <Td align="center">
                    <AssinaturaStatusPill status={assinatura.status} />
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
