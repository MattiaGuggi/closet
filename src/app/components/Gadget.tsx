import { gadgetType } from "@/lib/types";
import Image from "next/image";
import { Edit3 } from "lucide-react";

const Gadget = ({ item, onOpen }: { item: gadgetType; onOpen: (item: gadgetType) => void }) => {
  // Clamp scale between 0.4 and 1.25 so previews stay legible and inside the box
  const thumbnailScale = Math.max(0.4, Math.min(item?.scale || 1, 1.25));

  return (
    <div className='clothing-card w-full rounded-3xl bg-zinc-900/60 border border-white/10 hover:border-violet-500/40 p-6 flex flex-col items-center justify-between backdrop-blur-xl shadow-xl transition-all duration-300 hover:scale-[1.02]'>
      <div className="text-center mb-4 relative z-10">
        <h3 className='font-bold text-white text-base truncate max-w-[200px]'>{item?.name || 'Gadget'}</h3>
        <p className='text-xs text-zinc-400 mt-0.5 truncate max-w-[200px]'>{item?.description || 'No description'}</p>
      </div>

      <div className="relative w-36 h-36 my-2 flex items-center justify-center bg-zinc-950/40 rounded-2xl border border-white/5 p-2 overflow-hidden pointer-events-none">
        {item?.image ? (
          <Image 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt={item.name || 'Gadget'} 
            src={item.image} 
            fill 
            className='object-contain p-2 transition-transform duration-300' 
            style={{ transform: `scale(${thumbnailScale})` }}
          />
        ) : (
          <div className="text-xs text-zinc-600">No Image</div>
        )}
      </div>

      <button
        className='relative z-20 mt-4 w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-zinc-800 hover:bg-zinc-900 text-white border border-white/10 transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer'
        onClick={(e) => {
          e.stopPropagation();
          onOpen(item);
        }}
      >
        <Edit3 className="w-3.5 h-3.5 text-violet-400" />
        <span>Modify</span>
      </button>
    </div>
  );
};

export default Gadget;