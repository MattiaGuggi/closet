'use client';
import React, { useState } from 'react'
import { MoveLeft, MoveRight } from 'lucide-react';
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { items } from '@/lib/data';

const page = () => {
  const [itemState, setItemState] = useState<{ top: number; mid: number; bottom: number }>({top: 0, mid: 0, bottom: 0,});

  const handleClick = (arrow: string, position: 'top' | 'mid' | 'bottom') => {
    setItemState(prev => {
      const currentIndex = prev[position];
      const maxIndex = items[position].length - 1;

      let newIndex = arrow === 'left' ? currentIndex === 0 ? maxIndex : currentIndex - 1 : currentIndex === maxIndex ? 0 : currentIndex + 1;

      return { ...prev, [position]: newIndex };
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

  return (
    <section id='closet-section' className="w-full min-h-screen flex flex-col items-center justify-start overflow-hidden py-10">
      <h1 className='font-bold text-5xl text-center text-white'>Closet</h1>
      <div className='w-full h-full'>
        <div className='flex items-center justify-around h-[30vh] py-12'>
          <MoveLeft className='cursor-pointer scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('left', 'top')} />
          <div className="px-28">
            <p className='text-white text-xl font-semibold'>{items.top[itemState.top].name}</p>
          </div>
          <MoveRight className='cursor-pointer scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('right', 'top')} />
        </div>
        <hr />
        <div className='flex items-center justify-around h-[30vh] py-12'>
          <MoveLeft className='cursor-pointer scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('left', 'mid')} />
          <div className="px-28">
            <p className='text-white text-xl font-semibold'>{items.mid[itemState.mid].name}</p>
          </div>
          <MoveRight className='cursor-pointer scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('right', 'mid')} />
        </div>
        <hr />
        <div className='flex items-center justify-around h-[30vh] py-12'>
          <MoveLeft className='cursor-pointer scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('left', 'bottom')} />
          <div className="px-28">
            <p className='text-white text-xl font-semibold'>{items.bottom[itemState.bottom].name}</p>
          </div>
          <MoveRight className='cursor-pointer scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('right', 'bottom')} />
        </div>
      </div>
      <button
        className='shadow-lg px-10 py-5 cursor-pointer rounded-xl bg-gradient-to-br from-blue-500 to bg-indigo-800 duration-200 transition-all
        hover:scale-105 text-white font-semibold text-lg'
        onClick={buildOutfit}
      >
        Build outfit
      </button>
    </section>
  )
}

export default page
