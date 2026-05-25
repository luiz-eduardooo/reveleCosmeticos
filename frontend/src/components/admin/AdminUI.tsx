import type { ReactNode } from 'react'
import { cn } from '@/lib/helpers'

/* ──────────────── Admin card ──────────────── */

export function AdminCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-md border border-ink-200 bg-white',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function AdminCardHead({
  title,
  meta,
  action,
}: {
  title: string
  meta?: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-ink-200 px-6 py-5">
      <div className="flex items-baseline gap-3">
        <h3 className="font-display text-[1.15rem] font-medium text-ink-900">
          {title}
        </h3>
        {meta && (
          <span className="font-mono text-[0.7rem] tracking-[0.04em] text-ink-500">
            {meta}
          </span>
        )}
      </div>
      {action}
    </div>
  )
}

/* ──────────────── KPI ──────────────── */

export function Kpi({
  label,
  value,
  icon,
  accent = false,
}: {
  label: string
  value: ReactNode
  icon: ReactNode
  accent?: boolean
}) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-ink-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <span className="font-body text-[0.74rem] uppercase tracking-[0.1em] text-ink-500">
          {label}
        </span>
        <span
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-md',
            accent
              ? 'bg-wine-50 text-wine-700'
              : 'bg-ink-100 text-ink-700',
          )}
        >
          {icon}
        </span>
      </div>
      <span className="font-display text-[2.5rem] font-normal leading-none tracking-[-0.01em] text-ink-900">
        {value}
      </span>
    </div>
  )
}

/* ──────────────── Tabela ──────────────── */

/** Casca de tabela com scroll horizontal no mobile. */
export function AdminTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[0.88rem]">
        {children}
      </table>
    </div>
  )
}

export function Th({
  children,
  align = 'left',
}: {
  children?: ReactNode
  align?: 'left' | 'right' | 'center'
}) {
  return (
    <th
      className={cn(
        'whitespace-nowrap border-b border-ink-200 bg-ink-50 px-5 py-3',
        'font-body text-[0.7rem] font-medium uppercase tracking-[0.14em] text-ink-500',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
      )}
    >
      {children}
    </th>
  )
}

export function Td({
  children,
  align = 'left',
  className,
}: {
  children?: ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
}) {
  return (
    <td
      className={cn(
        'border-b border-ink-200 px-5 py-4 align-middle text-ink-800',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className,
      )}
    >
      {children}
    </td>
  )
}

/* ──────────────── Tag de status (admin) ──────────────── */

type AdminTagKind =
  | 'active'
  | 'paused'
  | 'cancelled'
  | 'club'
  | 'off'
  | 'pending'

const tagStyles: Record<AdminTagKind, string> = {
  active: 'bg-success-soft text-success',
  paused: 'bg-warning-soft text-warning',
  cancelled: 'bg-ink-100 text-ink-500',
  club: 'bg-wine-50 text-wine-700',
  off: 'bg-ink-100 text-ink-500',
  pending: 'bg-warning-soft text-warning',
}

export function AdminTag({
  kind,
  children,
}: {
  kind: AdminTagKind
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-xs px-2 py-1',
        'font-body text-[0.68rem] font-medium uppercase tracking-[0.1em]',
        tagStyles[kind],
      )}
    >
      <span className="h-[5px] w-[5px] rounded-full bg-current" />
      {children}
    </span>
  )
}
