import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarClock,
  Pause,
  Play,
  RotateCw,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { assinaturaService } from '@/services/assinaturaService'
import { ROUTES } from '@/lib/constants'
import { formatCurrency, formatDate, getErrorMessage } from '@/lib/helpers'
import {
  AccountShell,
  AccountHead,
} from '@/components/AccountSidebar'
import {
  AssinaturaStatusPill,
  Button,
  ConfirmModal,
  EmptyState,
  useToast,
} from '@/components'
import type { AssinaturaResponseDTO } from '@/types'

/**
 * Página "Minha assinatura".
 *
 * Nota sobre a API: a especificação não expõe um endpoint para o
 * cliente consultar a própria assinatura (só POST para criar, os
 * PATCH de ação e o GET /assinaturas/admin restrito a admin). Assim,
 * esta tela gerencia a assinatura ativa na sessão — criada na página
 * do Clube e mantida no estado do app. Sem assinatura em sessão, a
 * tela direciona o usuário ao Clube.
 *
 * As ações renovar / pausar / cancelar usam os PATCH disponíveis e
 * atualizam o estado com a resposta da API.
 */

type AcaoPendente = 'cancelar' | null

export function AssinaturaPage() {
  const toast = useToast()

  // A assinatura ativa da sessão (vinda do fluxo de assinatura).
  const [assinatura, setAssinatura] =
    useState<AssinaturaResponseDTO | null>(null)
  const [acaoEmAndamento, setAcaoEmAndamento] = useState(false)
  const [acaoPendente, setAcaoPendente] = useState<AcaoPendente>(null)

  /** Executa uma ação de assinatura e atualiza o estado. */
  async function executarAcao(
    acao: () => Promise<AssinaturaResponseDTO>,
    mensagemSucesso: string,
  ) {
    if (!assinatura) return
    setAcaoEmAndamento(true)
    try {
      const atualizada = await acao()
      setAssinatura(atualizada)
      toast.success(mensagemSucesso)
    } catch (err) {
      toast.error('Não foi possível concluir', {
        description: getErrorMessage(err),
      })
    } finally {
      setAcaoEmAndamento(false)
      setAcaoPendente(null)
    }
  }

  /* ───── Sem assinatura em sessão ───── */
  if (!assinatura) {
    return (
      <AccountShell>
        <AccountHead
          eyebrow="Conta"
          title="Minha assinatura"
          description="Gerencie seu plano do Clube Revele."
        />
        <div className="rounded-md border border-ink-200 bg-white">
          <EmptyState
            icon={<Sparkles className="h-6 w-6" />}
            title="Você ainda não tem uma assinatura ativa"
            description="Assine o Clube Revele para ter preço de assinante, curadoria mensal e brindes exclusivos."
            action={
              <Link to={ROUTES.clube}>
                <Button variant="primary" size="sm">
                  Conhecer o Clube
                </Button>
              </Link>
            }
          />
        </div>
      </AccountShell>
    )
  }

  const isCancelada = assinatura.status === 'CANCELADA'
  const isPausada = assinatura.status === 'PAUSADA'
  const isAtiva = assinatura.status === 'ATIVA'

  return (
    <AccountShell>
      <AccountHead
        eyebrow="Conta"
        title="Minha assinatura"
        description="Gerencie seu plano do Clube Revele."
      />

      {/* Cartão da assinatura */}
      <div className="overflow-hidden rounded-md border border-ink-200 bg-white">
        {/* Topo */}
        <div className="flex items-start justify-between gap-4 bg-gradient-to-b from-wine-50 to-white p-6">
          <div>
            <span className="font-mono text-[0.66rem] uppercase tracking-eyebrow text-wine-600">
              Plano
            </span>
            <h2 className="mt-1 font-display text-h3 font-medium text-ink-900">
              {assinatura.nomePlano}
            </h2>
            <p className="m-0 mt-1 text-small text-ink-600">
              {formatCurrency(assinatura.precoPlano)}
            </p>
          </div>
          <AssinaturaStatusPill status={assinatura.status} />
        </div>

        {/* Detalhes */}
        <div className="grid grid-cols-1 gap-4 border-t border-ink-200 p-6 sm:grid-cols-2">
          <DetalheItem
            icon={<CalendarClock className="h-4 w-4" />}
            label="Início"
            value={formatDate(assinatura.dataInicio)}
          />
          <DetalheItem
            icon={<CalendarClock className="h-4 w-4" />}
            label={isCancelada ? 'Encerrada em' : 'Renova em'}
            value={formatDate(assinatura.dataFinal)}
          />
        </div>

        {/* Ações */}
        {!isCancelada && (
          <div className="flex flex-wrap gap-3 border-t border-ink-200 p-6">
            <Button
              variant="secondary"
              size="sm"
              isLoading={acaoEmAndamento}
              onClick={() =>
                executarAcao(
                  () => assinaturaService.renovar(assinatura.id),
                  'Assinatura renovada.',
                )
              }
              leftIcon={<RotateCw className="h-3.5 w-3.5" />}
            >
              Renovar
            </Button>

            <Button
              variant="secondary"
              size="sm"
              isLoading={acaoEmAndamento}
              onClick={() =>
                executarAcao(
                  () => assinaturaService.alternarPausa(assinatura.id),
                  isPausada
                    ? 'Assinatura retomada.'
                    : 'Assinatura pausada.',
                )
              }
              leftIcon={
                isPausada ? (
                  <Play className="h-3.5 w-3.5" />
                ) : (
                  <Pause className="h-3.5 w-3.5" />
                )
              }
            >
              {isPausada ? 'Retomar' : 'Pausar'}
            </Button>

            <Button
              variant="danger"
              size="sm"
              disabled={acaoEmAndamento}
              onClick={() => setAcaoPendente('cancelar')}
              leftIcon={<XCircle className="h-3.5 w-3.5" />}
            >
              Cancelar assinatura
            </Button>
          </div>
        )}

        {isCancelada && (
          <div className="border-t border-ink-200 p-6">
            <p className="m-0 mb-4 text-small text-ink-600">
              Esta assinatura foi cancelada. Você pode assinar um novo
              plano quando quiser.
            </p>
            <Link to={ROUTES.clube}>
              <Button variant="primary" size="sm">
                Ver planos do Clube
              </Button>
            </Link>
          </div>
        )}
      </div>

      {isPausada && !isCancelada && (
        <p className="mt-4 rounded-sm border border-warning/30 bg-warning-soft px-4 py-3 text-small text-warning">
          Sua assinatura está pausada. As cobranças e entregas ficam
          suspensas até você retomá-la.
        </p>
      )}
      {isAtiva && (
        <p className="mt-4 text-small text-ink-500">
          Sua assinatura está ativa e seguirá renovando automaticamente.
        </p>
      )}

      {/* Confirmação de cancelamento */}
      <ConfirmModal
        open={acaoPendente === 'cancelar'}
        title="Cancelar sua assinatura?"
        description="Você perderá os preços de Clube e os benefícios desta edição. É possível assinar de novo a qualquer momento."
        confirmLabel="Sim, cancelar"
        cancelLabel="Manter assinatura"
        isLoading={acaoEmAndamento}
        onConfirm={() =>
          executarAcao(
            () => assinaturaService.cancelar(assinatura.id),
            'Assinatura cancelada.',
          )
        }
        onCancel={() => setAcaoPendente(null)}
      />
    </AccountShell>
  )
}

/* ──────────────── Subcomponente ──────────────── */

function DetalheItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-pill bg-ink-50 text-ink-600">
        {icon}
      </span>
      <div>
        <div className="font-mono text-[0.66rem] uppercase tracking-[0.1em] text-ink-500">
          {label}
        </div>
        <div className="font-body text-[0.95rem] font-medium text-ink-900">
          {value}
        </div>
      </div>
    </div>
  )
}
