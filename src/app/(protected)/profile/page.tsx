'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { useUser } from '@/app/context/UserContext';
import UserModal from '@/app/components/UserModal';
import Outfit from '@/app/components/Outfit';
import Clothing from '@/app/components/Clothing';
import ItemModal from '@/app/components/ItemModal';
import { clothesType, EditableClothesType, outfitType } from '@/lib/types';

const page = () => {
  const { user, logout } = useUser();
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [clothes, setClothes] = useState<clothesType[] | null>(null);
  const [currentItem, setCurrentItem] = useState<clothesType>({ name: '', image: '', modelFile: '', scale: 0.0, position: [0, 0, 0], description: '', type: null, creator: user });
  const [outfits, setOutfits] = useState<outfitType[] | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);

  const fetchUserDetails = async () => {
    const response = await axios.get('/api/user', { params: { userId: user?._id } });
    const data = response.data;

    setClothes(data.clothes);
    setOutfits(data.outfits);
  };
  
  const saveItem = async (item: EditableClothesType) => {
    try {
      const formData = new FormData();
      formData.append("item", JSON.stringify(item));

      if (item.imageFile) formData.append("image", item.imageFile);
      if (item.modelFileFile) formData.append("model", item.modelFileFile);

      // append other fields
      formData.append("name", item.name);
      formData.append("scale", String(item.scale));
      formData.append("description", item.description);
      formData.append("position", JSON.stringify(item.position));
      if (item.type) formData.append("type", item.type);

      const response = await axios.post("/api/updateItem", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data;
      if (data.success) {
        setIsItemModalOpen(false);
        fetchUserDetails();
      } else {
        alert("Error while updating item! Try again");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading item");
    }
  };

  const handleOpenItemModal = (item: clothesType) => {
    setCurrentItem(item);
    setIsItemModalOpen(true);
  };
  
  const handleClose = () => {
    try {
      setIsItemModalOpen(false);
    } catch(err) {
      alert('Error uploading the image: ' + err);
      setIsItemModalOpen(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchUserDetails();
  }, []);

  return (
    <>
      {isItemModalOpen && (
        <ItemModal onSave={(item) => saveItem(item)} onClose={handleClose} item={currentItem} />
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
        <section id='clothes-section' className='w-full h-full flex flex-col justify-center items-center mt-32 mb-10'>
          <h1 className='font-bold text-5xl bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent py-10'>Your Clothes</h1>
          <div className='flex flex-col justify-center items-center w-full h-full'>
            <div className='grid grid-cols-3 w-full h-full px-5 p-10 gap-10'>
              {clothes && clothes[0] ? (
                (clothes.map((clothing, idx) => (
                  <Clothing key={idx} item={clothing} onOpen={handleOpenItemModal} />
                )))
              ) : (
                <div className='font-bold text-2xl bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent my-10'>No clothes found</div>
              )}
            </div>
          </div>
        </section>
        <section id='outfit-section' className='w-full h-full flex flex-col justify-center items-center my-10'>
          <h1 className='font-bold text-5xl bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent'>Your Outfits</h1>
          <div className='flex flex-col justify-center items-center'>
            <div className='grid grid-cols-3 w-full h-full px-5 p-10 gap-10'>
              {outfits && outfits[0] ? (
                (outfits.map((outfit, idx) => (
                  <Outfit key={idx} item={outfit} />
                )))
              ) : (
                <div className='font-bold text-2xl bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent my-10'>No outfits found</div>
              )}
            </div>
          </div>
        </section>
      </section>
    </>
  )
}

export default page
