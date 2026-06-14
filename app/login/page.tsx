'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-indigo-400">WriteAI</Link>
          <h1 className="text-2xl font-bold text-white mt-4">Welcome back</h1>
          <p className="text-gray-400 mt-1">Sign in to your account</p>
        </div>
        <form onSubmit={handleLogin} className="bg-gray-900 rounded-2xl p-8 border border-gray-800 space-y-4">
          {error && <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 py-3 rounded-lg font-semibold text-white transition">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4 text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300">Sign up free</Link>
        </p>
      </div>
    </div>
  )
}
