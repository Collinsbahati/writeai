'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error) { setError(error.message); setLoading(false); return }
    if (data.session) { router.push('/dashboard') }
    else { router.push('/check-email') }
    setLoading(false)
  }

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { setError(error.message); setGoogleLoading(false) }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .signup-root { min-height: 100vh; background: #0a0a0f; display: flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; padding: 24px; position: relative; overflow: hidden; }
        .signup-root::before { content: ''; position: absolute; top: -200px; left: 50%; transform: translateX(-50%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%); pointer-events: none; }
        .signup-card { width: 100%; max-width: 420px; background: #13131a; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 40px; position: relative; z-index: 1; }
        .logo-row { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 28px; }
        .logo-icon { width: 32px; height: 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; color: white; }
        .logo-text { font-size: 20px; font-weight: 600; color: #fff; letter-spacing: -0.3px; }
        .logo-text span { background: linear-gradient(135deg, #6366f1, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .signup-heading { text-align: center; margin-bottom: 8px; }
        .signup-heading h1 { font-size: 22px; font-weight: 600; color: #f1f1f5; letter-spacing: -0.4px; }
        .signup-heading p { font-size: 14px; color: #6b6b80; margin-top: 6px; }
        .google-btn { width: 100%; margin-top: 24px; padding: 12px; background: #1e1e2a; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #e4e4f0; font-size: 14px; font-weight: 500; font-family: 'Inter', sans-serif; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: background 0.15s, border-color 0.15s; }
        .google-btn:hover:not(:disabled) { background: #252535; border-color: rgba(255,255,255,0.18); }
        .google-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .google-icon { width: 18px; height: 18px; flex-shrink: 0; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .divider-text { font-size: 12px; color: #44445a; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase; }
        .form-group { margin-bottom: 14px; }
        .form-label { display: block; font-size: 13px; font-weight: 500; color: #9090a8; margin-bottom: 6px; }
        .form-input { width: 100%; padding: 11px 14px; background: #1a1a25; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: #e4e4f0; font-size: 14px; font-family: 'Inter', sans-serif; transition: border-color 0.15s; outline: none; }
        .form-input::placeholder { color: #3a3a52; }
        .form-input:focus { border-color: rgba(99,102,241,0.5); background: #1e1e2e; }
        .error-box { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #f87171; margin-bottom: 16px; }
        .submit-btn { width: 100%; padding: 13px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; border-radius: 12px; color: #fff; font-size: 14px; font-weight: 600; font-family: 'Inter', sans-serif; cursor: pointer; margin-top: 6px; transition: opacity 0.15s, transform 0.1s; }
        .submit-btn:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .signin-link { text-align: center; margin-top: 20px; font-size: 13px; color: #5a5a72; }
        .signin-link a { color: #818cf8; text-decoration: none; font-weight: 500; }
        .signin-link a:hover { color: #a5b4fc; }
        .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 6px; vertical-align: middle; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .free-badge { display: inline-flex; align-items: center; gap: 4px; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25); border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 600; color: #818cf8; letter-spacing: 0.4px; text-transform: uppercase; margin-bottom: 10px; }
      `}</style>

      <div className="signup-root">
        <div className="signup-card">
          <div className="logo-row">
            <div className="logo-icon">W</div>
            <span className="logo-text">Write<span>AI</span></span>
          </div>
          <div className="signup-heading">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <span className="free-badge">✦ Free to start</span>
            </div>
            <h1>Create your account</h1>
            <p>Start writing smarter in seconds</p>
          </div>

          <button className="google-btn" onClick={handleGoogleSignUp} disabled={googleLoading || loading}>
            {googleLoading ? <span className="spinner" /> : (
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">or</span>
            <div className="divider-line" />
          </div>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSignUp}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input className="form-input" type="text" placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required />
            </div>
            <button className="submit-btn" type="submit" disabled={loading || googleLoading}>
              {loading && <span className="spinner" />}
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>
          </form>

          <p className="signin-link">
            Already have an account? <a href="/sign-in">Sign in</a>
          </p>
        </div>
      </div>
    </>
  )
}
