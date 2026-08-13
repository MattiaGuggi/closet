import React, { useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap';
import { outfitType } from '@/lib/types'
import { Edit3 } from 'lucide-react'

const Outfit = ({ item, onOpen }: { item: outfitType, onOpen: (item: outfitType) => void }) => {

  useEffect(() => {
    gsap.set('.outfit-card', {
      opacity: 0,
      y: 30,
    });
    gsap.to('.outfit-card', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
    });
  }, []);

  return (
    <div className='outfit-card w-full rounded-3xl bg-zinc-900/60 border border-white/10 hover:border-purple-500/40 p-6 flex flex-col items-center justify-between backdrop-blur-xl shadow-xl transition-all duration-300 hover:scale-[1.02]'>
      {item && (
        <>
          <div className="w-full flex flex-col items-center gap-2 p-3 bg-zinc-950/40 rounded-2xl border border-white/5 my-2">
            {item?.top?.image && (
              <div className="relative w-20 h-20">
                <Image src={item.top.image} alt={item.top.name || 'Top'} fill className="object-contain" />
              </div>
            )}
            {item?.mid?.image && (
              <div className="relative w-20 h-20">
                <Image src={item.mid.image} alt={item.mid.name || 'Mid'} fill className="object-contain" />
              </div>
            )}
            {item?.bottom?.image && (
              <div className="relative w-20 h-20">
                <Image src={item.bottom.image} alt={item.bottom.name || 'Bottom'} fill className="object-contain" />
              </div>
            )}
          </div>

          <button
            className='mt-4 w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer'
            onClick={() => onOpen(item)}
          >
            <Edit3 className="w-3.5 h-3.5 text-purple-400" />
            <span>Modify Outfit</span>
          </button>
        </>
      )}
    </div>
  )
}

export default Outfit;