'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { isAuthenticated, login } = useUser()

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Invalid email format");
      return;
    }
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      login(data.user);
      router.push('/');
    } else {
      setError(data.message || "Login failed");
    }
  };

  useEffect(() => {
    if (isAuthenticated) router.push('/');
  }, [isAuthenticated]);

  useGSAP(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      }
    );
  }, []);

  return (
    <div className="min-h-screen flex" ref={containerRef}>
      {/* Left side (branding / image / message) */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-700 to-indigo-900 text-white items-center justify-center">
        <div className="p-10 max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg">Log in to access your profile and continue where you left off.</p>
        </div>
      </div>

      {/* Right side (form) */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-600">Login</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-indigo-600 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-indigo-600 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition cursor-pointer"
            >
              Login
            </button>
          </form>
          <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
            Don’t have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="text-indigo-600 hover:underline cursor-pointer"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
