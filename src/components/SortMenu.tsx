import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { SORT_OPTIONS, type SortKey } from '../lib/catalog'
import { CheckIcon, ChevronDown } from './Icons'

type Props = { value: SortKey; onChange: (value: SortKey) => void }

/**
 * Custom dropdown styled to match the site (a native <select> list can't be styled).
 * Follows the ARIA listbox pattern: arrow keys, Home/End, Enter to choose, Escape to close.
 */
export default function SortMenu({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const id = useId()
  const selectedIndex = SORT_OPTIONS.findIndex((o) => o.value === value)

  // Close when clicking anywhere outside
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  function openMenu() {
    setActive(selectedIndex)
    setOpen(true)
    requestAnimationFrame(() => listRef.current?.focus())
  }

  function choose(index: number) {
    onChange(SORT_OPTIONS[index].value)
    setOpen(false)
    buttonRef.current?.focus()
  }

  function onListKey(e: KeyboardEvent<HTMLUListElement>) {
    const last = SORT_OPTIONS.length - 1
    const keys: Record<string, () => void> = {
      ArrowDown: () => setActive((i) => Math.min(i + 1, last)),
      ArrowUp: () => setActive((i) => Math.max(i - 1, 0)),
      Home: () => setActive(0),
      End: () => setActive(last),
      Enter: () => choose(active),
      ' ': () => choose(active),
      Escape: () => {
        setOpen(false)
        buttonRef.current?.focus()
      },
      Tab: () => setOpen(false),
    }
    if (keys[e.key]) {
      if (e.key !== 'Tab') e.preventDefault()
      keys[e.key]()
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            openMenu()
          }
        }}
        className={`inline-flex h-11 items-center gap-2 rounded-full border bg-white pr-3 pl-4 text-sm transition-colors ${
          open ? 'border-ink' : 'border-line hover:border-stone-400'
        }`}
      >
        <span className="text-muted">Sort by</span>
        <span className="font-semibold">{SORT_OPTIONS[selectedIndex].label}</span>
        <ChevronDown className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label="Sort products"
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKey}
          className="absolute right-0 z-30 mt-2 w-60 rounded-2xl border border-line bg-white p-1.5 shadow-xl shadow-stone-300/40 outline-none"
        >
          {SORT_OPTIONS.map((o, i) => {
            const selected = i === selectedIndex
            return (
              <li
                key={o.value}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(i)}
                className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm ${
                  i === active ? 'bg-stone-100' : ''
                } ${selected ? 'font-bold text-ink' : 'text-stone-700'}`}
              >
                {o.label}
                {selected && <CheckIcon className="size-4 text-accent" />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
