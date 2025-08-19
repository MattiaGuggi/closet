'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { useUser } from '@/app/context/UserContext';
import UserModal from '@/app/components/UserModal';
import Outfit from '@/app/components/Outfit';
import Clothing from '@/app/components/Clothing';
import { clothesType, outfitType } from '@/lib/types';

const page = () => {
  const { user, logout } = useUser();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [clothes, setClothes] = useState<clothesType[] | null>(null);
  const [outfits, setOutfits] = useState<outfitType[] | null>(null);

  const fetchUserDetails = async () => {
    const response = await axios.get('/api/user', { params: { user: user?._id } });
    const data = response.data;

    setClothes(data.clothes);
    setOutfits(data.outfits);

    console.log(data);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <section id='profile-section' className="w-full min-h-screen flex flex-col items-center justify-start overflow-hidden py-10">
      <h1 className='font-bold text-5xl bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent'>Profile</h1>
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
      <section id='clothes-section' className='w-full h-full flex flex-col justify-center items-center my-10'>
        <h1 className='font-bold text-5xl bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent'>Your Clothes</h1>
        <div className='flex flex-col justify-center items-center'>
          {clothes && clothes?.length > 0 ? (
            (clothes.map((clothing, idx) => (
              <div key={idx} className='grid grid-cols-3 w-full h-full px-5 py-10'>
                <Clothing item={clothing} />
              </div>
            )))
          ) : (
            <div className='font-bold text-2xl bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent my-10'>No clothes found</div>
          )}
        </div>
      </section>
      <section id='outfit-section' className='w-full h-full flex flex-col justify-center items-center my-10'>
        <h1 className='font-bold text-5xl bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent'>Your Outfits</h1>
        <div className='flex flex-col justify-center items-center'>
          {outfits && outfits?.length > 0 ? (
            (outfits.map((outfit, idx) => (
              <div key={idx} className='grid grid-cols-3 w-full h-full px-5 py-10'>
                <Outfit item={outfit} />
              </div>
            )))
          ) : (
            <div className='font-bold text-2xl bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent my-10'>No outfits found</div>
          )}
        </div>
      </section>
    </section>
  )
}

export default page
