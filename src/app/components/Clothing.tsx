import React from 'react'
import { clothesType } from '@/lib/types'
import Image from 'next/image'

const Clothing = ({ item }: { item: clothesType }) => {
  return (
    <div className='w-full h-full bg-white flex flex-col items-center justify-center'>
        <h1 className='font-bold text-xl py-5'>{item.name}</h1>
        <p className='font-bold text-lg py-5'>{item.description}</p>
        <Image alt='Outfit image' src={item?.image} width={120} height={120} className='' />
    </div>
  )
}

export default Clothing
