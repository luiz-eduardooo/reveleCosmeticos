/**
 * Tipos TypeScript espelhando os DTOs da especificação OpenAPI (api-spec.json).
 * Fonte de verdade: a spec. Não inventar campos que não existem no contrato.
 */

/* ──────────────── Enums ──────────────── */

export type Role = 'USER' | 'ADMIN'

export type IntervaloCobranca = 'MENSAL' | 'TRIMESTRAL' | 'ANUAL'

export type StatusAssinatura = 'ATIVA' | 'CANCELADA' | 'PAUSADA'

/* ──────────────── Usuário ──────────────── */

export interface UserResponseDTO {
  id: string // uuid
  name: string
  email: string
  role: Role
}

export interface UserLoginDTO {
  email: string
  password: string
}

export interface UserCadastroDTO {
  name: string
  email: string
  cpf: string
  password: string
}

export interface UserUpdateDTO {
  name?: string
  email?: string
}

export interface LoginResponseDTO {
  token: string
  usuario: UserResponseDTO
}

/* ──────────────── Produto ──────────────── */

/** Resposta da API — apenas estes campos voltam de /produtos. */
export interface ProdutoResponseDTO {
  id: number // int64
  nome: string
  descricao: string
  preco: number
  estoque: number // int32
  statusClube: boolean
}

/** Payload de criação — inclui campos que NÃO voltam na resposta. */
export interface ProdutoCreateDTO {
  nome: string
  descricao: string
  preco: number
  estoque: number
  imagem?: string
  descontoEspecial?: number
  statusClube?: boolean
}

/** Payload de atualização parcial (PATCH) — todos opcionais. */
export interface ProdutoUpdateDTO {
  nome?: string
  descricao?: string
  preco?: number
  imagem?: string
  estoque?: number
  descontoEspecial?: number
  statusClube?: boolean
}

/* ──────────────── Pedido ──────────────── */

export interface ItemPedidoDTO {
  produtoId: number
  quantidade: number
}

export interface PedidoDTO {
  itens: ItemPedidoDTO[]
}

export interface ItemPedidoResponseDTO {
  produtoId: number
  nomeProduto: string
  quantidade: number
  precoUnitario: number
  subtotal: number
}

export interface PedidoResponseDTO {
  id: string // uuid
  nomeUsuario: string
  itens: ItemPedidoResponseDTO[]
  valorTotal: number
  dataPedido: string // date-time ISO
}

/* ──────────────── Plano ──────────────── */

export interface PlanoDTO {
  nome: string
  descricao: string
  preco: number
  intervaloCobranca: IntervaloCobranca
}

export interface PlanoResponseDTO {
  id: string // uuid
  nome: string
  descricao: string
  preco: number
  intervaloCobranca: IntervaloCobranca
}

/* ──────────────── Assinatura ──────────────── */

export interface AssinaturaDTO {
  planoID: string // uuid
}

export interface AssinaturaResponseDTO {
  id: string // uuid
  nomeUsuario: string
  nomePlano: string
  precoPlano: number
  dataInicio: string // date-time ISO
  dataFinal: string // date-time ISO
  status: StatusAssinatura
}

/* ──────────────── Paginação (Spring Pageable) ──────────────── */

export interface PageableParams {
  page: number
  size: number
  sort?: string[]
}

export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
  numberOfElements: number
  first: boolean
  last: boolean
  empty: boolean
}

export type PagePedidoResponseDTO = Page<PedidoResponseDTO>

/* ──────────────── Erro ──────────────── */

/**
 * Formato estruturado de erro do backend (ErroResponse).
 * A spec não detalha o schema; tipamos de forma defensiva conforme
 * descrito no briefing: status, mensagem, e campos/IDs opcionais.
 */
export interface ErroResponse {
  status: number
  mensagem: string
  campos?: Record<string, string>
  ids?: string[]
  timestamp?: string
  path?: string
}
