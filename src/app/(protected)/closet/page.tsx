'use client';
import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from "react";
import gsap from "gsap";
import ItemModel from '@/app/components/ItemModal';
import ClosetRows from '@/app/components/ClosetRows';
import { useUser } from '@/app/context/UserContext';
import { clothesType, Position } from '@/lib/types';
import OptionController from '@/app/components/OptionController';
import Toast from '@/app/components/Toast';

const page = () => {
  const { user } = useUser();
  const [allItems, setAllItems] = useState<clothesType[]>([]);
  const [currentItemState, setCurrentItemState] = useState<{ top: number; mid: number; bottom: number }>({
    top: 0,
    mid: 0,
    bottom: 0
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [three, setThree] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  
  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/items');
      const data = response.data;
      setAllItems(data.clothes);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }

  const handleClick = (arrow: string, position: Position) => {
    const wrapper = document.getElementById(`${position}-wrapper`);
    const itemsOfType = allItems.filter(item => item.type === position);

    if (!wrapper || itemsOfType.length < 2) return;

    const tl = gsap.timeline();
    tl.to(wrapper, {
      opacity: 0,
      x: arrow === 'left' ? -500 : 500,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        setCurrentItemState(prev => {
          const currentIndex = prev[position];
          const maxIndex = itemsOfType.length - 1;

          const newIndex = arrow === 'left' ? currentIndex === 0 ? maxIndex : currentIndex - 1 : currentIndex === maxIndex ? 0 : currentIndex + 1;

          return { ...prev, [position]: newIndex };
        });
      }
    });
    tl.set(wrapper, {
      x: arrow === 'right' ? -500 : 500,
      opacity: 0,
    });
    tl.to(wrapper, {
      opacity: 1,
      x: 0,
      duration: 0.4,
      ease: 'power2.inOut',
    });
  };

  const buildOutfit = () => {
    if (!currentItemState.top || !currentItemState.mid || !currentItemState.bottom) {
      setMessage('Cannot build item without all 3 parts!');
      return;
    }

    const outfit: Record<Position, clothesType | undefined> = {
      top: allItems.filter(item => item.type === "top")[currentItemState.top],
      mid: allItems.filter(item => item.type === "mid")[currentItemState.mid],
      bottom: allItems.filter(item => item.type === "bottom")[currentItemState.bottom],
    };
    console.table(outfit);
  };

  const importItem = async (newItem: clothesType) => {
    const response = await axios.post('/api/import', {
      item: newItem
    });
    const data = response.data;

    setIsModalOpen(false);
    setAllItems(prev => [...prev, data.item]);
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
          y: 50
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
      <section id='closet-section' className="w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pt-10">
        <h1 className='font-bold text-5xl text-center mb-12 bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent'>Closet</h1>
        {message && (
          <Toast
            message={message}
            type={'error'}
            onClose={() => setMessage('')}
          />
        )}
        <OptionController setThree={setThree} setIsModalOpen={setIsModalOpen} buildOutfit={buildOutfit} />
        <div className='w-full h-full'>
          <ClosetRows
            currentItemState={currentItemState}
            handleClick={handleClick}
            three={three}
          />
        </div>
      </section>
      {isModalOpen && (
        <ItemModel onClose={() => setIsModalOpen(false)} onSave={(newItem) => importItem(newItem)} item={{ name: '', image: '', modelFile: '', scale: 0.0, position: [0, 0, 0], description: '', type: null, creator: user }} />
      )}
    </>
  )
}

export default page
