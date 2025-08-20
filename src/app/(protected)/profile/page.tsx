'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { useUser } from '@/app/context/UserContext';
import UserModal from '@/app/components/UserModal';
import Outfit from '@/app/components/Outfit';
import Clothing from '@/app/components/Clothing';
import ItemModal from '@/app/components/ItemModal';
import { clothesType, outfitType } from '@/lib/types';

const page = () => {
  const { user, logout } = useUser();
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [clothes, setClothes] = useState<clothesType[] | null>(null);
  const [currentItem, setCurrentItem] = useState<clothesType>({ name: '', image: '', modelFile: '', scale: 0.0, position: [0, 0, 0], description: '', type: null, creator: user });
  const [outfits, setOutfits] = useState<outfitType[] | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);

  const fetchUserDetails = async () => {
    const response = await axios.get('/api/user', { params: { user: user?._id } });
    const data = response.data;

    setClothes(data.clothes);
    setOutfits(data.outfits);
  };
  
  const saveItem = async (newItem: clothesType) => {
    const response = await axios.post('/api/updateItem', {
      item: newItem
    });
    const data = response.data;

    if (data.success) {
      setIsItemModalOpen(false);
      fetchUserDetails();
    }

    else alert('Error while updating item! Try again');
  };

  const handleOpenItemModal = (item: clothesType) => {
    setCurrentItem(item);
    setIsItemModalOpen(true);
  };

  useEffect(() => {
    if (user?._id) fetchUserDetails();
  }, []);

  return (
    <>
      {isItemModalOpen && (
        <ItemModal onSave={(item) => saveItem(item)} onClose={() => setIsItemModalOpen(false)} item={currentItem} />
      )}
      {isUserModalOpen && (
        <UserModal onClose={() => setIsUserModalOpen(false)} />
      )}
      <section id='profile-section' className="w-full min-h-screen flex flex-col items-center justify-start overflow-hidden py-10">
        <h1 className='font-bold text-5xl bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent'>Profile</h1>
        <Image priority src={user?.pfp || "www.starksfamilyfh.com"} alt='Pfp' width={150} height={150} className='mt-12 rounded-full' />
        <div className='flex gap-20 w-full h-full justify-center items-center my-12'>
          <button
            className="cursor-pointer w-32 px-4 py-2 text-lg font-semibold bg-gradient-to-br from-blue-500 to-indigo-800 text-white rounded-lg hover:bg-gradient-to-br
            shadow-lg hover:from-blue-600 hover:to-indigo-900 duration-200 transition-all hover:scale-105"
            onClick={() => setIsUserModalOpen(true)}
          >
            Update
          </button>
          <button
            className='cursor-pointer w-32 px-4 py-2 text-lg font-semibold bg-red-600 text-white rounded-lg hover:bg-gradient-to-br
            shadow-lg hover:bg-red-700 duration-200 transition-all hover:scale-105'
            onClick={logout}
          >
            Exit
          </button>
        </div>
        <section id='clothes-section' className='w-full h-full flex flex-col justify-center items-center my-32'>
          <h1 className='font-bold text-5xl bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent'>Your Clothes</h1>
          <div className='flex flex-col justify-center items-center w-full h-full'>
            {clothes && clothes[0] ? (
              (clothes.map((clothing, idx) => (
                <div key={idx} className='grid grid-cols-3 w-full h-full px-5 p-10'>
                  <Clothing item={clothing} onOpen={handleOpenItemModal} />
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
            {outfits && outfits[0] ? (
              (outfits.map((outfit, idx) => (
                <div key={idx} className='grid grid-cols-3 w-full h-full px-5 p-10'>
                  <Outfit item={outfit} />
                </div>
              )))
            ) : (
              <div className='font-bold text-2xl bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent my-10'>No outfits found</div>
            )}
          </div>
        </section>
      </section>
    </>
  )
}

export default page
