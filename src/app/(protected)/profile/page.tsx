'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useUser } from '@/app/context/UserContext';
import UserModal from '@/app/components/UserModal';
import Outfit from '@/app/components/Outfit';
import Clothing from '@/app/components/Clothing';
import ItemModal from '@/app/components/ItemModal';
import { clothesType, EditableClothesType, outfitType } from '@/lib/types';
import OutfitModal from '@/app/components/OutfitModal';
import { Trash2Icon } from 'lucide-react';

const page = () => {
  const { user, logout } = useUser();
  const [clothes, setClothes] = useState<clothesType[] | null>(null);
  const [outfits, setOutfits] = useState<outfitType[] | null>(null);
  const [currentItem, setCurrentItem] = useState<clothesType>({ 
    name: '', image: '', modelFile: '', scale: 0.0, position: [0, 0, 0], description: '', type: null, creator: user 
  });
  const [currentOutfit, setCurrentOutfit] = useState<outfitType>({ 
    creator: user, top: undefined, mid: undefined, bottom: undefined 
  });
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [isOutfitModalOpen, setIsOutfitModalOpen] = useState<boolean>(false);

  const fetchUserDetails = async () => {
    if (!user?._id) return;
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
      alert("Error updating item");
    }
  };

  const saveOutfit = async (outfit: outfitType) => {
    try {
      const formData = new FormData();
      formData.append("outfit", JSON.stringify(outfit));

      const response = await axios.post("/api/updateOutfit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data;
      if (data.success) {
        setIsOutfitModalOpen(false);
        fetchUserDetails();
      } else {
        alert("Error while updating outfit! Try again");
      }
    } catch(err) {
      console.error('Error updating outfit', err);
    }
  };

  const handleOpenItemModal = (item: clothesType) => {
    setCurrentItem(item);
    setIsItemModalOpen(true);
  };

  const handleOpenOutfitModal = (outfit: outfitType) => {
    setCurrentOutfit(outfit);
    setIsOutfitModalOpen(true);
  };
  
  const handleCloseItemModal = () => {
    setIsItemModalOpen(false);
  };
  
  const handleCloseOutfitModal = () => {
    setIsOutfitModalOpen(false);
  };

  const deleteItem = async (id?: number) => {
    if (!id) {
      alert('Item ID is missing');
      return;
    }

    if (!confirm('Sei sicuro di voler eliminare questo capo?')) return;

    try {
      const response = await axios.delete(`/api/deleteItem?id=${id}`);
      if (response.data.success) {
        fetchUserDetails();
      } else {
        alert('Errore durante l\'eliminazione del capo');
      }
    } catch (err) {
      console.error('Error deleting item', err);
    }
  };

  const deleteOutfit = async (id?: number) => {
    if (!id) {
      alert('Outfit ID is missing');
      return;
    }

    if (!confirm('Sei sicuro di voler eliminare questo outfit?')) return;

    try {
      const response = await axios.delete(`/api/deleteOutfit?id=${id}`);
      if (response.data.success) {
        fetchUserDetails();
      } else {
        alert('Errore durante l\'eliminazione dell\'outfit');
      }
    } catch (err) {
      console.error('Error deleting outfit', err);
    }
  };

  useEffect(() => {
    if (user?._id) fetchUserDetails();
  }, [user?._id]);

  return (
    <>
      {isUserModalOpen && (
        <UserModal onClose={() => setIsUserModalOpen(false)} />
      )}
      {isItemModalOpen && (
        <ItemModal onSave={(item) => saveItem(item)} onClose={handleCloseItemModal} item={currentItem} />
      )}
      {isOutfitModalOpen && (
        <OutfitModal onSave={(outfit) => saveOutfit(outfit)} onClose={handleCloseOutfitModal} outfit={currentOutfit} items={clothes} />
      )}
      <section id='profile-section' className="w-full min-h-screen flex flex-col items-center justify-start overflow-hidden py-10">
        <h1 className='font-bold text-5xl bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent'>Profile</h1>
        <Image priority src={user?.pfp || "/default-pfp.png"} alt='Pfp' width={150} height={150} className='mt-12 rounded-full' />
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

        {/* Clothes Section */}
        <section id='clothes-section' className='w-full h-full flex flex-col justify-center items-center mt-32 mb-10'>
          <h1 className='font-bold text-5xl bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent py-10'>Your Clothes</h1>
          <div className='flex flex-col justify-center items-center w-full h-full'>
            <div className='grid grid-cols-3 w-full h-full px-5 p-10 gap-10'>
              {clothes && clothes.length > 0 ? (
                clothes.map((clothing, idx) => (
                  <div key={clothing._id || idx} className="relative group">
                    <Clothing item={clothing} onOpen={handleOpenItemModal} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(clothing._id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white hover:bg-red-50 text-red-600 rounded-full hover:scale-110 transition-all cursor-pointer z-10"
                      title="Delete item"
                    >
                      <Trash2Icon size={18} className="text-red-600 stroke-[2]" />
                    </button>
                  </div>
                ))
              ) : (
                <div className='font-bold text-2xl bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent my-10'>No clothes found</div>
              )}
            </div>
          </div>
        </section>

        {/* Outfit Section */}
        <section id='outfit-section' className='w-full h-full flex flex-col justify-center items-center my-10'>
          <h1 className='font-bold text-5xl bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent'>Your Outfits</h1>
          <div className='flex flex-col justify-center items-center w-full h-full'>
            <div className='grid grid-cols-3 w-full h-full px-5 p-10 gap-10'>
              {outfits && outfits.length > 0 ? (
                outfits.map((outfit, idx) => (
                  <div key={outfit._id || idx} className="relative group">
                    <Outfit item={outfit} onOpen={handleOpenOutfitModal} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteOutfit(outfit._id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white hover:bg-red-50 text-red-600 rounded-full hover:scale-110 transition-all cursor-pointer z-10"
                      title="Delete outfit"
                    >
                      <Trash2Icon size={18} className="text-red-600 stroke-[2]" />
                    </button>
                  </div>
                ))
              ) : (
                <div className='font-bold text-2xl bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent my-10'>No outfits found</div>
              )}
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default page;