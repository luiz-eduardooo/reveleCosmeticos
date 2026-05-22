import { Link } from 'react-router-dom'
import {
  Leaf,
  PackageCheck,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react'
import { produtoService } from '@/services/produtoService'
import { useApi } from '@/hooks/useApi'
import { ROUTES } from '@/lib/constants'
import {
  Avatar,
  Button,
  ErrorState,
  ProductCardSkeleton,
} from '@/components'
import { ProductCard } from '@/components/ProductCard'
import { BottlePlaceholder } from '@/components/BottlePlaceholder'

/**
 * Página inicial.
 * O hero, benefícios, teaser do Clube e depoimentos são conteúdo
 * editorial estático; a seção de destaques consome /produtos e
 * exibe os primeiros itens reais do catálogo.
 */
export function HomePage() {
  const { data, isLoading, error, refetch } = useApi(
    () => produtoService.listar(),
    [],
  )

  const destaques = (data ?? []).slice(0, 4)

  return (
    <>
      {/* ───── Hero ───── */}
      <section className="border-b border-ink-200 bg-gradient-to-b from-bg-soft to-white">
        <div className="mx-auto max-w-container px-5 py-11 sm:px-8 sm:py-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-11">
            <div>
              <span className="eyebrow text-wine-600">
                <span className="font-mono text-wine-600">Coleção</span>
                Outono · 2026
              </span>
              <h1 className="my-5 font-display text-[3.5rem] font-light leading-[0.98] tracking-[-0.015em] text-ink-900 sm:text-[5rem]">
                O cuidado
                <br />é um{' '}
                <em className="font-normal not-italic text-wine-700">
                  ritual.
                </em>
              </h1>
              <p className="mb-7 max-w-[46ch] text-[1.1rem] leading-relaxed text-ink-600">
                Cosméticos curados com a mesma atenção que você dedica a si
                mesma — fórmulas honestas, fragrâncias discretas e um Clube
                que devolve tempo à sua rotina.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={ROUTES.clube}>
                  <Button variant="primary" size="lg">
                    Conheça o Clube
                  </Button>
                </Link>
                <Link to={ROUTES.produtos}>
                  <Button variant="secondary" size="lg">
                    Ver todos os produtos
                  </Button>
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-ink-200 pt-7">
                <Stat value="142" label="Fórmulas curadas" />
                <Stat value="4.8/5" label="4 318 avaliações" />
                <Stat value="12 mil" label="Assinantes ativas" />
              </div>
            </div>

            {/* Arte do hero */}
            <div className="relative aspect-[5/6] overflow-hidden rounded-md bg-gradient-to-b from-wine-50 to-ink-50">
              <div className="absolute right-6 top-6 rounded-xs bg-white/70 px-3 py-2 font-mono text-[0.7rem] uppercase tracking-eyebrow text-ink-700 backdrop-blur">
                Edição Outono
              </div>
              <div
                className="absolute left-1/2 top-1/2 aspect-square w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-wine-600/30"
                aria-hidden
              >
                <div className="absolute inset-[18px] rounded-full border border-dashed border-wine-600/25" />
              </div>
              <div className="absolute left-1/2 top-1/2 w-[34%] -translate-x-1/2 -translate-y-1/2">
                <BottlePlaceholder variant={0} className="w-full" />
              </div>
              <div className="absolute bottom-6 left-6 rounded-xs bg-white/70 px-3 py-2 font-mono text-[0.7rem] tracking-[0.05em] text-wine-800 backdrop-blur">
                Sérum noturno · 30 ml
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Categorias ───── */}
      <section className="mx-auto max-w-container px-5 py-12 sm:px-8">
        <SectionHead
          eyebrow="Navegue"
          title="Coleções para cada tempo do dia."
          description="Quatro famílias que compõem nossa curadoria — escolha por categoria ou por momento."
          action={
            <Link to={ROUTES.produtos}>
              <Button variant="ghost">Ver tudo →</Button>
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {[
            { num: '01', name: 'Skincare', from: 'from-wine-200', to: 'to-wine-600' },
            { num: '02', name: 'Cabelo', from: 'from-ink-300', to: 'to-ink-700' },
            { num: '03', name: 'Corpo', from: 'from-[#E8DDC9]', to: 'to-[#6A4A2A]' },
            { num: '04', name: 'Fragrâncias', from: 'from-wine-100', to: 'to-ink-900' },
          ].map((cat) => (
            <Link
              key={cat.num}
              to={ROUTES.produtos}
              className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-md p-6 text-white focus-ring"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.from} ${cat.to}`}
                aria-hidden
              />
              <div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-900/70"
                aria-hidden
              />
              <span className="relative z-10 font-mono text-[0.72rem] tracking-[0.06em] text-white/70">
                {cat.num}
              </span>
              <span className="relative z-10 mt-1 font-display text-h4 leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ───── Destaques (API) ───── */}
      <section className="bg-bg-soft">
        <div className="mx-auto max-w-container px-5 py-12 sm:px-8">
          <SectionHead
            eyebrow="Em destaque"
            title="O que estamos amando esta semana."
            description="Uma seleção do nosso catálogo — os primeiros lançamentos da coleção."
            action={
              <Link to={ROUTES.produtos}>
                <Button variant="ghost">Ver catálogo →</Button>
              </Link>
            }
          />

          {isLoading && (
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {error && !isLoading && (
            <ErrorState message={error} onRetry={refetch} />
          )}

          {!isLoading && !error && destaques.length > 0 && (
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {destaques.map((produto) => (
                <ProductCard key={produto.id} produto={produto} />
              ))}
            </div>
          )}

          {!isLoading && !error && destaques.length === 0 && (
            <p className="py-10 text-center text-ink-500">
              Nenhum produto disponível no momento.
            </p>
          )}
        </div>
      </section>

      {/* ───── Teaser do Clube ───── */}
      <section className="mx-auto max-w-container px-5 py-12 sm:px-8">
        <div className="relative overflow-hidden rounded-lg bg-ink-900 p-8 text-white sm:p-11">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="eyebrow text-wine-300">Clube Revele</span>
              <h2 className="my-5 max-w-[14ch] font-display text-[2.5rem] font-light leading-[1.05] text-white sm:text-[3.25rem]">
                Sua rotina,{' '}
                <em className="italic text-wine-300">sem interrupções.</em>
              </h2>
              <p className="mb-7 max-w-[42ch] leading-relaxed text-ink-300">
                Receba seus essenciais todos os meses com preço de
                assinante, curadoria e brindes selecionados.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to={ROUTES.clube}>
                  <Button
                    variant="primary"
                    className="border-white bg-white text-ink-900 hover:border-ink-200 hover:bg-ink-200 hover:text-ink-900"
                  >
                    Quero ser do Clube
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              {[
                {
                  num: '01',
                  title: 'Preço de assinante',
                  desc: 'Até 25% de desconto em produtos selecionados.',
                },
                {
                  num: '02',
                  title: 'Curadoria mensal',
                  desc: 'Uma seleção pensada para o seu momento.',
                },
                {
                  num: '03',
                  title: 'Brindes exclusivos',
                  desc: 'Edições especiais que não vão à loja.',
                },
              ].map((perk, i) => (
                <div
                  key={perk.num}
                  className={`grid grid-cols-[auto_1fr] gap-4 py-5 ${
                    i > 0 ? 'border-t border-white/10' : ''
                  }`}
                >
                  <span className="pt-0.5 font-mono text-[0.72rem] tracking-[0.05em] text-wine-300">
                    {perk.num}
                  </span>
                  <div>
                    <b className="mb-1 block font-body font-medium text-white">
                      {perk.title}
                    </b>
                    <p className="m-0 text-[0.88rem] text-ink-300">
                      {perk.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── Benefícios ───── */}
      <section className="mx-auto max-w-container px-5 py-12 sm:px-8">
        <div className="grid gap-7 sm:grid-cols-3">
          <Benefit
            icon={<Leaf className="h-5 w-5" />}
            title="Fórmulas honestas"
            description="Ativos vegetais e ingredientes que você consegue ler e entender."
          />
          <Benefit
            icon={<Truck className="h-5 w-5" />}
            title="Envio cuidado"
            description="Embalagem reaproveitável, lacrada e revisada por nós antes de sair."
          />
          <Benefit
            icon={<PackageCheck className="h-5 w-5" />}
            title="Curadoria sensorial"
            description="Cada item passa por avaliação antes de entrar no catálogo."
          />
        </div>
      </section>

      {/* ───── Depoimentos ───── */}
      <section className="bg-bg-soft">
        <div className="mx-auto max-w-container px-5 py-12 sm:px-8">
          <SectionHead
            eyebrow="Quem usa, conta"
            title="Histórias de quem fez do cuidado um hábito."
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                quote:
                  'A textura do sérum é absurda. Virou item fixo da minha rotina noturna.',
                name: 'Aline R.',
                meta: 'Curitiba · 3 pedidos',
              },
              {
                quote:
                  'O Clube vale cada centavo. Já economizei o equivalente a quatro meses.',
                name: 'Juliana S.',
                meta: 'Recife · Clube há 9 meses',
              },
              {
                quote:
                  'Atendimento sem pressa e sem script. Me ajudaram a montar uma rotina real.',
                name: 'Marina T.',
                meta: 'São Paulo · 7 pedidos',
              },
            ].map((t) => (
              <div
                key={t.name}
                className="flex flex-col gap-4 rounded-md border border-ink-200 bg-white p-7"
              >
                <div className="flex gap-0.5 text-wine-600">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="m-0 font-display text-[1.15rem] italic leading-snug text-ink-800">
                  “{t.quote}”
                </p>
                <div className="mt-3 flex items-center gap-3 border-t border-ink-200 pt-4">
                  <Avatar name={t.name} size="sm" />
                  <div>
                    <div className="text-[0.9rem] font-medium text-ink-900">
                      {t.name}
                    </div>
                    <div className="text-[0.74rem] text-ink-500">
                      {t.meta}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA final ───── */}
      <section className="mx-auto max-w-container px-5 py-12 sm:px-8">
        <div className="flex flex-col items-center gap-5 rounded-lg border border-wine-100 bg-gradient-to-b from-wine-50 to-white px-6 py-13 text-center">
          <span className="eyebrow text-wine-600">
            <Sparkles className="h-3 w-3" />
            Comece agora
          </span>
          <h2 className="max-w-[18ch] font-display text-h2 font-normal leading-tight text-ink-900">
            Dê à sua pele o cuidado que ela merece.
          </h2>
          <Link to={ROUTES.produtos}>
            <Button variant="primary" size="lg">
              Explorar o catálogo
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}

/* ──────────────── Subcomponentes ──────────────── */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <b className="block font-display text-[2.25rem] font-normal leading-none text-ink-900">
        {value}
      </b>
      <span className="mt-1.5 block text-[0.78rem] tracking-[0.04em] text-ink-500">
        {label}
      </span>
    </div>
  )
}

function SectionHead({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-[560px]">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="my-3 font-display text-[2.25rem] font-normal leading-tight tracking-[-0.005em] text-ink-900">
          {title}
        </h2>
        {description && (
          <p className="m-0 max-w-[50ch] text-ink-600">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

function Benefit({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-3 py-5">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-pill bg-wine-50 text-wine-700">
        {icon}
      </div>
      <h4 className="font-display text-h4 font-medium text-ink-900">
        {title}
      </h4>
      <p className="m-0 max-w-[36ch] text-[0.95rem] leading-relaxed text-ink-600">
        {description}
      </p>
    </div>
  )
}
