import React, { useEffect } from 'react'
import { clothesType } from '@/lib/types'
import Image from 'next/image'
import gsap from 'gsap'

const Clothing = ({ item, onOpen }: { item: clothesType, onOpen: (item: clothesType) => void }) => {

  useEffect(() => {
    gsap.set('.clothing-card', {
      opacity: 0,
      y: 120,
    });
    gsap.to('.clothing-card', {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.2,
      ease: 'power2.out',
    });
  }, []);

  return (
    <>
      <div className='clothing-card w-full h-full flex flex-col items-center justify-center shadow-lg rounded-2xl py-5'
      >
          <h1 className='font-bold text-xl my-3'>{item?.name}</h1>
          <p className='font-semibold text-base mb-8'>{item?.description}</p>
          <Image alt='Outfit image' src={item?.image || ''} width={120} height={120} className='' />
          <button
            className='my-4 px-6 py-3 rounded-xl font-semibold bg-gradient-to-br from-blue-500 to-indigo-700 text-white duration-200 transition-all hover:scale-105
            cursor-pointer'
            onClick={() => onOpen(item)}
          >
            Modify
          </button>
      </div>
    </>
  )
}

export default Clothing
