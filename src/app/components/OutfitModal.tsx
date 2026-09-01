'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { clothesType, outfitType } from '@/lib/types';
import { X, Sparkles, Layers, Check, Shirt } from 'lucide-react';

type modalType = {
  onClose: () => void;
  onSave: (newOutfit: outfitType) => void;
  outfit: outfitType;
  items: clothesType[] | null;
};

const OutfitModal = ({ onClose, onSave, outfit, items }: modalType) => {
  const [newOutfit, setNewOutfit] = useState<outfitType>(outfit);

  const handleSelect = (key: 'top' | 'mid' | 'bottom', selectedId: string) => {
    if (!items) return;
    const selectedItem = items.find((item) => String(item._id) === selectedId);
    setNewOutfit((prev) => ({ ...prev, [key]: selectedItem || undefined }));
  };

  const baseInputStyle =
    'w-full px-3.5 py-2.5 bg-zinc-950/60 border border-white/10 rounded-xl shadow-inner text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer';

  const labelStyle =
    'text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5';

  const positions: { key: 'top' | 'mid' | 'bottom'; label: string }[] = [
    { key: 'top', label: 'Top' },
    { key: 'mid', label: 'Mid' },
    { key: 'bottom', label: 'Bottom' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900/95 border border-white/10 shadow-2xl rounded-3xl p-6 sm:p-8 text-white backdrop-blur-2xl flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {outfit?._id ? 'Edit Outfit' : 'Create An Outfit'}
              </h2>
              <p className="text-xs text-zinc-400">Assemble top, mid, and bottom pieces into a complete look</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Outfit Selection Grid (3 Slots) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {positions.map(({ key, label }) => {
            const currentSelectedItem = newOutfit[key];
            const availableItems = items?.filter((item) => item.type === key) || [];

            return (
              <div key={key} className="flex flex-col gap-3 p-4 rounded-2xl bg-zinc-950/40 border border-white/5 shadow-inner">
                
                {/* Slot Label & Dropdown Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelStyle}>
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      {label}
                    </label>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {label}
                    </span>
                  </div>

                  <select
                    value={currentSelectedItem?._id ?? ''}
                    onChange={(e) => handleSelect(key, e.target.value)}
                    className={baseInputStyle}
                  >
                    <option value="" className="bg-zinc-900 text-zinc-500">
                      Select {label}...
                    </option>
                    {availableItems.map((item) => (
                      <option key={item._id} value={item._id} className="bg-zinc-900 text-zinc-100">
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Glassmorphic Image Preview Window */}
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10 bg-zinc-950/80 shadow-inner flex items-center justify-center bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:12px_12px]">
                  {currentSelectedItem?.image ? (
                    <div className="relative w-full h-full flex items-center justify-center p-2">
                      <Image
                        src={currentSelectedItem.image}
                        alt={currentSelectedItem.name || label}
                        fill
                        className="object-contain p-2 drop-shadow-xl"
                        style={{
                          transform: `scale(${currentSelectedItem.scale || 1})`,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-zinc-600">
                      <Shirt className="w-8 h-8 stroke-1" />
                      <span className="text-xs font-medium">No {label} Selected</span>
                    </div>
                  )}
                </div>

                {/* Item Name Indicator */}
                {currentSelectedItem && (
                  <div className="text-center">
                    <span className="text-xs font-semibold text-zinc-300 truncate block">
                      {currentSelectedItem.name}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(newOutfit)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Save Outfit
          </button>
        </div>

      </div>
    </div>
  );
};

export default OutfitModal;