'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FloatingInput } from '../../components/ui/floating-input'
import { Button } from '../../components/ui/button'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import '../../components/dashboard/dashboard.css'

// Metadata has been moved to layout.js since this is a Client Component.



// SVG for the Asterisk Logo
const AsteriskLogo = () => (
  <svg width="64" height="64" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
    <path d="M24 0V48M0 24H48M7.02944 7.02944L40.9706 40.9706M7.02944 40.9706L40.9706 7.02944" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Dynamic Content State
  const [scenario, setScenario] = useState('general') // 'first-time', 'returning', 'general'
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const hasLoggedIn = localStorage.getItem('admin_login_history')

    if (!hasLoggedIn) {
      setScenario('first-time')
    } else {
      setScenario(Math.random() > 0.5 ? 'returning' : 'general')
    }
  }, [])

  const contentMap = {
    'returning': {
      heading: 'Welcome\nBack!',
      description: 'Sign in to continue managing your dashboard, monitor key insights, and stay in control of your operations with ease.'
    },
    'first-time': {
      heading: 'Welcome to the\nAdmin Dashboard!',
      description: 'Access a centralized workspace designed to help you manage users, monitor performance, and streamline your daily operations efficiently.'
    },
    'general': {
      heading: 'Manage Your Workspace\nwith Confidence!',
      description: 'Securely access your dashboard to oversee your data, manage resources, and keep everything running smoothly from one place.'
    }
  }

  const currentContent = isMounted ? contentMap[scenario] : contentMap['general']

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // credentials: 'include' ensures the HttpOnly cookie is accepted
        credentials: 'include',
        body: JSON.stringify({ email: form.username, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Login failed')

      // Store auth state for client-side context & HttpOnly cookie for server
      localStorage.setItem('admin_logged_in', 'true')
      localStorage.setItem('admin_login_history', 'true')
      if (data.token) localStorage.setItem('admin_token', data.token)
      if (data.user) localStorage.setItem('admin_user', JSON.stringify(data.user))

      router.push('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.')
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-[#f4f6f8] font-sans text-slate-900 p-4 sm:p-8">

      {/* THE MAIN CONTAINER BOX */}
      <div className="w-full max-w-[1100px] min-h-[500px] flex flex-col lg:flex-row bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200/60 overflow-hidden">

        {/* LEFT PANEL - Hidden on mobile, 50% on lg */}
        <div className="hidden lg:flex flex-col relative w-[45%] xl:w-1/2 bg-gradient-to-br from-[#061A13] via-[#0E3326] to-[#144835] text-white overflow-hidden selection:bg-white/20">

          {/* Subtle Noise Texture */}
          <div className="absolute inset-0 opacity-[0.25] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

          {/* Geometric Curves (Overlapping arcs) */}
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
            <svg className="absolute w-[200%] h-[200%] -top-[10%] -left-[30%]" viewBox="0 0 100 100" preserveAspectRatio="none" stroke="#CFA86E" strokeWidth="0.08" fill="none">
              <circle cx="0" cy="50" r="40" />
              <circle cx="0" cy="50" r="48" />
              <circle cx="0" cy="50" r="56" />
              <circle cx="0" cy="50" r="64" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col h-full p-8 lg:p-12">
            <div className="mt-2">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md p-2.5 border border-[#CFA86E]/40 flex items-center justify-center shadow-lg">
                <img src="/images/tara-devis-seal.png" alt="Tara Devi's" className="w-full h-full object-contain" />
              </div>
            </div>

            <div className="mt-12 max-w-[400px]">
              <h1 className="text-[36px] lg:text-[44px] font-serif font-bold tracking-tight leading-[1.1] mb-4 text-[#FFFFFF] animate-in fade-in slide-in-from-bottom-4 duration-700 whitespace-pre-line">
                {currentContent.heading} <span className="inline-block origin-bottom-right hover:animate-pulse"></span>
              </h1>
              <p className="text-[#E4C794]/90 text-[15px] leading-[1.6] font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                {currentContent.description}
              </p>
            </div>

            <div className="mt-auto pt-6">
              <p className="text-[#CFA86E] text-[13px] font-medium tracking-wide">
                © {new Date().getFullYear()} Tara Devi's Group. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Form Area */}
        <div className="w-full lg:w-[55%] xl:w-1/2 flex flex-col p-8 lg:p-10 justify-center relative bg-white">

          <div className="max-w-[400px] w-full mx-auto">

            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 relative flex items-center justify-center drop-shadow-md mb-2">
                <img
                  src="/images/tara-devis-seal.png"
                  alt="Tara Devi's Group Medallion"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                  style={{ width: "70px", height: "70px", maxWidth: "70px", maxHeight: "70px" }}
                />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-[26px] font-serif font-bold tracking-tight mb-2 text-[#0E3326]">Tara Devi's Portal</h1>
              <p className="text-[14px] text-slate-500 font-medium">Please enter your credentials to access the admin dashboard.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-[14px] font-medium flex items-center gap-3 mb-6 animate-in fade-in duration-300">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative group">
                <FloatingInput
                  label="Email Address"
                  type="email"
                  id="email"
                  required
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                />
              </div>

              <div className="relative group">
                <FloatingInput
                  label="Password"
                  type={showPwd ? 'text' : 'password'}
                  id="password"
                  required
                  className="pr-12"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors z-20"
                >
                  {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="pt-8">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[54px] bg-[#0E3326] hover:bg-[#1A5A44] text-white rounded-xl font-bold text-[15px] transition-all shadow-[0_4px_14px_0_rgba(14,51,38,0.3)] hover:shadow-[0_6px_20px_rgba(207,168,110,0.3)] active:scale-[0.98]"
                >
                  {loading ? 'Logging in...' : 'Sign In to Tara Devi\'s Dashboard'}
                </Button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}
