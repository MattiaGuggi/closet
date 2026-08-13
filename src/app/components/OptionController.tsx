import React from 'react'
import { Box, Plus, Sparkles } from 'lucide-react';

type optionControllerType = {
  setThree: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  buildOutfit: () => void;
};

const OptionController = ({ setThree, setIsModalOpen, buildOutfit }: optionControllerType) => {
  return (
    <div className='w-full flex justify-center mb-8 z-30'>
      <div className='flex flex-wrap items-center gap-4 px-6 py-3 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-2xl shadow-2xl'>
        
        {/* 3D Mode Toggle */}
        <div className="flex items-center gap-3 pr-4 border-r border-white/10">
          <Box className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-zinc-300">3D Mode</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              className="sr-only peer" 
              type="checkbox" 
              onChange={(e) => setThree(e.target.checked)}
            />
            <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Action Buttons */}
        <button
          className='flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 transition-all hover:scale-105 cursor-pointer'
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-3.5 h-3.5 text-indigo-400" />
          <span>Import Item</span>
        </button>

        <button
          className='flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 cursor-pointer'
          onClick={buildOutfit}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Build Outfit</span>
        </button>

      </div>
    </div>
  )
}

export default OptionController;