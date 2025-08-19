import React from 'react'
import Image from 'next/image'
import { outfitType } from '@/lib/types'

const Outfit = ({ item }: { item: outfitType }) => {
    return (
        <div className='w-full h-full flex flex-col items-center justify-center shadow-lg rounded-2xl'>
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
