import { ReturnIcon, ShieldIcon, TruckIcon } from './Icons'
import { FREE_SHIPPING_FROM } from '../lib/pricing'

const perks = [
  { icon: TruckIcon, title: `Free shipping over $${FREE_SHIPPING_FROM}`, text: 'Standard delivery in 4 to 6 days' },
  { icon: ReturnIcon, title: '30-day returns', text: 'Changed your mind? Send it back' },
  { icon: ShieldIcon, title: 'Secure checkout', text: 'Your details stay protected' },
]

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6">
        {perks.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-orange-50 text-accent">
              <Icon />
            </span>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted sm:px-6">
          ShopNest is a portfolio demo. Products come from the DummyJSON API, and no real payments are taken.
        </p>
      </div>
    </footer>
  )
}
