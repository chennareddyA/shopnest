import { Link } from 'react-router-dom'
import { useToast } from '../store/toast'
import { CheckIcon, CloseIcon } from './Icons'

export default function Toaster() {
  const toasts = useToast((s) => s.toasts)
  const dismiss = useToast((s) => s.dismiss)

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-sm text-white shadow-xl">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent">
            <CheckIcon className="size-3.5" />
          </span>
          <span className="flex-1">{t.message}</span>
          {t.action && (
            <Link to={t.action.to} onClick={() => dismiss(t.id)} className="font-semibold text-orange-300 hover:text-orange-200">
              {t.action.label}
            </Link>
          )}
          <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-white/60 hover:text-white">
            <CloseIcon className="size-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
