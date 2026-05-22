import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Gift, Sparkles, Tag } from 'lucide-react'
import { planoService } from '@/services/planoService'
import { assinaturaService } from '@/services/assinaturaService'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES, INTERVALO_LABEL } from '@/lib/constants'
import { formatCurrency, getErrorMessage } from '@/lib/helpers'
import {
  Button,
  ConfirmModal,
  EmptyState,
  ErrorState,
  Skeleton,
  useToast,
} from '@/components'
import type { PlanoResponseDTO } from '@/types'

/**
 * Página do Clube Revele.
 * Lista os planos via GET /planos/ e permite assinar (POST /assinaturas/).
 * Visitantes são levados ao login antes de assinar.
 */
export function ClubePage() {
  const { data, isLoading, error, refetch } = useApi(
    () => planoService.listar(),
    [],
  )
  const { isAuthenticated } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [planoSelecionado, setPlanoSelecionado] =
    useState<PlanoResponseDTO | null>(null)
  const [assinando, setAssinando] = useState(false)

  const planos = data ?? []

  function iniciarAssinatura(plano: PlanoResponseDTO) {
    if (!isAuthenticated) {
      navigate(
        `${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.clube)}`,
      )
      return
    }
    setPlanoSelecionado(plano)
  }

  async function confirmarAssinatura() {
    if (!planoSelecionado) return
    setAssinando(true)
    try {
      await assinaturaService.assinar({ planoID: planoSelecionado.id })
      toast.success('Bem-vinda ao Clube Revele!', {
        description: `Plano ${planoSelecionado.nome} ativado.`,
      })
      setPlanoSelecionado(null)
      navigate(ROUTES.assinatura)
    } catch (err) {
      toast.error('Não foi possível assinar', {
        description: getErrorMessage(err),
      })
    } finally {
      setAssinando(false)
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ink-200 bg-ink-900 text-white">
        <div className="mx-auto max-w-container px-5 py-13 sm:px-8">
          <span className="eyebrow text-wine-300">
            <Sparkles className="h-3 w-3" />
            Clube Revele
          </span>
          <h1 className="my-5 max-w-[16ch] font-display text-[2.75rem] font-light leading-[1.05] sm:text-[4rem]">
            O cuidado que{' '}
            <em className="italic text-wine-300">chega até você.</em>
          </h1>
          <p className="m-0 max-w-[52ch] text-[1.05rem] leading-relaxed text-ink-300">
            Uma assinatura pensada para quem fez do cuidado um hábito.
            Preço de assinante, curadoria mensal e brindes que não vão à
            loja.
          </p>
        </div>
      </section>

      {/* Benefícios */}
      <section className="mx-auto max-w-container px-5 py-12 sm:px-8">
        <div className="grid gap-7 sm:grid-cols-3">
          <Perk
            icon={<Tag className="h-5 w-5" />}
            title="Preço de assinante"
            description="Até 25% de desconto em produtos selecionados, todo mês."
          />
          <Perk
            icon={<Gift className="h-5 w-5" />}
            title="Brindes exclusivos"
            description="Edições especiais e amostras que não vão ao catálogo."
          />
          <Perk
            icon={<Sparkles className="h-5 w-5" />}
            title="Curadoria mensal"
            description="Uma seleção pensada para o seu momento e sua rotina."
          />
        </div>
      </section>

      {/* Planos */}
      <section className="bg-bg-soft">
        <div className="mx-auto max-w-container px-5 py-12 sm:px-8">
          <div className="mb-8 text-center">
            <span className="eyebrow justify-center text-wine-600">
              Planos
            </span>
            <h2 className="mt-3 font-display text-h2 font-normal text-ink-900">
              Escolha o seu ritmo.
            </h2>
          </div>

          {/* Estado: loading */}
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-4 rounded-md border border-ink-200 bg-white p-7"
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-11 w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Estado: erro */}
          {error && !isLoading && (
            <ErrorState message={error} onRetry={refetch} />
          )}

          {/* Estado: sucesso */}
          {!isLoading && !error && planos.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {planos.map((plano, index) => (
                <PlanoCard
                  key={plano.id}
                  plano={plano}
                  destaque={index === 1}
                  onAssinar={() => iniciarAssinatura(plano)}
                />
              ))}
            </div>
          )}

          {/* Estado: vazio */}
          {!isLoading && !error && planos.length === 0 && (
            <EmptyState
              icon={<Sparkles className="h-6 w-6" />}
              title="Nenhum plano disponível"
              description="Os planos do Clube ainda não foram cadastrados. Volte em breve."
            />
          )}
        </div>
      </section>

      {/* Modal de confirmação */}
      <ConfirmModal
        open={planoSelecionado !== null}
        title="Confirmar assinatura"
        description={
          planoSelecionado
            ? `Você vai assinar o plano ${planoSelecionado.nome} por ${formatCurrency(
                planoSelecionado.preco,
              )} (${INTERVALO_LABEL[planoSelecionado.intervaloCobranca]}). Pode cancelar quando quiser.`
            : ''
        }
        confirmLabel="Confirmar assinatura"
        cancelLabel="Voltar"
        destructive={false}
        isLoading={assinando}
        onConfirm={confirmarAssinatura}
        onCancel={() => setPlanoSelecionado(null)}
      />
    </>
  )
}

/* ──────────────── Subcomponentes ──────────────── */

function Perk({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-pill bg-wine-50 text-wine-700">
        {icon}
      </div>
      <h4 className="font-display text-h4 font-medium text-ink-900">
        {title}
      </h4>
      <p className="m-0 text-[0.95rem] leading-relaxed text-ink-600">
        {description}
      </p>
    </div>
  )
}

function PlanoCard({
  plano,
  destaque,
  onAssinar,
}: {
  plano: PlanoResponseDTO
  destaque: boolean
  onAssinar: () => void
}) {
  return (
    <div
      className={`relative flex flex-col rounded-md border p-7 ${
        destaque
          ? 'border-wine-600 bg-white shadow-e2'
          : 'border-ink-200 bg-white'
      }`}
    >
      {destaque && (
        <span className="absolute -top-3 left-7 rounded-xs bg-wine-600 px-2.5 py-1 text-[0.66rem] font-medium uppercase tracking-wide2 text-white">
          Mais escolhido
        </span>
      )}

      <span className="font-body text-[0.72rem] uppercase tracking-eyebrow text-wine-600">
        {INTERVALO_LABEL[plano.intervaloCobranca]}
      </span>
      <h3 className="mt-2 font-display text-h3 font-medium text-ink-900">
        {plano.nome}
      </h3>

      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="font-display text-[2.5rem] font-medium leading-none text-ink-900">
          {formatCurrency(plano.preco)}
        </span>
      </div>

      <p className="mt-4 flex-1 text-[0.92rem] leading-relaxed text-ink-600">
        {plano.descricao}
      </p>

      <ul className="my-5 flex list-none flex-col gap-2 p-0">
        {[
          'Preço de assinante no catálogo',
          'Curadoria mensal personalizada',
          'Brindes exclusivos do Clube',
        ].map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 text-[0.88rem] text-ink-700"
          >
            <Check className="h-4 w-4 flex-shrink-0 text-wine-600" />
            {item}
          </li>
        ))}
      </ul>

      <Button
        variant={destaque ? 'primary' : 'secondary'}
        fullWidth
        onClick={onAssinar}
      >
        Assinar {plano.nome}
      </Button>
    </div>
  )
}
