'use client'
import React, { useState } from 'react'
import { useUser } from '@/app/context/UserContext';
import UserModal from '@/app/components/UserModal';
import Image from 'next/image';

const page = () => {
  const { user, logout } = useUser();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <section id='profile-section' className="w-full min-h-screen flex flex-col items-center justify-start overflow-hidden py-10">
      <h1 className='font-bold text-5xl text-white'>Profile</h1>
      <Image priority src={user?.pfp || "www.starksfamilyfh.com"} alt='Pfp' width={150} height={150} className='mt-12 rounded-full' />
      <div className='flex gap-20 w-full h-full justify-center items-center mt-12'>
        <button
          className="cursor-pointer w-32 px-4 py-2 text-lg font-semibold bg-gradient-to-br from-blue-500 to-indigo-800 text-white rounded-lg hover:bg-gradient-to-br
          shadow-lg hover:from-blue-600 hover:to-indigo-900 duration-200 transition-all hover:scale-105"
          onClick={() => setIsModalOpen(true)}
        >
          Update
        </button>
        {isModalOpen && (
          <UserModal onClose={() => setIsModalOpen(false)} />
        )}
        <button
          className='cursor-pointer w-32 px-4 py-2 text-lg font-semibold bg-red-600 text-white rounded-lg hover:bg-gradient-to-br
          shadow-lg hover:bg-red-700 duration-200 transition-all hover:scale-105'
          onClick={logout}
        >
          Exit
        </button>
      </div>
    </section>
  )
}

export default page
