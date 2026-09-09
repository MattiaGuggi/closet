'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import gsap from "gsap";
import ItemModel from '@/app/components/ItemModal';
import ClosetRows from '@/app/components/ClosetRows';
import { useUser } from '@/app/context/UserContext';
import OptionController from '@/app/components/OptionController';
import Toast from '@/app/components/Toast';
import { clothesType, EditableClothesType, Position } from '@/lib/types';
import { Sparkles } from 'lucide-react';

const ClosetPage = () => {
  const { user } = useUser();
  const [allItems, setAllItems] = useState<clothesType[]>([]);
  const [currentItemState, setCurrentItemState] = useState<{ top: number; mid: number; bottom: number }>({
    top: 0,
    mid: 0,
    bottom: 0
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [three, setThree] = useState<boolean>(false);
  
  // 1. Updated state to use strict toast typing
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  
  // 2. Added the unified showToast helper function
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };
  
  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/items');
      const data = response.data;
      setAllItems(data.clothes);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleClick = (arrow: string, position: Position) => {
    const wrapper = document.getElementById(`${position}-wrapper`);
    const itemsOfType = allItems.filter(item => item.type === position);

    if (!wrapper || itemsOfType.length < 2) return;

    const tl = gsap.timeline();
    tl.to(wrapper, {
      opacity: 0,
      x: arrow === 'left' ? -300 : 300,
      duration: 0.35,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentItemState(prev => {
          const currentIndex = prev[position];
          const maxIndex = itemsOfType.length - 1;

          const newIndex = arrow === 'left' 
            ? currentIndex === 0 ? maxIndex : currentIndex - 1 
            : currentIndex === maxIndex ? 0 : currentIndex + 1;

          return { ...prev, [position]: newIndex };
        });
      }
    });
    tl.set(wrapper, {
      x: arrow === 'right' ? -300 : 300,
      opacity: 0,
    });
    tl.to(wrapper, {
      opacity: 1,
      x: 0,
      duration: 0.35,
      ease: 'power2.inOut',
    });
  };

  const buildOutfit = async () => {
    const top = allItems.filter(item => item.type === "top")[currentItemState.top] || null;
    const mid = allItems.filter(item => item.type === "mid")[currentItemState.mid] || null;
    const bottom = allItems.filter(item => item.type === "bottom")[currentItemState.bottom] || null;

    if (!top || !mid || !bottom) {
      showToast('Cannot build outfit without all 3 parts!', 'error');
      return;
    }
    
    try {
      const response = await axios.post('/api/outfit', { top, mid, bottom, creator: user });
      const data = response.data;

      showToast('Outfit created successfully', 'success');
      console.table(data.outfit);
    } catch(err) {
      showToast('Outfit already created! Check your outfits in your profile', 'error');
    }
  };

  const importItem = async (item: EditableClothesType) => {
    // 1. Instantly close the modal BEFORE the await
    setIsModalOpen(false);
    
    // 2. Create an Optimistic "Fake" Item using a negative number for the temp ID
    const tempId = -Date.now(); 
    
    const optimisticItem = {
      ...item,
      _id: tempId,
      image: item.image, // The local blob preview URL
    } as unknown as clothesType;

    // 3. Instantly update the UI BEFORE the await
    setAllItems(prev => {
      const updatedList = [...prev, optimisticItem];
      
      if (optimisticItem.type) {
        const itemType = optimisticItem.type as Position;
        const itemsOfType = updatedList.filter(i => i.type === itemType);
        setCurrentItemState(posPrev => ({
          ...posPrev,
          [itemType]: itemsOfType.length - 1
        }));
      }

      return updatedList;
    });

    showToast('Saving item to wardrobe...', 'info');

    // 4. Prepare the upload data
    const formData = new FormData();
    formData.append("item", JSON.stringify(item));
    if (item.imageFile) formData.append("image", item.imageFile);
    if (item.modelFileFile) formData.append("model", item.modelFileFile);
    formData.append("name", item.name);
    formData.append("scale", String(item.scale));
    formData.append("description", item.description);
    formData.append("position", JSON.stringify(item.position));
    if (item.type) formData.append("type", item.type);

    // 5. NOW we await the network request
    try {
      const response = await axios.post("/api/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data;
      if (data.success && data.item) {
        const realItem: clothesType = data.item;

        // Success: Silently swap the temporary item for the real database item
        setAllItems(prev => prev.map(i => i._id === tempId ? realItem : i));
        showToast('Item saved successfully!', 'success');
      } else {
        throw new Error("Server failed to save item");
      }
    } catch (err) {
      console.error("Background upload failed:", err);
      
      // Failure: Rollback the Optimistic UI
      setAllItems(prev => {
        const filteredList = prev.filter(i => i._id !== tempId);
        
        // Fix the carousel index so it doesn't point to an empty slot
        if (optimisticItem.type) {
          const itemType = optimisticItem.type as Position;
          const itemsOfType = filteredList.filter(i => i.type === itemType);
          setCurrentItemState(posPrev => ({
            ...posPrev,
            [itemType]: Math.max(0, Math.min(posPrev[itemType], itemsOfType.length - 1))
          }));
        }
        return filteredList;
      });

      showToast('Failed to upload item. Please try again.', 'error');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".closet-row");

    for(const section of sections) {
      const tl = gsap.timeline();
      
      tl.fromTo(section, {
          opacity: 0,
          y: 40
        }, {
          opacity: 1,
          y: 0,
          duration: 0.5
        }
      );
    }
  }, []);

  return (
    <>
      <section id='closet-section' className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col items-center">
        
        {/* Title Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Studio
          </div>
          <h1 className='text-3xl sm:text-4xl font-extrabold text-white tracking-tight'>Closet Canvas</h1>
        </div>

        {/* 3. Updated Toast rendering */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Option HUD Controls */}
        <OptionController setThree={setThree} setIsModalOpen={setIsModalOpen} buildOutfit={buildOutfit} />

        {/* Carousel Rows: Passiamo allItems come prop */}
        <div className='w-full'>
          <ClosetRows
            items={allItems}
            currentItemState={currentItemState}
            handleClick={handleClick}
            three={three}
          />
        </div>
      </section>

      {isModalOpen && (
        <ItemModel 
          onClose={() => setIsModalOpen(false)} 
          onSave={(newItem) => importItem(newItem)} 
          item={{ name: '', image: '', modelFile: '', scale: 0.0, position: [0, 0, 0], description: '', type: null, creator: user }} 
        />
      )}
    </>
  );
};

export default ClosetPage;