import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronRight } from 'lucide-react'
import { produtoService } from '@/services/produtoService'
import { useApi } from '@/hooks/useApi'
import { ROUTES } from '@/lib/constants'
import { getErrorMessage, getFieldErrors } from '@/lib/helpers'
import { AdminPageHead } from '@/layouts/AdminLayout'
import {
  Button,
  ErrorState,
  Input,
  Skeleton,
  Textarea,
  useToast,
} from '@/components'
import { AdminCard } from '@/components/admin/AdminUI'

/**
 * Validação do formulário de produto.
 * Espelha ProdutoCreateDTO: nome, descrição, preço e estoque
 * obrigatórios; estoque mínimo 1; imagem e descontoEspecial opcionais.
 */
const produtoSchema = z.object({
  nome: z.string().min(1, 'Informe o nome do produto'),
  descricao: z.string().min(1, 'Informe a descrição'),
  preco: z
    .number({ invalid_type_error: 'Informe um preço válido' })
    .positive('O preço deve ser maior que zero'),
  estoque: z
    .number({ invalid_type_error: 'Informe a quantidade' })
    .int('O estoque deve ser um número inteiro')
    .min(0, 'O estoque não pode ser negativo'),
  imagem: z.string().optional(),
  descontoEspecial: z
    .number({ invalid_type_error: 'Informe um valor numérico' })
    .min(0, 'O desconto não pode ser negativo')
    .optional(),
  statusClube: z.boolean(),
})

type ProdutoFormData = z.infer<typeof produtoSchema>

/**
 * Formulário de criar / editar produto.
 * O modo é determinado pela presença de :id na rota.
 *  - sem id  -> POST /produtos
 *  - com id  -> PATCH /produtos/{id}
 */
