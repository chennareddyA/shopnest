import { StarIcon } from './Icons'

export default function Rating({ value, count, size = 'size-4' }: { value: number; count?: number; size?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-muted">
      <span className="flex text-amber-400" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <StarIcon key={n} className={`${size} ${n <= Math.round(value) ? '' : 'text-stone-300'}`} />
        ))}
      </span>
      <span className="font-medium text-ink">{value.toFixed(1)}</span>
      {count !== undefined && <span>({count})</span>}
    </span>
  )
}
