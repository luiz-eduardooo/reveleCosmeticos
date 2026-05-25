import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, ShieldAlert, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { userService } from '@/services/userService'
import { STORAGE_KEYS } from '@/lib/constants'
import { getErrorMessage, storage } from '@/lib/helpers'
import {
  AccountShell,
  AccountHead,
} from '@/components/AccountSidebar'
import {
  Avatar,
  Badge,
  Button,
  ConfirmModal,
  Input,
  useToast,
} from '@/components'

/** Validação do formulário de perfil (espelha UserUpdateDTO). */
const perfilSchema = z.object({
  name: z
    .string()
    .min(1, 'Informe seu nome')
    .min(3, 'Nome muito curto')
    .max(120, 'Nome muito longo'),
  email: z
    .string()
    .min(1, 'Informe seu e-mail')
    .email('E-mail inválido'),
})

type PerfilFormData = z.infer<typeof perfilSchema>

/**
 * Página de perfil.
 * Edita nome e e-mail via PUT /usuarios/{id} e permite excluir a
 * conta (DELETE /usuarios/{id}) com confirmação.
 */
export function PerfilPage() {
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    values: {
      name: user?.name ?? '',
      email: user?.email ?? '',
    },
  })

  if (!user) return null

  async function onSubmit(data: PerfilFormData) {
    if (!user) return
    try {
      const atualizado = await userService.atualizar(user.id, {
        name: data.name.trim(),
        email: data.email.trim(),
      })
      // Sincroniza o usuário em cache (o AuthContext lê deste storage).
      storage.set(STORAGE_KEYS.user, atualizado)
      reset({ name: atualizado.name, email: atualizado.email })
      toast.success('Perfil atualizado', {
        description: 'Suas informações foram salvas.',
      })
    } catch (err) {
      toast.error('Não foi possível salvar', {
        description: getErrorMessage(err),
      })
    }
  }

  async function excluirConta() {
    if (!user) return
    setExcluindo(true)
    try {
      await userService.deletar(user.id)
      toast.success('Conta excluída')
      logout()
      navigate('/', { replace: true })
    } catch (err) {
      toast.error('Não foi possível excluir a conta', {
        description: getErrorMessage(err),
      })
      setExcluindo(false)
      setConfirmandoExclusao(false)
    }
  }

  return (
    <AccountShell>
      <AccountHead
        eyebrow="Conta"
        title="Meu perfil"
        description="Gerencie suas informações pessoais e as configurações da conta."
      />

      {/* Identidade */}
      <div className="mb-5 flex items-center gap-4 rounded-md border border-ink-200 bg-white p-6">
        <Avatar name={user.name} size="lg" gradient />
        <div>
          <div className="font-display text-h4 font-medium text-ink-900">
            {user.name}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-small text-ink-500">{user.email}</span>
            {user.role === 'ADMIN' && (
              <Badge variant="soft-wine">Admin</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Formulário de edição */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="rounded-md border border-ink-200 bg-white p-6"
      >
        <h2 className="mb-5 font-display text-h4 font-medium text-ink-900">
          Informações pessoais
        </h2>

        <div className="flex flex-col gap-5">
          <Input
            label="Nome completo"
            leftIcon={<User className="h-4 w-4" />}
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="E-mail"
            type="email"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            loadingText="Salvando…"
            disabled={!isDirty}
          >
            Salvar alterações
          </Button>
          {isDirty && (
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                reset({ name: user.name, email: user.email })
              }
            >
              Descartar
            </Button>
          )}
        </div>
      </form>

      {/* Zona de risco */}
      <div className="mt-5 rounded-md border border-danger/30 bg-danger-soft/40 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-pill bg-danger-soft text-danger">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-h4 font-medium text-ink-900">
              Excluir conta
            </h3>
            <p className="m-0 mt-1 max-w-[52ch] text-small text-ink-600">
              Esta ação é permanente. Todos os seus dados serão removidos
              e não poderão ser recuperados.
            </p>
            <Button
              variant="danger"
              size="sm"
              className="mt-4"
              onClick={() => setConfirmandoExclusao(true)}
            >
              Excluir minha conta
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmação de exclusão */}
      <ConfirmModal
        open={confirmandoExclusao}
        title="Excluir sua conta?"
        description="Esta ação não pode ser desfeita. Sua conta, seus pedidos e suas informações serão removidos permanentemente."
        confirmLabel="Sim, excluir conta"
        cancelLabel="Manter conta"
        isLoading={excluindo}
        onConfirm={excluirConta}
        onCancel={() => setConfirmandoExclusao(false)}
      />
    </AccountShell>
  )
}
