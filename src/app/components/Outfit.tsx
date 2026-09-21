import Image from 'next/image'
import { outfitType } from '@/lib/types'
import { Edit3 } from 'lucide-react'

const Outfit = ({ item, onOpen }: { item: outfitType, onOpen: (item: outfitType) => void }) => {
  // Check if any top layers exist
  const hasTop = item?.top?.base || item?.top?.mid || item?.top?.outer;

  return (
    <div className='outfit-card w-full rounded-3xl bg-zinc-900/60 border border-white/10 hover:border-indigo-500/40 p-6 flex flex-col items-center justify-between backdrop-blur-xl shadow-xl transition-all duration-300 hover:scale-[1.02]'>
      {item && (
        <>
          {/* 
            FIXED HEIGHT ROW: h-24 sm:h-28 ensures the card NEVER resizes.
            The items use 'h-full aspect-square' to automatically fit cleanly inside.
          */}
          <div className="w-full h-24 sm:h-28 flex flex-row items-center justify-center gap-3 sm:gap-5 p-3 bg-zinc-950/40 rounded-2xl border border-white/5 my-2 pointer-events-none">
            
            {/* 1. TOP SLOT (Z-Index Layered) */}
            {hasTop && (
              <div className="relative h-full aspect-square rounded-xl bg-zinc-900/50 border border-white/5 shadow-inner overflow-hidden">
                {item?.top?.base?.image && (
                  <Image src={item.top.base.image} alt={item.top.base.name || 'Base'} sizes="(max-width: 768px) 33vw, 20vw" fill className="absolute inset-0 object-contain p-1.5 z-10 drop-shadow-md" />
                )}
                {item?.top?.mid?.image && (
                  <Image src={item.top.mid.image} alt={item.top.mid.name || 'Mid'} sizes="(max-width: 768px) 33vw, 20vw" fill className="absolute inset-0 object-contain p-1.5 z-20 drop-shadow-md" />
                )}
                {item?.top?.outer?.image && (
                  <Image src={item.top.outer.image} alt={item.top.outer.name || 'Outer'} sizes="(max-width: 768px) 33vw, 20vw" fill className="absolute inset-0 object-contain p-1.5 z-30 drop-shadow-md" />
                )}
              </div>
            )}

            {/* 2. PANTS SLOT */}
            {item?.mid?.image && (
              <div className="relative h-full aspect-square rounded-xl bg-zinc-900/50 border border-white/5 shadow-inner overflow-hidden">
                <Image src={item.mid.image} alt={item.mid.name || 'Mid'} sizes="(max-width: 768px) 33vw, 20vw" fill className="absolute inset-0 object-contain p-1.5 drop-shadow-md" />
              </div>
            )}

            {/* 3. SHOES SLOT */}
            {item?.bottom?.image && (
              <div className="relative h-full aspect-square rounded-xl bg-zinc-900/50 border border-white/5 shadow-inner overflow-hidden">
                <Image src={item.bottom.image} alt={item.bottom.name || 'Bottom'} sizes="(max-width: 768px) 33vw, 20vw" fill className="absolute inset-0 object-contain p-1.5 drop-shadow-md" />
              </div>
            )}
            
          </div>

          <button
            className='relative z-20 mt-4 w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-zinc-800 hover:bg-zinc-900 text-white border border-white/10 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer'
            onClick={(e) => {
              e.stopPropagation();
              onOpen(item);
            }}
          >
            <Edit3 className="w-3.5 h-3.5 text-purple-400" />
            <span>Modify</span>
          </button>
        </>
      )}
    </div>
  )
}

export default Outfit;