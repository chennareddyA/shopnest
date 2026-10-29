type P = { className?: string }
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
}

export const SearchIcon = ({ className = 'size-5' }: P) => (
  <svg {...base} className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
)
export const BagIcon = ({ className = 'size-6' }: P) => (
  <svg {...base} className={className}><path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9z" /><path d="M9 8V7a3 3 0 0 1 6 0v1" /></svg>
)
export const HeartIcon = ({ className = 'size-6', filled = false }: P & { filled?: boolean }) => (
  <svg {...base} fill={filled ? 'currentColor' : 'none'} className={className}><path d="M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5C19 15.6 12 20 12 20Z" /></svg>
)
export const StarIcon = ({ className = 'size-4' }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true"><path fill="currentColor" d="m12 2.8 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.6l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z" /></svg>
)
export const TrashIcon = ({ className = 'size-5' }: P) => (
  <svg {...base} className={className}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></svg>
)
export const FilterIcon = ({ className = 'size-5' }: P) => (
  <svg {...base} className={className}><path d="M4 6h16M7 12h10M10 18h4" /></svg>
)
export const CloseIcon = ({ className = 'size-5' }: P) => (
  <svg {...base} className={className}><path d="M6 6l12 12M18 6 6 18" /></svg>
)
export const CheckIcon = ({ className = 'size-5' }: P) => (
  <svg {...base} strokeWidth={2.4} className={className}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
)
export const TruckIcon = ({ className = 'size-5' }: P) => (
  <svg {...base} className={className}><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></svg>
)
export const ShieldIcon = ({ className = 'size-5' }: P) => (
  <svg {...base} className={className}><path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6z" /><path d="m9 12 2 2 4-4" /></svg>
)
export const ReturnIcon = ({ className = 'size-5' }: P) => (
  <svg {...base} className={className}><path d="M9 14 4 9l5-5" /><path d="M4 9h11a5 5 0 0 1 0 10h-3" /></svg>
)
export const ChevronLeft = ({ className = 'size-5' }: P) => (
  <svg {...base} className={className}><path d="m15 6-6 6 6 6" /></svg>
)
export const ChevronRight = ({ className = 'size-5' }: P) => (
  <svg {...base} className={className}><path d="m9 6 6 6-6 6" /></svg>
)
export const ChevronDown = ({ className = 'size-4' }: P) => (
  <svg {...base} className={className}><path d="m6 9 6 6 6-6" /></svg>
)
export const CardIcon = ({ className = 'size-5' }: P) => (
  <svg {...base} className={className}><rect x="2.5" y="5" width="19" height="14" rx="3" /><path d="M2.5 10h19M6.5 15h3" /></svg>
)
export const CalendarIcon = ({ className = 'size-5' }: P) => (
  <svg {...base} className={className}><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
)
export const LockIcon = ({ className = 'size-5' }: P) => (
  <svg {...base} className={className}><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></svg>
)
export const AwardIcon = ({ className = 'size-5' }: P) => (
  <svg {...base} className={className}><circle cx="12" cy="9" r="5.5" /><path d="m8.5 13.5-1.5 7 5-2.5 5 2.5-1.5-7" /></svg>
)
export const TagIcon = ({ className = 'size-5' }: P) => (
  <svg {...base} className={className}><path d="M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8 8-9 9z" /><circle cx="8.5" cy="8.5" r="1.5" /></svg>
)
