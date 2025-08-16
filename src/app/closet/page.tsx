'use client';
import React, { useState } from 'react'
import { MoveLeft, MoveRight } from 'lucide-react';
import { useEffect } from "react";
import gsap from "gsap";
import Scene from '../components/scene';
import { items } from '@/lib/data';

const page = () => {
  const [itemState, setItemState] = useState<{ top: number; mid: number; bottom: number }>({top: 0, mid: 0, bottom: 0,});

  const handleClick = (arrow: string, position: 'top' | 'mid' | 'bottom') => {
    const currentItem = items[position][itemState[position]];
    const tl = gsap.timeline();

    tl.to(`#${currentItem.name}-scene`, {
      opacity: 0,
      x: arrow === 'left' ? -350 : 350,
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
    tl.set(`#${currentItem.name}-scene`, {
      x: arrow === 'right' ? -350 : 350,
      opacity: 0,
    });
    tl.to(`#${currentItem.name}-scene`, {
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
    <section id='closet-section' className="w-full min-h-screen flex flex-col items-center justify-start overflow-hidden py-10">
      <h1 className='font-bold text-5xl text-center text-white'>Closet</h1>
      <div className='w-full h-full'>
        <section className='closet-row flex items-center justify-around h-[30vh] py-12'>
          <MoveLeft className='cursor-pointer scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('left', 'top')} />
          <div className="px-28">
            <Scene item={items.top[itemState.top]} />
          </div>
          <MoveRight className='cursor-pointer scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('right', 'top')} />
        </section>
        <hr />
        <section className='closet-row flex items-center justify-around h-[30vh] py-12'>
          <MoveLeft className='cursor-pointer scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('left', 'mid')} />
          <div className="px-28">
            <Scene item={items.mid[itemState.mid]} />
          </div>
          <MoveRight className='cursor-pointer scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('right', 'mid')} />
        </section>
        <hr />
        <section className='closet-row flex items-center justify-around h-[30vh] py-12'>
          <MoveLeft className='cursor-pointer scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('left', 'bottom')} />
          <div className="px-28">
            <Scene item={items.bottom[itemState.bottom]} />
          </div>
          <MoveRight className='cursor-pointer scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('right', 'bottom')} />
        </section>
      </div>
      <button
        className='shadow-lg px-10 py-5 cursor-pointer rounded-xl bg-gradient-to-br from-blue-500 to-indigo-800 duration-200 transition-all
        hover:scale-105 hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-900 text-white font-semibold text-lg'
        onClick={buildOutfit}
      >
        Build outfit
      </button>
    </section>
  )
}

export default page
