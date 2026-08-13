'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { User, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react'

const Signup = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const { signup, isAuthenticated } = useUser()
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setError("")

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    })
    const data = await res.json()
    if (data.success) {
      signup()
      router.push('/')
    } else {
      setError(data.message || "Signup failed")
    }
  }
  
  useEffect(() => {
    if (isAuthenticated) router.push('/');
  }, [isAuthenticated]);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }
    );
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6" ref={containerRef}>
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-zinc-900/60 border border-white/10 shadow-2xl backdrop-blur-2xl">
        
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-3 shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Account</h2>
          <p className="text-xs text-zinc-400 mt-1">Start curating your modern 3D wardrobe</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="johndoe"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950/60 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950/60 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950/60 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        <p className="mt-8 text-xs text-center text-zinc-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-indigo-400 font-semibold hover:underline cursor-pointer ml-1"
          >
            Log In
          </button>
        </p>

      </div>
    </div>
  )
}

export default Signup