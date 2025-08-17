'use client';
import React, { useState } from 'react'
import { MoveLeft, MoveRight } from 'lucide-react';
import { useEffect } from "react";
import gsap from "gsap";
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, Html, useProgress } from '@react-three/drei'
import Scene from '@/app/components/scene';
import Modal from '@/app/components/modal';
import { items } from '@/lib/data';

const Loader = () => {
    const { progress } = useProgress()
    return <Html className="absolute" center>Loading {progress.toFixed(0)}%</Html>
}

const page = () => {
  const [itemState, setItemState] = useState<{ top: number; mid: number; bottom: number }>({top: 0, mid: 0, bottom: 0,});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


  const handleClick = (arrow: 'left' | 'right', position: 'top' | 'mid' | 'bottom') => {
    const wrapper = document.getElementById(`${position}-wrapper`);
    if (!wrapper) return;
    const tl = gsap.timeline();

    tl.to(wrapper, {
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
    tl.set(wrapper, {
      x: arrow === 'right' ? -350 : 350,
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

  const importItem = () => {
    setIsModalOpen(true);
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
          onClick={importItem}
        >
          Import new item
        </button>
        <div className='w-full h-full'>
          <section className='closet-row flex items-center justify-around h-[35vh]'>
            <MoveLeft className='cursor-pointer mx-10 scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('left', 'top')} />
            <div className="scene-wrapper w-full h-full" id="top-wrapper">
              <Canvas camera={{ position: [0, 1.5, 5], fov: 20 }}>
                <React.Suspense fallback={<Loader />}>
                  <Environment preset="sunset" />
                  <Scene item={items.top[itemState.top]} />
                  <OrbitControls enableDamping dampingFactor={0.05} enableZoom={false} />
                </React.Suspense>
              </Canvas>
            </div>
            <MoveRight className='cursor-pointer mx-10 scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('right', 'top')} />
          </section>
          <hr />
          <section className='closet-row flex items-center justify-around h-[35vh]'>
            <MoveLeft className='cursor-pointer mx-10 scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('left', 'mid')} />
            <div className="scene-wrapper w-full h-full" id="mid-wrapper">
              <Canvas camera={{ position: [0, 1.5, 5], fov: 20 }}>
                <React.Suspense fallback={<Loader />}>
                  <Environment preset="sunset" />
                  <Scene item={items.mid[itemState.mid]} />
                  <OrbitControls enableDamping dampingFactor={0.05} enableZoom={false} />
                </React.Suspense>
              </Canvas>
            </div>
            <MoveRight className='cursor-pointer mx-10 scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('right', 'mid')} />
          </section>
          <hr />
          <section className='closet-row flex items-center justify-around h-[35vh]'>
            <MoveLeft className='cursor-pointer mx-10 scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('left', 'bottom')} />
            <div className="scene-wrapper w-full h-full" id="bottom-wrapper">
              <Canvas camera={{ position: [0, 1.5, 5], fov: 20 }}>
                <React.Suspense fallback={<Loader />}>
                  <Environment preset="sunset" />
                  <Scene item={items.bottom[itemState.bottom]} />
                  <OrbitControls enableDamping dampingFactor={0.05} enableZoom={false} />
                </React.Suspense>
              </Canvas>
            </div>
            <MoveRight className='cursor-pointer mx-10 scale-150 duration-400 transition-all hover:scale-200' onClick={() => handleClick('right', 'bottom')} />
          </section>
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
        <Modal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  )
}

export default page
