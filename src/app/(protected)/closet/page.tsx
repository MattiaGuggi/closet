'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import gsap from "gsap";
import ItemModel from '@/app/components/ItemModal';
import ClosetRows from '@/app/components/ClosetRows';
import { useUser } from '@/app/context/UserContext';
import OptionController from '@/app/components/OptionController';
import Toast from '@/app/components/Toast';
import { clothesType, EditableClothesType, OutfitPart } from '@/lib/types';
import { Sparkles, ChevronLeft, ChevronRight, Watch } from 'lucide-react';
import Image from 'next/image';

const ClosetPage = () => {
  const { user } = useUser();
  const [allItems, setAllItems] = useState<clothesType[]>([]);
  
  const [currentItemState, setCurrentItemState] = useState<Record<OutfitPart, number>>({
    top: 0,
    mid: 0,
    bottom: 0
  });

  // Gadget specific state
  const [currentGadgetIndex, setCurrentGadgetIndex] = useState<number>(0);
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [three, setThree] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  
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

  const handleClick = (arrow: string, position: OutfitPart) => {
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
    tl.set(wrapper, { x: arrow === 'right' ? -300 : 300, opacity: 0 });
    tl.to(wrapper, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.inOut' });
  };

  const handleGadgetClick = (arrow: 'left' | 'right') => {
    const wrapper = document.getElementById('gadget-carousel-wrapper');
    const gadgets = allItems.filter(item => item.type === "gadget");
    
    if (!wrapper || gadgets.length < 2) return;

    const tl = gsap.timeline();
    tl.to(wrapper, {
      opacity: 0,
      x: arrow === 'left' ? -150 : 150,
      duration: 0.35,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentGadgetIndex(prev => {
          const maxIndex = gadgets.length - 1;
          return arrow === 'left' 
            ? prev === 0 ? maxIndex : prev - 1 
            : prev === maxIndex ? 0 : prev + 1;
        });
      }
    });
    tl.set(wrapper, { x: arrow === 'right' ? -150 : 150, opacity: 0 });
    tl.to(wrapper, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.inOut' });
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
      showToast('Outfit created successfully', 'success');
    } catch(err) {
      showToast('Outfit already created! Check your outfits in your profile', 'error');
    }
  };

  const importItem = async (item: EditableClothesType) => {
    setIsModalOpen(false);
    const tempId = -Date.now(); 
    const optimisticItem = { ...item, _id: tempId, image: item.image } as unknown as clothesType;

    setAllItems(prev => {
      const updatedList = [...prev, optimisticItem];
      if (optimisticItem.type && optimisticItem.type !== "gadget") {
        const itemType = optimisticItem.type as OutfitPart;
        const itemsOfType = updatedList.filter(i => i.type === itemType);
        setCurrentItemState(posPrev => ({
          ...posPrev,
          [itemType]: itemsOfType.length - 1
        }));
      } else if (optimisticItem.type === "gadget") {
        const gadgets = updatedList.filter(i => i.type === "gadget");
        setCurrentGadgetIndex(gadgets.length - 1);
      }
      return updatedList;
    });

    showToast('Saving item to wardrobe...', 'info');

    const formData = new FormData();
    formData.append("item", JSON.stringify(item));
    if (item.imageFile) formData.append("image", item.imageFile);
    if (item.modelFileFile) formData.append("model", item.modelFileFile);
    formData.append("name", item.name);
    formData.append("scale", String(item.scale));
    formData.append("description", item.description);
    formData.append("position", JSON.stringify(item.position));
    if (item.type) formData.append("type", item.type);

    try {
      const response = await axios.post("/api/import", formData, { headers: { "Content-Type": "multipart/form-data" } });
      if (response.data.success && response.data.item) {
        setAllItems(prev => prev.map(i => i._id === tempId ? response.data.item : i));
        showToast('Item saved successfully!', 'success');
      } else {
        throw new Error("Server failed to save item");
      }
    } catch (err) {
      setAllItems(prev => prev.filter(i => i._id !== tempId));
      showToast('Failed to upload item. Please try again.', 'error');
    }
  };

  useEffect(() => { fetchItems(); }, []);

  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".closet-row, .gadget-box");
    for(const section of sections) {
      gsap.fromTo(section, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5 });
    }
  }, []);

  const gadgetsList = allItems.filter(item => item.type === "gadget");
  const currentGadget = gadgetsList[currentGadgetIndex];

  return (
    <>
      <section id='closet-section' className="w-full max-w-[1500px] mx-auto px-6 py-8 flex flex-col items-center">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Studio
          </div>
          <h1 className='text-3xl sm:text-4xl font-extrabold text-white tracking-tight'>Closet Canvas</h1>
        </div>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <OptionController setThree={setThree} setIsModalOpen={setIsModalOpen} buildOutfit={buildOutfit} />
        <div className='relative w-full flex flex-col items-center mt-6'>
          <div className='w-full max-w-4xl z-10'>
            <ClosetRows items={allItems} currentItemState={currentItemState} handleClick={handleClick} three={three} />
          </div>
          <div className="gadget-box w-full max-w-sm lg:max-w-none lg:w-[280px] bg-zinc-900/70 border border-white/10 rounded-3xl p-5 backdrop-blur-3xl shadow-2xl flex flex-col mt-8 lg:mt-0 lg:absolute lg:right-4 lg:top-24 z-30">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-white/10 text-[11px] font-bold uppercase tracking-wider text-purple-400 backdrop-blur-md shadow-sm flex items-center gap-1.5">
                <Watch className="w-4 h-4" /> Gadgets
              </span>
            </div>
            <div className="relative flex items-center justify-between w-full h-[200px] bg-zinc-950/50 border border-white/5 rounded-2xl p-2 group overflow-hidden shadow-inner">
              <button 
                onClick={() => handleGadgetClick('left')} 
                className="p-2.5 rounded-2xl bg-zinc-900/80 hover:bg-purple-600 text-zinc-300 hover:text-white border border-white/10 transition-all hover:scale-110 active:scale-95 cursor-pointer z-20 backdrop-blur-md shadow-xl"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div id="gadget-carousel-wrapper" className="flex-1 h-full relative flex flex-col items-center justify-center px-2">
                {currentGadget ? (
                  <>
                    <div className="relative w-28 h-28 mb-3">
                      <Image 
                        src={currentGadget.image} 
                        alt={currentGadget.name} 
                        fill 
                        className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] pointer-events-none" 
                      />
                    </div>
                    <span className="text-xs font-bold text-zinc-200 truncate max-w-full px-2 text-center drop-shadow-md">
                      {currentGadget.name}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-zinc-600 font-medium uppercase tracking-wider">No Gadgets</span>
                )}
              </div>
              <button 
                onClick={() => handleGadgetClick('right')} 
                className="p-2.5 rounded-2xl bg-zinc-900/80 hover:bg-purple-600 text-zinc-300 hover:text-white border border-white/10 transition-all hover:scale-110 active:scale-95 cursor-pointer z-20 backdrop-blur-md shadow-xl"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
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