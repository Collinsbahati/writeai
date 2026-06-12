'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const TOOLS = [
  { id: 'blog', label: 'Blog Post', icon: '📝', prompt: 'Write a detailed blog post about:' },
  { id: 'email', label: 'Email', icon: '📧', prompt: 'Write a professional email about:' },
  { id: 'social', label: 'Social Post', icon: '📱', prompt: 'Write an engaging social media post about:' },
  { id: 'ad', label: 'Ad Copy', icon: '🎯', prompt: 'Write compelling ad copy for:', pro: true },
  { id: 'rewrite', label: 'Rewrite', icon: '🔄', prompt: 'Rewrite the following content:', pro: true },
]

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [tool, setTool] = useState(TOOLS[0])
  const [topic, setTopic] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usage, setUsage] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
      supabase.from('profiles').select('*').eq('id', data.user.id).single()
        .then(({ data: p }) => setProfile(p))
    })
  }, [])

  async function generate(action = 'generate') {
    if (!topic.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tool: tool.id, content: output }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong'); return }
      if (action === 'generate') setOutput(data.content)
      else setOutput(data.content)
      setUsage(data.usage)
    } catch {
      setError('Network error, please try again')
    } finally {
      setLoading(false)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const isPro = profile?.plan === 'pro' || profile?.plan === 'team'

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <span className="text-xl font-bold text-indigo-400">WriteAI</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user?.email}</span>
          {!isPro && (
            <a href="/pricing" className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg text-xs font-medium transition">
              Upgrade to Pro
            </a>
          )}
          {isPro && <span className="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full text-xs font-medium border border-indigo-700">PRO</span>}
          <button onClick={signOut} className="text-gray-400 hover:text-white text-sm transition">Sign out</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 border-r border-gray-800 p-4 space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Tools</p>
          {TOOLS.map((t) => (
            <button key={t.id} onClick={() => { if (t.pro && !isPro) return; setTool(t); setOutput('') }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${tool.id === t.id ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'} ${t.pro && !isPro ? 'opacity-40 cursor-not-allowed' : ''}`}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
              {t.pro && !isPro && <span className="ml-auto text-xs text-indigo-400">Pro</span>}
            </button>
          ))}

          {/* Affiliate links */}
          <div className="pt-6 space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Recommended</p>
            {[
              { name: 'Grammarly', url: 'https://grammarly.com', emoji: '✏️' },
              { name: 'Canva', url: 'https://canva.com', emoji: '🎨' },
              { name: 'Notion', url: 'https://notion.so', emoji: '📋' },
            ].map(a => (
              <a key={a.name} href={a.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition">
                <span>{a.emoji}</span>{a.name}
              </a>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-4">
            <div>
              <h1 className="text-xl font-semibold mb-1">{tool.icon} {tool.label}</h1>
              {usage && !isPro && (
                <p className="text-xs text-gray-500">{usage.count}/{usage.limit} generations used today</p>
              )}
            </div>

            <textarea value={topic} onChange={e => setTopic(e.target.value)} rows={3}
              placeholder={tool.prompt + ' ...'}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-none" />

            {error && <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}

            <div className="flex gap-3 flex-wrap">
              <button onClick={() => generate('generate')} disabled={loading || !topic.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-6 py-2.5 rounded-lg font-medium transition">
                {loading ? 'Generating...' : '✨ Generate'}
              </button>
              {output && isPro && (
                <>
                  <button onClick={() => generate('longer')} disabled={loading}
                    className="border border-gray-700 hover:border-gray-500 px-4 py-2.5 rounded-lg text-sm transition">
                    📏 Make Longer
                  </button>
                  <button onClick={() => generate('simplify')} disabled={loading}
                    className="border border-gray-700 hover:border-gray-500 px-4 py-2.5 rounded-lg text-sm transition">
                    ✨ Simplify
                  </button>
                </>
              )}
              {output && (
                <button onClick={() => navigator.clipboard.writeText(output)}
                  className="border border-gray-700 hover:border-gray-500 px-4 py-2.5 rounded-lg text-sm transition">
                  📋 Copy
                </button>
              )}
            </div>

            {output && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 whitespace-pre-wrap text-gray-200 text-sm leading-relaxed">
                {output}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
