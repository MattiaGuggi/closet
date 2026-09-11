'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import gsap from "gsap";
import ItemModel from '@/app/components/ItemModal';
import ClosetRows from '@/app/components/ClosetRows';
import { useUser } from '@/app/context/UserContext';
import OptionController from '@/app/components/OptionController';
import Toast from '@/app/components/Toast';
import { clothesType, EditableClothesType, gadgetType, OutfitPart } from '@/lib/types';
import { Sparkles, ChevronLeft, ChevronRight, Watch } from 'lucide-react';
import Image from 'next/image';

const ClosetPage = () => {
  const { user } = useUser();
  const [allItems, setAllItems] = useState<clothesType[]>([]);
  const [allGadgets, setAllGadgets] = useState<gadgetType[]>([]);
  
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
      setAllGadgets(data.gadgets);
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
    
    if (!wrapper || allGadgets.length < 2) return;

    const tl = gsap.timeline();
    tl.to(wrapper, {
      opacity: 0,
      x: arrow === 'left' ? -100 : 100,
      duration: 0.2,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentGadgetIndex(prev => {
          const maxIndex = allGadgets.length - 1;
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
      if (response.data.success)
        showToast('Outfit created successfully', 'success');
    } catch(err) {
      showToast('Outfit already created! Check your outfits in your profile', 'error');
    }
  };

  const importItem = async (item: EditableClothesType, choice: string) => {
    setIsModalOpen(false);
    const tempId = -Date.now(); 
    const optimisticItem = { ...item, _id: tempId, image: item.image } as unknown as clothesType;

    const isGadget = choice.toLowerCase() === 'gadget';
    
    showToast(`Saving ${isGadget ? 'gadget' : 'item'} to wardrobe...`, 'info');

    if (isGadget) {
      setAllGadgets(prev => {
        const updatedList = [...prev, optimisticItem as unknown as gadgetType];
        setCurrentGadgetIndex(updatedList.length - 1);
        return updatedList;
      });
    } else {
      setAllItems(prev => {
        const updatedList = [...prev, optimisticItem];
        if (optimisticItem.type) {
          const itemType = optimisticItem.type as OutfitPart;
          const itemsOfType = updatedList.filter(i => i.type === itemType);
          setCurrentItemState(posPrev => ({
            ...posPrev,
            [itemType]: itemsOfType.length - 1
          }));
        }
        return updatedList;
      });
    }

    const formData = new FormData();
    formData.append(isGadget ? "gadget" : "item", JSON.stringify(item));
    
    if (item.imageFile) formData.append("image", item.imageFile);
    if (item.modelFileFile) formData.append("model", item.modelFileFile);
    formData.append("name", item.name);
    formData.append("scale", String(item.scale));
    formData.append("description", item.description);
    formData.append("position", JSON.stringify(item.position));
    if (item.type) formData.append("type", item.type);

    const endpoint = isGadget ? '/api/gadget' : '/api/import';

    try {
      const response = await axios.post(endpoint, formData, { 
        headers: { "Content-Type": "multipart/form-data" } 
      });
      
      const savedItem = response.data.item || response.data.data;

      if (response.data.success && savedItem) {
        if (isGadget) {
          setAllGadgets(prev => prev.map(i => i._id === tempId ? (savedItem as gadgetType) : i));
        } else {
          setAllItems(prev => prev.map(i => i._id === tempId ? savedItem : i));
        }
        showToast(`${isGadget ? 'Gadget' : 'Item'} saved successfully!`, 'success');
      } else {
        throw new Error(`Server failed to save ${isGadget ? 'gadget' : 'item'}`);
      }
    } catch (err) {
      if (isGadget) {
        setAllGadgets(prev => prev.filter(i => i._id !== tempId));
      } else {
        setAllItems(prev => prev.filter(i => i._id !== tempId));
      }
      showToast(`Failed to upload ${isGadget ? 'gadget' : 'item'}. Please try again.`, 'error');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".closet-row, .gadget-box");
    for(const section of sections) {
      gsap.fromTo(section, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5 });
    }
  }, []);

  const currentGadget = allGadgets[currentGadgetIndex];

  return (
    <>
      <section id='closet-section' className="w-full max-w-[1500px] py-8 flex flex-col items-center">
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
          <div className="gadget-box w-full max-w-sm lg:max-w-none lg:w-[280px] bg-zinc-900/70 border border-white/10 rounded-3xl p-5 backdrop-blur-3xl shadow-2xl flex flex-col mt-8 lg:mt-0 lg:absolute lg:right-0 xl:-right-12 lg:top-24 z-30">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-[11px] font-bold uppercase tracking-wider text-violet-400 backdrop-blur-md shadow-sm flex items-center gap-1.5">
                <Watch className="w-4 h-4" /> Gadgets
              </span>
            </div>
            
            <div className="relative flex items-center justify-between w-full h-[200px] bg-zinc-950/50 border border-white/5 hover:border-violet-500/10 transition-colors duration-500 rounded-2xl p-2 group overflow-hidden shadow-inner">
              
              <button 
                onClick={() => handleGadgetClick('left')} 
                className="shrink-0 p-2.5 rounded-2xl bg-zinc-900/80 hover:bg-violet-600 text-zinc-400 hover:text-white border border-white/5 hover:border-violet-500/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all hover:scale-110 active:scale-95 cursor-pointer z-20 backdrop-blur-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div id="gadget-carousel-wrapper" className="flex-1 min-w-0 h-full relative flex flex-col items-center justify-center px-1">
                {currentGadget ? (
                  <>
                    <div className="relative w-24 h-24 mb-2 shrink-0">
                      <Image 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        src={currentGadget.image} 
                        alt={currentGadget.name} 
                        fill 
                        className="object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] pointer-events-none" 
                        style={{ transform: `scale(${Math.max(0.4, Math.min(currentGadget?.scale || 1, 1.25))})` }} 
                      />
                    </div>
                    <p className="w-full text-xs font-bold text-zinc-100 text-center drop-shadow-md break-words line-clamp-2 leading-tight px-1">
                      {currentGadget.name}
                    </p>
                  </>
                ) : (
                  <span className="text-xs text-zinc-600 font-medium uppercase tracking-wider">No Gadgets</span>
                )}
              </div>
              
              {/* Added shrink-0 */}
              <button 
                onClick={() => handleGadgetClick('right')} 
                className="shrink-0 p-2.5 rounded-2xl bg-zinc-900/80 hover:bg-violet-600 text-zinc-400 hover:text-white border border-white/5 hover:border-violet-500/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all hover:scale-110 active:scale-95 cursor-pointer z-20 backdrop-blur-md"
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
          onSave={(newItem, choice) => importItem(newItem, choice)} 
          item={{ name: '', image: '', modelFile: '', scale: 0.0, position: [0, 0, 0], description: '', type: null, creator: user }} 
        />
      )}
    </>
  );
};

export default ClosetPage;