export function AdminProdutoFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdicao = id !== undefined
  const produtoId = Number(id)

  const toast = useToast()
  const navigate = useNavigate()

  // No modo edição, carrega o produto existente.
  const { data: produtoExistente, isLoading: carregando, error: erroCarga, refetch } =
    useApi(
      () =>
        isEdicao
          ? produtoService.buscar(produtoId)
          : Promise.resolve(null),
      [produtoId, isEdicao],
    )

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      preco: undefined,
      estoque: undefined,
      imagem: '',
      descontoEspecial: undefined,
      statusClube: false,
    },
  })

  // Preenche o formulário quando o produto carrega (edição).
  useEffect(() => {
    if (produtoExistente) {
      reset({
        nome: produtoExistente.nome,
        descricao: produtoExistente.descricao,
        preco: produtoExistente.preco,
        estoque: produtoExistente.estoque,
        imagem: '',
        descontoEspecial: undefined,
        statusClube: produtoExistente.statusClube,
      })
    }
  }, [produtoExistente, reset])

  async function onSubmit(data: ProdutoFormData) {
    try {
      if (isEdicao) {
        await produtoService.modificar(produtoId, {
          nome: data.nome,
          descricao: data.descricao,
          preco: data.preco,
          estoque: data.estoque,
          imagem: data.imagem || undefined,
          descontoEspecial: data.descontoEspecial,
          statusClube: data.statusClube,
        })
        toast.success('Produto atualizado')
      } else {
        await produtoService.criar({
          nome: data.nome,
          descricao: data.descricao,
          preco: data.preco,
          estoque: data.estoque,
          imagem: data.imagem || undefined,
          descontoEspecial: data.descontoEspecial,
          statusClube: data.statusClube,
        })
        toast.success('Produto criado')
      }
      navigate(ROUTES.adminProdutos)
    } catch (err) {
      // Mapeia erros de campo do backend, se houver.
      const fieldErrors = getFieldErrors(err)
      const keys = Object.keys(fieldErrors)
      if (keys.length > 0) {
        for (const key of keys) {
          if (
            key === 'nome' ||
            key === 'descricao' ||
            key === 'preco' ||
            key === 'estoque'
          ) {
            setError(key, { message: fieldErrors[key] })
          }
        }
      } else {
        toast.error('Não foi possível salvar', {
          description: getErrorMessage(err),
        })
      }
    }
  }

  // Estado de carregamento (edição)
  if (isEdicao && carregando) {
    return (
      <>
        <AdminPageHead title="Editar produto" />
        <AdminCard className="p-6">
          <div className="flex flex-col gap-5">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        </AdminCard>
      </>
    )
  }

  // Erro ao carregar (edição)
  if (isEdicao && erroCarga) {
    return (
      <>
        <AdminPageHead title="Editar produto" />
        <AdminCard>
          <ErrorState message={erroCarga} onRetry={refetch} />
        </AdminCard>
      </>
    )
  }

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-[0.78rem] text-ink-500">
        <Link to={ROUTES.adminProdutos} className="hover:text-ink-900">
          Produtos
        </Link>
        <ChevronRight className="h-3 w-3 text-ink-400" />
        <span className="text-ink-900">
          {isEdicao ? 'Editar' : 'Novo produto'}
        </span>
      </nav>

      <AdminPageHead
        title={isEdicao ? 'Editar produto' : 'Novo produto'}
        description={
          isEdicao
            ? 'Atualize as informações do produto.'
            : 'Cadastre um novo produto no catálogo.'
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AdminCard className="p-6">
          <div className="flex flex-col gap-5">
            <Input
              label="Nome do produto"
              placeholder="Ex.: Sérum noturno Lótus Renova"
              error={errors.nome?.message}
              {...register('nome')}
            />

            <Textarea
              label="Descrição"
              placeholder="Descreva o produto, seus ativos e benefícios"
              error={errors.descricao?.message}
              {...register('descricao')}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Preço (R$)"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                error={errors.preco?.message}
                {...register('preco', { valueAsNumber: true })}
              />
              <Input
                label="Estoque"
                type="number"
                min="0"
                placeholder="0"
                error={errors.estoque?.message}
                {...register('estoque', { valueAsNumber: true })}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Desconto especial (R$)"
                type="number"
                step="0.01"
                min="0"
                placeholder="Opcional"
                helper="Valor de desconto aplicável ao produto."
                error={errors.descontoEspecial?.message}
                {...register('descontoEspecial', {
                  setValueAs: (v) =>
                    v === '' || v === null ? undefined : Number(v),
                })}
              />
              <Input
                label="URL da imagem"
                placeholder="Opcional"
                helper="Endereço da imagem do produto."
                error={errors.imagem?.message}
                {...register('imagem')}
              />
            </div>

            {/* Toggle do Clube */}
            <Controller
              name="statusClube"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  role="switch"
                  aria-checked={field.value}
                  onClick={() => field.onChange(!field.value)}
                  className="flex items-center justify-between gap-3 rounded-sm border border-ink-200 bg-bg-soft p-4 text-left"
                >
                  <span className="flex flex-col">
                    <b className="text-[0.88rem] font-medium text-ink-900">
                      Produto do Clube
                    </b>
                    <span className="text-[0.78rem] text-ink-500">
                      Disponibiliza o produto com preço de assinante.
                    </span>
                  </span>
                  <span
                    className={`relative h-5 w-9 flex-shrink-0 rounded-pill transition-colors ${
                      field.value ? 'bg-wine-600' : 'bg-ink-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-e1 transition-all ${
                        field.value ? 'left-[18px]' : 'left-0.5'
                      }`}
                    />
                  </span>
                </button>
              )}
            />
          </div>
        </AdminCard>

        {/* Ações */}
        <div className="mt-5 flex items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            loadingText="Salvando…"
          >
            {isEdicao ? 'Salvar alterações' : 'Criar produto'}
          </Button>
          <Link to={ROUTES.adminProdutos}>
            <Button type="button" variant="secondary">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </>
  )
}
