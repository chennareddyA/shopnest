import { ChevronLeft, ChevronRight } from './Icons'

type Props = { page: number; pageCount: number; onPage: (page: number) => void }

/** Page numbers with ellipses: 1 … 4 5 6 … 12 */
function pages(current: number, count: number): (number | '…')[] {
  const set = new Set([1, count, current - 1, current, current + 1].filter((n) => n >= 1 && n <= count))
  const sorted = [...set].sort((a, b) => a - b)
  const out: (number | '…')[] = []
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) out.push('…')
    out.push(n)
  })
  return out
}

export default function Pagination({ page, pageCount, onPage }: Props) {
  if (pageCount <= 1) return null
  const btn = 'grid size-10 place-items-center rounded-full text-sm font-semibold transition-colors'
  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1">
      <button type="button" className={`${btn} hover:bg-stone-100 disabled:opacity-30`} onClick={() => onPage(page - 1)} disabled={page === 1} aria-label="Previous page">
        <ChevronLeft />
      </button>
      {pages(page, pageCount).map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="w-8 text-center text-muted">…</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPage(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`${btn} ${p === page ? 'bg-ink text-white' : 'hover:bg-stone-100'}`}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" className={`${btn} hover:bg-stone-100 disabled:opacity-30`} onClick={() => onPage(page + 1)} disabled={page === pageCount} aria-label="Next page">
        <ChevronRight />
      </button>
    </nav>
  )
}
