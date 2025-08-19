'use client'
import React, { useState } from 'react'
import { useUser } from '@/app/context/UserContext';
import UserModal from '@/app/components/UserModal';

const page = () => {
  const { logout } = useUser();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <section id='profile-section' className="w-full min-h-screen flex flex-col items-center justify-start overflow-hidden py-10">
      <h1 className='font-bold text-5xl text-white'>Profile</h1>
      <button
        className="cursor-pointer w-32 mt-10 px-4 py-2 text-lg font-semibold bg-gradient-to-br from-blue-500 to-indigo-800 text-white rounded-lg hover:bg-gradient-to-br
        shadow-lg hover:from-blue-600 hover:to-indigo-900 duration-200 transition-all hover:scale-105"
        onClick={() => setIsModalOpen(true)}
      >
        Update
      </button>
      {isModalOpen && (
        <UserModal onClose={() => setIsModalOpen(false)} />
      )}
      <button
        className='bg-red-600 w-32 cursor-pointer font-semibold px-6 py-3 rounded-lg my-10 transition-all duration-300 hover:bg-red-700 hover:scale-105'
        onClick={logout}
      >
        Exit
      </button>
    </section>
  )
}

export default page
