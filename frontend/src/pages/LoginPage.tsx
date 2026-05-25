import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/lib/constants'
import { getErrorMessage } from '@/lib/helpers'
import { loginSchema, type LoginFormData } from '@/lib/validation'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Button, Input, useToast } from '@/components'

/**
 * Tela de login.
 * Após autenticar, redireciona para o destino original (?redirect=)
 * ou, na ausência dele, conforme o papel do usuário.
 */
export function LoginPage() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  /** Erro geral da API (credenciais inválidas, etc.). */
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    setApiError(null)
    try {
      const usuario = await login(data)
      toast.success(`Bem-vinda de volta, ${usuario.name.split(' ')[0]}!`)

      // Destino: ?redirect= tem prioridade; senão, por papel.
      const redirect = searchParams.get('redirect')
      if (redirect) {
        navigate(decodeURIComponent(redirect), { replace: true })
      } else {
        navigate(usuario.role === 'ADMIN' ? ROUTES.admin : ROUTES.home, {
          replace: true,
        })
      }
    } catch (err) {
      setApiError(getErrorMessage(err))
    }
  }

  return (
    <AuthLayout
      badge="Clube Revele · Bem-vinda de volta"
      quote="Bom ter você de volta. O cuidado que você começou ainda está aqui."
    >
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[2.5rem] font-normal leading-none text-ink-900">
          Entrar
        </h1>
        <p className="m-0 text-ink-600">
          Acesse seus pedidos, sua assinatura e os preços de Clube de todo o
          catálogo.
        </p>
      </div>

      {/* Erro geral da API */}
      {apiError && (
        <div className="mt-6 flex items-start gap-2.5 rounded-sm border border-danger/30 bg-danger-soft px-4 py-3 text-small text-danger">
          <AlertCircle className="mt-px h-4 w-4 flex-shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-6 flex flex-col gap-5"
      >
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          placeholder="Sua senha"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          loadingText="Entrando…"
        >
          Entrar
        </Button>
      </form>

      <p className="mt-7 text-center text-small text-ink-600">
        Ainda não tem conta?{' '}
        <Link
          to={ROUTES.cadastro}
          className="font-medium text-wine-700 hover:text-wine-800"
        >
          Crie a sua →
        </Link>
      </p>
    </AuthLayout>
  )
}
