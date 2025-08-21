import React, { useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap';
import { outfitType } from '@/lib/types'

const Outfit = ({ item, onOpen }: { item: outfitType, onOpen: (item: outfitType) => void }) => {

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
        <div className='clothing-card w-full h-full flex flex-col items-center justify-center shadow-lg rounded-2xl py-5 bg-white'>
            {item && (
                <>
                    <Image
                        className='font-bold text-xl'
                        src={item?.top?.image || ''}
                        alt={item?.top?.name || 'Top Image'}
                        width={120}
                        height={120}
                    />
                    <Image
                        className='font-bold text-xl'
                        src={item?.mid?.image || ''}
                        alt={item?.mid?.name || 'Mid Image'}
                        width={120}
                        height={120}
                    />
                    <Image
                        className='font-bold text-xl'
                        src={item?.bottom?.image || ''}
                        alt={item?.bottom?.name || 'Bottom Image'}
                        width={120}
                        height={120}
                    />
                    <button
                        className='my-4 px-6 py-3 rounded-xl font-semibold bg-gradient-to-br from-blue-500 to-indigo-700 text-white duration-200 transition-all hover:scale-105
                        cursor-pointer hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-800'
                        onClick={() => onOpen(item)}
                    >
                        Modify
                    </button>
                </>
            )}
        </div>
    )
}

export default Outfit
