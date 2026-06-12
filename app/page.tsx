import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-xl font-bold text-indigo-400">WriteAI</span>
        <div className="flex gap-4">
          <Link href="/pricing" className="text-gray-400 hover:text-white transition">Pricing</Link>
          <Link href="/login" className="text-gray-400 hover:text-white transition">Login</Link>
          <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-medium transition">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Write Better Content{' '}
          <span className="text-indigo-400">10x Faster</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Generate blogs, emails, ad copy, social posts and more with AI. Free to start — no credit card required.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-xl text-lg font-semibold transition">
            Start Writing Free
          </Link>
          <Link href="/pricing" className="border border-gray-700 hover:border-gray-500 px-8 py-4 rounded-xl text-lg font-semibold transition">
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to write great content</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Blog Posts', desc: 'Full SEO-optimised articles in seconds', icon: '📝' },
            { title: 'Email Campaigns', desc: 'Subject lines and body copy that convert', icon: '📧' },
            { title: 'Ad Copy', desc: 'Google, Facebook & Instagram ads that sell', icon: '🎯' },
            { title: 'Social Posts', desc: 'Engaging content for every platform', icon: '📱' },
            { title: 'Make Longer', desc: 'Expand any content with one click (Pro)', icon: '📏' },
            { title: 'Simplify', desc: 'Make complex text easy to read (Pro)', icon: '✨' },
          ].map((f) => (
            <div key={f.title} className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-4">Ready to write smarter?</h2>
        <p className="text-gray-400 mb-8">Join thousands of writers using WriteAI every day.</p>
        <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-500 px-10 py-4 rounded-xl text-lg font-semibold transition">
          Get Started — It's Free
        </Link>
      </section>

      <footer className="text-center py-8 text-gray-600 text-sm border-t border-gray-900">
        © {new Date().getFullYear()} WriteAI. All rights reserved.
      </footer>
    </main>
  )
}
