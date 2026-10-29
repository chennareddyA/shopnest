import type { InputHTMLAttributes, ReactNode } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  id: string
  label: string
  error?: string
  hint?: ReactNode
}

/** Labeled input with an error message wired up for screen readers */
export default function Field({ id, label, error, hint, className = '', ...input }: Props) {
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold">{label}</label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`mt-1.5 h-12 w-full rounded-xl border bg-white px-4 outline-none transition-colors focus:border-ink ${error ? 'border-red-500' : 'border-line'}`}
        {...input}
      />
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  )
}
