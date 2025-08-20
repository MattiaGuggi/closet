import React, { useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap';
import { outfitType } from '@/lib/types'

const Outfit = ({ item }: { item: outfitType }) => {

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
        <div className='w-full h-full flex flex-col items-center justify-center shadow-lg rounded-2xl bg-white'>
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
                </>
            )}
        </div>
    )
}

export default Outfit
