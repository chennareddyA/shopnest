import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
      <p className="font-semibold text-red-800">Something went wrong</p>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-4 rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700">
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, text, icon, action }: { title: string; text: string; icon?: ReactNode; action?: { label: string; to: string } }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
      {icon && <span className="grid size-14 place-items-center rounded-full bg-stone-100 text-muted">{icon}</span>}
      <h2 className="mt-4 text-xl font-bold">{title}</h2>
      <p className="mt-1 max-w-sm text-muted">{text}</p>
      {action && (
        <Link to={action.to} className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-black">
          {action.label}
        </Link>
      )}
    </div>
  )
}
