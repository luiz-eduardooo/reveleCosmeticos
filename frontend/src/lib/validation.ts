import { z } from 'zod'

/**
 * Schemas de validação dos formulários de autenticação.
 * As regras espelham as restrições dos DTOs em api-spec.json:
 *  - UserLoginDTO: email e password obrigatórios (minLength 1)
 *  - UserCadastroDTO: name, email, cpf obrigatórios; password 6–100
 */

/* ──────────────── Login ──────────────── */

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Informe seu e-mail')
    .email('E-mail inválido'),
  password: z.string().min(1, 'Informe sua senha'),
})

export type LoginFormData = z.infer<typeof loginSchema>

/* ──────────────── Cadastro ──────────────── */

/** Normaliza CPF removendo tudo que não for dígito. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/** Aplica a máscara visual 000.000.000-00 ao CPF. */
export function maskCpf(value: string): string {
  const digits = onlyDigits(value).slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

/**
 * Validação completa de CPF (dígitos verificadores).
 * Evita aceitar sequências inválidas como "111.111.111-11".
 */
export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value)
  if (cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i)
  let check = (sum * 10) % 11
  if (check === 10) check = 0
  if (check !== Number(cpf[9])) return false

  sum = 0
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i)
  check = (sum * 10) % 11
  if (check === 10) check = 0
  return check === Number(cpf[10])
}

export const cadastroSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Informe seu nome completo')
      .min(3, 'Nome muito curto')
      .max(120, 'Nome muito longo'),
    email: z
      .string()
      .min(1, 'Informe seu e-mail')
      .email('E-mail inválido'),
    cpf: z
      .string()
      .min(1, 'Informe seu CPF')
      .refine((v) => onlyDigits(v).length === 11, 'CPF incompleto')
      .refine(isValidCpf, 'CPF inválido'),
    password: z
      .string()
      .min(1, 'Crie uma senha')
      .min(6, 'A senha precisa ter ao menos 6 caracteres')
      .max(100, 'A senha pode ter no máximo 100 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
    aceitaTermos: z
      .boolean()
      .refine((v) => v, 'É preciso aceitar os termos para continuar'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export type CadastroFormData = z.infer<typeof cadastroSchema>
