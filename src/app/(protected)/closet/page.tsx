'use client';
import React, { useState } from 'react'
import { useEffect } from "react";
import gsap from "gsap";
import Modal from '@/app/components/modal';
import ClosetRows from '@/app/components/ClosetRows';
import { items, Position } from '@/lib/data';
import axios from 'axios';

type newItemType = {
  name: string;
  image: string;
  model: string;
  scale: number;
  position: [number, number, number];
  description: string;
  type: Position | null
};

const page = () => {
  const [itemState, setItemState] = useState<{ top: number; mid: number; bottom: number }>({top: 0, mid: 0, bottom: 0,});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [three, setThree] = useState<boolean>(false);

  const handleClick = (arrow: string, position: Position) => {
    const wrapper = document.getElementById(`${position}-wrapper`);
    if (!wrapper) return;
    const tl = gsap.timeline();

    tl.to(wrapper, {
      opacity: 0,
      x: arrow === 'left' ? -500 : 500,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        setItemState(prev => {
          const currentIndex = prev[position];
          const maxIndex = items[position].length - 1;

          let newIndex = arrow === 'left' ? currentIndex === 0 ? maxIndex : currentIndex - 1 : currentIndex === maxIndex ? 0 : currentIndex + 1;

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
    const outfit = {
      top: items.top[itemState.top],
      mid: items.mid[itemState.mid],
      bottom: items.bottom[itemState.bottom],
    };
    console.table(outfit);
  };

  const importItem = async (newItem: newItemType) => {
    const response = await axios.post('/api/import', {
      item: newItem
    });
    const data = response.data;

    console.log('Item imported: ', data);

    setIsModalOpen(false);
  };

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
      <section id='closet-section' className="w-full min-h-screen flex flex-col items-center justify-start overflow-hidden pt-10">
        <h1 className='font-bold text-5xl text-center text-white mb-12'>Closet</h1>
        <button
          className='shadow-lg px-6 py-3 my-16 cursor-pointer rounded-lg bg-gradient-to-br from-blue-500 to-indigo-800 duration-200 transition-all
          hover:scale-105 hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-900 text-white font-semibold text-lg'
          onClick={() => setIsModalOpen(true)}
        >
          Import new item
        </button>
        <label className="relative inline-flex items-center cursor-pointer">
          <input className="sr-only peer" value="" type="checkbox" />
            <div className="peer rounded-full outline-none duration-100 after:duration-500 w-28 h-14 bg-gradient-to-br from-blue-500 to-indigo-800
              after:content-['Img'] after:absolute after:outline-none after:rounded-full after:h-12 after:w-12
              after:bg-white after:top-1 after:left-1 after:flex after:justify-center after:items-center  after:text-blue-600 after:font-bold
              peer-checked:after:translate-x-14 peer-checked:after:content-['3D'] peer-checked:after:border-white"
              onClick={() => setThree(prev => !prev)}
            >
          </div>
        </label>
        <div className='w-full h-full'>
          <ClosetRows
            itemState={itemState}
            handleClick={handleClick}
            three={three}
          />
        </div>
        <button
          className='shadow-lg px-10 py-5 my-16 cursor-pointer rounded-xl bg-gradient-to-br from-blue-500 to-indigo-800 duration-200 transition-all
          hover:scale-105 hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-900 text-white font-semibold text-lg'
          onClick={buildOutfit}
        >
          Build outfit
        </button>
      </section>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} onSave={(newItem) => importItem(newItem)} />
      )}
    </>
  )
}

export default page
