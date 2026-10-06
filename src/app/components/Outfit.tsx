import Image from 'next/image'
import { outfitType } from '@/lib/types'
import { Bookmark, Edit3, Trash2Icon } from 'lucide-react'
import useClosetAPI from '../hooks/useClosetAPI';
import { useUser } from '../context/UserContext';

interface OutfitProps {
  item: outfitType;
  onOpen: (item: outfitType) => void;
  onToggleWishlist: (item: outfitType, action: 'add' | 'remove') => void;
  onDelete: (id: string | number | undefined, type: 'Outfit', endpoint: string) => void;
}

const Outfit = ({ item, onOpen, onToggleWishlist, onDelete }: OutfitProps) => {
  const hasTop = item?.top?.base || item?.top?.mid || item?.top?.outer;
  const isWishlisted = item?.isWishlisted || false;
  const wishlistButtonTitle = isWishlisted ? "Remove from wishlist" : "Add to wishlist";
  const classNameForWishlistButton = isWishlisted ? "hover:bg-zinc-900/80 bg-blue-500/20 hover:text-zinc-400 text-blue-400" : "bg-zinc-900/80 hover:bg-blue-500/20 text-zinc-400 hover:text-blue-400";

  return (
    
    <div className="relative group transition-transform hover:scale-[1.02]">
      <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(item, isWishlisted ? 'remove' : 'add'); }} className={classNameForWishlistButton + " absolute top-4 left-4 p-2.5 rounded-xl border border-white/10 transition-all hover:scale-110 cursor-pointer z-30 backdrop-blur-md pointer-events-auto"} title={wishlistButtonTitle}>
        <Bookmark className="w-4 h-4" />
      </button>
      <div className='outfit-card w-full rounded-3xl bg-zinc-900/60 border border-white/10 hover:border-indigo-500/40 p-6 flex flex-col items-center justify-between backdrop-blur-xl shadow-xl transition-all duration-300 hover:scale-[1.02]'>
        {item && (
          <>
            <div className="w-full h-24 sm:h-28 flex flex-row items-center justify-center gap-3 sm:gap-5 p-3 bg-zinc-950/40 rounded-2xl border border-white/5 my-2 pointer-events-none">
              
              {/* TOP SLOT */}
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

              {/* PANTS SLOT */}
              {item?.mid?.image && (
                <div className="relative h-full aspect-square rounded-xl bg-zinc-900/50 border border-white/5 shadow-inner overflow-hidden">
                  <Image src={item.mid.image} alt={item.mid.name || 'Mid'} sizes="(max-width: 768px) 33vw, 20vw" fill className="absolute inset-0 object-contain p-1.5 drop-shadow-md" />
                </div>
              )}

              {/* SHOES SLOT */}
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
      <button onClick={(e) => { e.stopPropagation(); onDelete(item._id, 'Outfit', '/api/deleteOutfit'); }} className="absolute top-4 right-4 p-2.5 bg-zinc-900/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-xl border border-white/10 transition-all hover:scale-110 cursor-pointer z-30 backdrop-blur-md pointer-events-auto" title="Delete outfit">
        <Trash2Icon className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Outfit;