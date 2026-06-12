import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['5 generations/day', 'Blog, email & social', 'Basic AI quality'],
    cta: 'Get Started Free',
    href: '/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    features: ['Unlimited generations', 'All content types', 'Ad copy & rewrites', 'Make longer & simplify', 'Priority AI access'],
    cta: 'Upgrade to Pro',
    href: '/signup',
    highlight: true,
  },
  {
    name: 'Team',
    price: '$29',
    period: '/month',
    features: ['Everything in Pro', 'Up to 5 team members', 'Shared workspace', 'Team usage analytics', 'Priority support'],
    cta: 'Start Team Plan',
    href: '/signup',
    highlight: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold text-indigo-400">WriteAI</Link>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-400 hover:text-white transition">Login</Link>
          <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium transition">Sign Up</Link>
        </div>
      </nav>

      <section className="text-center py-16 px-6">
        <h1 className="text-4xl font-extrabold mb-4">Simple, transparent pricing</h1>
        <p className="text-gray-400 text-lg">Start free, upgrade when you need more.</p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.name} className={`rounded-2xl p-8 border ${plan.highlight ? 'border-indigo-500 bg-indigo-950/40' : 'border-gray-800 bg-gray-900'}`}>
            {plan.highlight && <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">Most Popular</div>}
            <h2 className="text-2xl font-bold mb-1">{plan.name}</h2>
            <div className="text-4xl font-extrabold mb-1">{plan.price}<span className="text-lg text-gray-400 font-normal">{plan.period}</span></div>
            <ul className="mt-6 space-y-3 mb-8">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href={plan.href}
              className={`block text-center py-3 rounded-xl font-semibold transition ${plan.highlight ? 'bg-indigo-600 hover:bg-indigo-500' : 'border border-gray-700 hover:border-gray-500'}`}>
              {plan.cta}
            </Link>
          </div>
        ))}
      </section>
    </div>
  )
}
