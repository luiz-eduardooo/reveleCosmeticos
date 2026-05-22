/**
 * Placeholder temporário para rotas que serão implementadas nas
 * próximas fases. Substituído pelas páginas reais nas Fases 3-7.
 */
export function PagePlaceholder({ title }: { title: string }) {
  return (
    <div className="mx-auto flex max-w-container flex-col items-start gap-3 px-8 py-13">
      <span className="eyebrow text-wine-600">Em construção</span>
      <h1 className="font-display text-h2 font-normal text-ink-900">
        {title}
      </h1>
      <p className="max-w-prose60 text-ink-600">
        Esta tela será implementada nas próximas fases do projeto. A fundação
        (rotas, auth, tipos, axios) já está ativa.
      </p>
    </div>
  )
}
