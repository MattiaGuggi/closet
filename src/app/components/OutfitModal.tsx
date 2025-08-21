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
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleSelect = (key: "top" | "mid" | "bottom", selectedId: string) => {
        if (!items) return;
        const selectedItem = items.find((item) => String(item._id) === selectedId);
        setNewOutfit((prev) => ({ ...prev, [key]: selectedItem || null }));
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 min-h-screen">
            <div className='bg-white shadow-lg rounded-lg p-6 flex flex-col w-1/3'>
                <h2 className="text-2xl font-bold mb-4">Create An Outfit</h2>

                {/* TOP */}
                <div className='flex items-center justify-start py-5'>
                    <select
                        id="top-input"
                        value={newOutfit.top?._id ?? ""}
                        onFocus={() => setIsOpen(true)}
                        onBlur={() => setIsOpen(false)}
                        onChange={(e) => handleSelect("top", e.target.value)}
                        className={`w-1/2 mx-6 border rounded-lg px-4 py-2 text-lg ${isOpen} ? 'rounded-t-md rounded-b-none' : 'rounded-md'`}
                    >
                        {items?.filter(item => item.type === "top").map((item, idx) => (
                            <option key={item._id} value={item._id} className={idx === items.length - 1 ? 'rounded-b-md' : ''}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    <Image src={newOutfit.top?.image || ''} width={100} height={100} alt='top-image' className='mx-5 w-32 h-32' />
                </div>

                {/* MID */}
                <div className='flex items-center justify-start py-5'>
                    <select
                        id="mid-input"
                        value={newOutfit.mid?._id ?? ""}
                        onFocus={() => setIsOpen(true)}
                        onBlur={() => setIsOpen(false)}
                        onChange={(e) => handleSelect("mid", e.target.value)}
                        className={`w-1/2 mx-6 border rounded-lg px-4 py-2 text-lg ${isOpen} ? 'rounded-t-md rounded-b-none' : 'rounded-md'`}
                    >
                        {items?.filter(item => item.type === "mid").map((item, idx) => (
                            <option key={item._id} value={item._id} className={idx === items.length - 1 ? 'rounded-b-md' : ''}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    <Image src={newOutfit.mid?.image || ''} width={100} height={100} alt='mid-image' className='mx-5 w-32 h-32' />
                </div>

                {/* BOTTOM */}
                <div className='flex items-center justify-start py-5'>
                    <select
                        id="bottom-input"
                        value={newOutfit.bottom?._id ?? ""}
                        onFocus={() => setIsOpen(true)}
                        onBlur={() => setIsOpen(false)}
                        onChange={(e) => handleSelect("bottom", e.target.value)}
                        className={`w-1/2 mx-6 border rounded-lg px-4 py-2 text-lg ${isOpen} ? 'rounded-t-md rounded-b-none' : 'rounded-md'`}
                    >
                        {items?.filter(item => item.type === "bottom").map((item, idx) => (
                            <option key={item._id} value={item._id} className={idx === items.length - 1 ? 'rounded-b-md' : ''}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    <Image src={newOutfit.bottom?.image || ''} width={100} height={100} alt='bottom-image' className='mx-5 w-32 h-32' />
                </div>

                {/* ACTION BUTTONS */}
                <div className='flex w-full justify-around mt-4'>
                    <button
                        className="cursor-pointer hover:scale-105 duration-200 transition-all w-1/4 px-4 py-2 text-lg font-semibold
                        bg-gradient-to-br from-blue-500 to-indigo-800 text-white rounded-lg"
                        onClick={() => onSave(newOutfit)}
                    >
                        Save
                    </button>
                    <button
                        className="cursor-pointer hover:scale-105 duration-200 transition-all w-1/4 px-4 py-2 text-lg font-semibold
                        text-transparent bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text shadow-lg rounded-xl"
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
