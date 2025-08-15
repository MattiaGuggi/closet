'use client';
import React, { useState } from 'react'
import { MoveLeft, MoveRight } from 'lucide-react';
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { items } from '@/lib/items';

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

  return (
    <>
      <h1 className='font-bold text-5xl text-center'>Closet</h1>
      <div className='w-full h-full'>
        <div className='flex items-center justify-around h-[30vh] py-12'>
          <MoveLeft className='cursor-pointer scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('left', 'top')} />
          <div className="px-28">
            {items.top[itemState.top].name}
          </div>
          <MoveRight className='cursor-pointer scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('right', 'top')} />
        </div>
        <hr />
        <div className='flex items-center justify-around h-[30vh] py-12'>
          <MoveLeft className='cursor-pointer scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('left', 'mid')} />
          <div className="px-28">
            {items.mid[itemState.mid].name}
          </div>
          <MoveRight className='cursor-pointer scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('right', 'mid')} />
        </div>
        <hr />
        <div className='flex items-center justify-around h-[30vh] py-12'>
          <MoveLeft className='cursor-pointer scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('left', 'bottom')} />
          <div className="px-28">
            {items.bottom[itemState.bottom].name}
          </div>
          <MoveRight className='cursor-pointer scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('right', 'bottom')} />
        </div>
      </div>
    </>
  )
}

export default page
