'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { isAuthenticated, login } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Invalid email format");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success && data.user) {
        login(data.user);
        router.push('/');
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) router.push('/');
  }, [isAuthenticated, router]);

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
    <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" ref={containerRef}>
      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl bg-zinc-900/60 border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden">
        
        {/* Left Side: Brand Visual Panel */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-indigo-950/80 via-zinc-900 to-zinc-950 relative overflow-hidden border-r border-white/10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">ClosetStudio</span>
          </div>

          <div className="relative z-10 space-y-4 my-auto">
            <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Welcome back to your digital wardrobe.
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Curate outfits, organize 3D garments, and elevate your personal style seamlessly.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>End-to-end encrypted wardrobe vault</span>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white tracking-tight">Sign In</h2>
            <p className="text-xs text-zinc-400 mt-1">Enter your credentials to access your studio</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
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
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-xs text-center text-zinc-500">
            Don’t have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="text-indigo-400 font-semibold hover:underline cursor-pointer ml-1"
            >
              Create Account
            </button>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Login