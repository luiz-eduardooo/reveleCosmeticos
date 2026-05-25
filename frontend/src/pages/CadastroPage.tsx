import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Check, Mail, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES } from '@/lib/constants'
import { getErrorMessage, getFieldErrors } from '@/lib/helpers'
import {
  cadastroSchema,
  maskCpf,
  onlyDigits,
  type CadastroFormData,
} from '@/lib/validation'
import { AuthLayout } from '@/layouts/AuthLayout'
import { Button, Input, useToast } from '@/components'

/**
 * Tela de cadastro.
 *
 * A API (POST /usuarios/cadastrar) cria o usuário mas não devolve
 * token. O fluxo: cadastrar -> autenticar automaticamente com as
 * credenciais informadas -> ir para a Home.
 */
export function CadastroPage() {
  const { register: registrar, login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: { aceitaTermos: false },
  })

  async function onSubmit(data: CadastroFormData) {
    setApiError(null)
    try {
      // 1. Cria a conta — envia o CPF apenas com dígitos.
      await registrar({
        name: data.name.trim(),
        email: data.email.trim(),
        cpf: onlyDigits(data.cpf),
        password: data.password,
      })

      // 2. Autentica automaticamente com as credenciais recém-criadas.
      try {
        const usuario = await login({
          email: data.email.trim(),
          password: data.password,
        })
        toast.success(`Conta criada. Bem-vinda, ${usuario.name.split(' ')[0]}!`)
        navigate(ROUTES.home, { replace: true })
      } catch {
        // Conta criada, mas o login automático falhou: leva ao login.
        toast.success('Conta criada com sucesso', {
          description: 'Faça login para continuar.',
        })
        navigate(ROUTES.login, { replace: true })
      }
    } catch (err) {
      // Mapeia erros de campo do backend para o formulário, se houver.
      const fieldErrors = getFieldErrors(err)
      const fieldKeys = Object.keys(fieldErrors)
      if (fieldKeys.length > 0) {
        for (const key of fieldKeys) {
          if (
            key === 'name' ||
            key === 'email' ||
            key === 'cpf' ||
            key === 'password'
          ) {
            setError(key, { message: fieldErrors[key] })
          }
        }
      } else {
        setApiError(getErrorMessage(err))
      }
    }
  }

  return (
    <AuthLayout
      badge="Clube Revele · Crie sua conta"
      quote="Cada rotina começa com um primeiro gesto de cuidado. Comece o seu."
    >
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[2.5rem] font-normal leading-none text-ink-900">
          Criar conta
        </h1>
        <p className="m-0 text-ink-600">
          Leva menos de um minuto. Depois é só aproveitar a curadoria.
        </p>
      </div>

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
          label="Nome completo"
          autoComplete="name"
          placeholder="Como você gosta de ser chamada"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        {/* CPF com máscara — Controller pra controlar o valor formatado */}
        <Controller
          name="cpf"
          control={control}
          render={({ field }) => (
            <Input
              label="CPF"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={field.value ?? ''}
              onChange={(e) => field.onChange(maskCpf(e.target.value))}
              onBlur={field.onBlur}
              error={errors.cpf?.message}
            />
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Senha"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            error={errors.password?.message}
            {...register('password')}
          />
          <Input
            label="Confirmar senha"
            type="password"
            autoComplete="new-password"
            placeholder="Repita a senha"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        {/* Aceite de termos */}
        <Controller
          name="aceitaTermos"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5">
              <label className="flex cursor-pointer items-start gap-3">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={field.value}
                  onClick={() => field.onChange(!field.value)}
                  className={`mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-xs border transition-colors ${
                    field.value
                      ? 'border-wine-600 bg-wine-600 text-white'
                      : 'border-ink-300 bg-white'
                  }`}
                >
                  {field.value && <Check className="h-3 w-3" />}
                </button>
                <span className="text-small text-ink-600">
                  Li e aceito os{' '}
                  <a href="#" className="text-wine-700 hover:underline">
                    Termos de Uso
                  </a>{' '}
                  e a{' '}
                  <a href="#" className="text-wine-700 hover:underline">
                    Política de Privacidade
                  </a>
                  .
                </span>
              </label>
              {errors.aceitaTermos && (
                <span className="flex items-center gap-1 pl-[30px] text-micro text-danger">
                  <AlertCircle className="h-3 w-3 flex-shrink-0" />
                  {errors.aceitaTermos.message}
                </span>
              )}
            </div>
          )}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
          loadingText="Criando conta…"
        >
          Criar minha conta
        </Button>
      </form>

      <p className="mt-7 text-center text-small text-ink-600">
        Já tem conta?{' '}
        <Link
          to={ROUTES.login}
          className="font-medium text-wine-700 hover:text-wine-800"
        >
          Entrar →
        </Link>
      </p>
    </AuthLayout>
  )
}
