'use client'
import React from 'react'
import { useUser } from '@/app/context/UserContext';

const page = () => {
  const { logout } = useUser();

  return (
    <section id='profile-section' className="w-full min-h-screen flex flex-col items-center justify-start overflow-hidden py-10">
      <h1 className='font-bold text-5xl text-white'>Profile</h1>
      <button className='bg-red-600 cursor-pointer font-semibold px-6 py-3 rounded-lg my-10 transition-all duration-300 hover:bg-red-700 hover:scale-105' onClick={logout}>Exit</button>
    </section>
  )
}

export default page
