

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export const STORAGE_KEYS = {
  token: 'revele.token',
  user: 'revele.user',
  cart: 'revele.cart',
} as const

export const ROUTES = {
  home: '/',
  produtos: '/produtos',
  produtoDetalhe: (id: number | string = ':id') => `/produtos/${id}`,
  clube: '/clube',
  login: '/login',
  cadastro: '/cadastro',
  carrinho: '/carrinho',
  checkout: '/checkout',
  pedidos: '/pedidos',
  pedidoDetalhe: (id: string = ':id') => `/pedidos/${id}`,
  assinatura: '/assinatura',
  perfil: '/perfil',
  admin: '/admin',
  adminProdutos: '/admin/produtos',
  adminProdutoNovo: '/admin/produtos/novo',
  adminProdutoEditar: (id: number | string = ':id') =>
    `/admin/produtos/${id}/editar`,
  adminPedidos: '/admin/pedidos',
  adminUsuarios: '/admin/usuarios',
  adminAssinaturas: '/admin/assinaturas',
  forbidden: '/403',
  notFound: '/404',
} as const
export const INTERVALO_LABEL: Record<string, string> = {
  MENSAL: 'Mensal',
  TRIMESTRAL: 'Trimestral',
  ANUAL: 'Anual',
}

export const STATUS_ASSINATURA_LABEL: Record<string, string> = {
  ATIVA: 'Ativa',
  PAUSADA: 'Pausada',
  CANCELADA: 'Cancelada',
}
