import Image from 'next/image';
import React, { useState } from 'react';
import { clothesType, outfitType } from '@/lib/types';

type modalType = {
    onClose: () => void;
    onSave: (newOutfit: outfitType) => void;
    outfit: outfitType;
    items: clothesType[] | null;
};

const OutfitModal = ({ onClose, onSave, outfit, items }: modalType) => {
  const [newOutfit, setNewOutfit] = useState<outfitType>(outfit);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 min-h-screen">
        <div className='bg-white shadow-lg rounded-lg p-6 flex flex-col'>
            <div className='flex flex-col items-start gap-2'>
                <h2 className="text-2xl font-bold mb-4">Create An Outfit</h2>
            </div>
            <div className='flex items-center justify-center'>
                <select
                    name="top-input"
                    id="top-input"
                    value={newOutfit.top?.type ?? ""}
                    onChange={(e) => {
                        const option = e.target.value;
                        setNewOutfit(prev => {
                            return ({ ...prev, top: JSON.parse(option) })
                        });
                    }}
                >
                    <option value="">Choose</option>
                    {items && items.map((item) => {
                        if (item.type != "top") return;

                        return <option key={item._id} value={JSON.stringify(item)}>{item.name}</option>
                    })}
                </select>
                <Image src={newOutfit.top?.image || ''} width={100} height={100} alt='top-image' />
            </div>
            <div className='flex items-center justify-center'>
                <select
                    name="mid-input"
                    id="mid-input"
                    value={newOutfit.mid?.type ?? ""}
                    onChange={(e) => {
                        const option = e.target.value;
                        setNewOutfit(prev => {
                            return ({ ...prev, mid: JSON.parse(option) })
                        });
                    }}
                >
                    <option value="">Choose</option>
                    {items && items.map((item) => {
                        if (item.type != "mid") return;

                        return <option key={item._id} value={JSON.stringify(item)}>{item.name}</option>
                    })}
                </select>
                <Image src={newOutfit.mid?.image || ''} width={100} height={100} alt='mid-image' />
            </div>
            <div className='flex items-center justify-center'>
                <select
                    name="bottom-input"
                    id="bottom-input"
                    value={newOutfit.bottom?.type ?? ""}
                    onChange={(e) => {
                        const option = e.target.value;
                        setNewOutfit(prev => {
                            return ({ ...prev, bottom: JSON.parse(option) })
                        });
                    }}
                >
                    <option value="">Choose</option>
                    {items && items.map((item) => {
                        if (item.type != "bottom") return;

                        return <option key={item._id} value={JSON.stringify(item)}>{item.name}</option>
                    })}
                </select>
                <Image src={newOutfit.bottom?.image || ''} width={100} height={100} alt='bottom-image' />
            </div>

            {/* ACTION BUTTONS */}
            <div className='flex w-full justify-around mt-4'>
                <button className="cursor-pointer hover:scale-105 duration-200 transition-all w-1/4 px-4 py-2 text-lg font-semibold
                    bg-gradient-to-br from-blue-500 to-indigo-800 text-white rounded-lg"
                    onClick={() => onSave(newOutfit)}
                >
                    Save
                </button>
                <button className="cursor-pointer hover:scale-105 duration-200 transition-all w-1/4 px-4 py-2 text-lg font-semibold
                    text-red-500"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    </div>
  ); 
};

export default OutfitModal;
