'use client'
import React, { useRef } from 'react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext';
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const login = () => {
  const containerRef = useRef(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useUser();
  const router = useRouter();
  
  const toggleIcon = () => {
    setShowPassword((prev) => !prev);
  };

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
    <div ref={containerRef} className="max-w-md w-full bg-gray-500 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden xs:w-11/12">
      <div className="p-8">
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-700 to-indigo-950 text-transparent bg-clip-text'>
          Welcome Back
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={`input relative w-full flex`}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none scale-110">
              <Mail className="size-5 text-indigo-900" />
            </div>
            <input
              type={'email'}
              required
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className={`w-full h-full px-12 py-4 bg-opacity-50 rounded-lg border border-gray-700 focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700 placeholder-gray-400 transition duration-200 xs:py-3`}
            />
          </div>
          <div className={`input relative w-full flex mt-8`}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none scale-110">
              <Lock className="size-5 text-indigo-900" />
            </div>
            <input
              type={`${showPassword ? 'text' : 'password'}`}
              required
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className={`w-full h-full px-12 py-4 bg-opacity-50 rounded-lg border border-gray-700 focus:border-indigo-700 focus:ring-2 focus:ring-indigo-700 placeholder-gray-400 transition duration-200 xs:py-3`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
              {showPassword ? (
                <Eye className="size-5 text-indigo-900" onClick={toggleIcon} />
              ) : (
                <EyeOff className="size-5 text-indigo-900" onClick={toggleIcon} />
              )}
            </div>
          </div>
          <button
            className="cursor-pointer mt-5 w-full py-3 px-4 bg-gradient-to-r from-indigo-700 to-indigo-950 text-white font-bold rounded-lg shadow-lg hover:from-indigo-800 hover:to-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-600 bg-opacity-50 flex justify-center">
        <p className="text-sm text-indigo-950">
          {"Don't have an account?"}
          <button onClick={() => router.push('/signup')} className="text-bg-indigo-700 hover:underline cursor-pointer" type="button">
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}

export default login
