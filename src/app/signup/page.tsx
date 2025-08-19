'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../context/UserContext'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

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
    <div className="min-h-screen flex items-center justify-center" ref={containerRef}>
      <div className="w-full max-w-md p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-br from-blue-500 to-indigo-700 text-transparent bg-clip-text">Create Account</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-indigo-600 text-white"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
            className="w-full py-3 bg-gradient-to-br from-blue-500 to-indigo-700 font-semibold rounded-lg
            hover:bg-gradient-to-br transition cursor-pointer hover:from-blue-600 hover:to-indigo-800 text-white"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="bg-gradient-to-br from-blue-500 to-indigo-700 text-transparent bg-clip-text hover:underline cursor-pointer"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  )
}

export default Signup
