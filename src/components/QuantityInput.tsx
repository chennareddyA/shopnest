type Props = { value: number; max: number; onChange: (n: number) => void; label: string }

export default function QuantityInput({ value, max, onChange, label }: Props) {
  const btn = 'grid size-10 place-items-center text-lg text-ink hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40'
  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border border-line bg-white" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        value={value}
        onChange={(e) => {
          const n = Math.floor(Number(e.target.value))
          if (Number.isFinite(n)) onChange(Math.min(Math.max(n, 1), max))
        }}
        aria-label="Quantity"
        className="w-12 [appearance:textfield] bg-transparent text-center font-semibold outline-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        +
      </button>
    </div>
  )
}
