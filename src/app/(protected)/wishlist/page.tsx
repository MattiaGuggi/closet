'use client'

import { useEffect, useState } from 'react'
import { Bookmark, Trash2Icon } from 'lucide-react';
import { useUser } from '@/app/context/UserContext';
import axios from 'axios';
import { clothesType, gadgetType, outfitType } from '@/lib/types';
import Outfit from '@/app/components/Outfit';
import Gadget from '@/app/components/Gadget';
import Clothing from '@/app/components/Clothing';
import SkeletonCard from '@/app/components/SkeletonCard';
import useClosetAPI from '@/app/hooks/useClosetAPI';
import { useModal } from '@/app/context/ModalContext';

const wishlistPage = () => {
    const { user } = useUser();
    const { showToast, openModal } = useModal();
    const { clothes, outfits, gadgets, isLoading, fetchUserDetails, deleteEntity, saveItem, saveOutfit, saveGadget } = useClosetAPI(user);
    
    const handleOpenItemModal = (item: clothesType) => openModal('item', { item, onSave: saveItem });
    const handleOpenOutfitModal = (outfit: outfitType) => openModal('outfit', { outfit, items: clothes, onSave: saveOutfit });
    const handleOpenGadgetModal = (gadget: gadgetType) => openModal('gadget', { item: gadget, onSave: saveGadget });

    const deleteFromWishlist = async (item: clothesType | outfitType | gadgetType) => {
        try {
            const type = 'top' in item || 'mid' in item || 'bottom' in item ? 'Outfit' : 'Gadget' in item ? 'Gadget' : 'Item';
            const response = await axios.post('/api/wishlist', { userId: user?._id, itemId: item._id, itemType: type });
            if (response.data.success) {
                showToast('Removed from wishlist!', 'success');
                fetchUserDetails();
            } else {
                throw new Error('Failed to remove from wishlist');
            }
        } catch(err) {
            console.error(err);
            showToast('Error occurred while removing from wishlist', 'error');
        }
    }

    useEffect(() => {
        if (user?._id) fetchUserDetails();
    }, [user?._id, fetchUserDetails]);

    return (
        <section id="wishlist-section" className="w-full max-w-6xl mx-auto px-6 py-10 flex flex-col items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {isLoading ? (
                <>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </>
                ) : clothes && clothes.length > 0 ? (
                    clothes.map((item, idx) => (
                        item.isWishlisted && (
                        <div key={item._id || idx} className="relative group transition-transform hover:scale-[1.02]">
                            <button onClick={(e) => { e.stopPropagation(); deleteFromWishlist(item); }} className="absolute top-4 left-4 p-2.5 hover:bg-zinc-900/80 bg-blue-500/20 hover:text-zinc-400 text-blue-400 rounded-xl border border-white/10 transition-all hover:scale-110 cursor-pointer z-30 backdrop-blur-md pointer-events-auto" title="Remove from wishlist">
                                <Bookmark className="w-4 h-4" />
                            </button>
                            <Clothing item={item} onOpen={handleOpenItemModal} />
                            <button onClick={(e) => { e.stopPropagation(); deleteEntity(item._id, 'Item', '/api/deleteItem'); }} className="absolute top-4 right-4 p-2.5 bg-zinc-900/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-xl border border-white/10 transition-all hover:scale-110 cursor-pointer z-30 backdrop-blur-md pointer-events-auto" title="Delete item">
                                <Trash2Icon className="w-4 h-4" />
                            </button>
                        </div>
                        )
                    ))
                ) : (
                <div className="col-span-full p-12 text-center rounded-2xl bg-zinc-900/30 border border-white/5 text-zinc-500 text-sm">
                    No clothing items found. Add items inside the Closet Studio!
                </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {isLoading ? (
                <>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </>
                ) : outfits && outfits.length > 0 ? (
                    outfits.map((item, idx) => (
                        item.isWishlisted && (
                        <div key={item._id || idx} className="relative group transition-transform hover:scale-[1.02]">
                            <button onClick={(e) => { e.stopPropagation(); deleteFromWishlist(item); }} className="absolute top-4 left-4 p-2.5 hover:bg-zinc-900/80 bg-blue-500/20 hover:text-zinc-400 text-blue-400 rounded-xl border border-white/10 transition-all hover:scale-110 cursor-pointer z-30 backdrop-blur-md pointer-events-auto" title="Remove from wishlist">
                                <Bookmark className="w-4 h-4" />
                            </button>
                            <Outfit item={item} onOpen={handleOpenOutfitModal} />
                            <button onClick={(e) => { e.stopPropagation(); deleteEntity(item._id, 'Outfit', '/api/deleteOutfit'); }} className="absolute top-4 right-4 p-2.5 bg-zinc-900/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-xl border border-white/10 transition-all hover:scale-110 cursor-pointer z-30 backdrop-blur-md pointer-events-auto" title="Delete item">
                                <Trash2Icon className="w-4 h-4" />
                            </button>
                        </div>
                        )
                    ))
                ) : (
                <div className="col-span-full p-12 text-center rounded-2xl bg-zinc-900/30 border border-white/5 text-zinc-500 text-sm">
                    No outfits found. Add outfits inside the Closet Studio!
                </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {isLoading ? (
                <>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </>
                ) : gadgets && gadgets.length > 0 ? (
                    gadgets.map((item, idx) => (
                        item.isWishlisted && (
                        <div key={item._id || idx} className="relative group transition-transform hover:scale-[1.02]">
                            <button onClick={(e) => { e.stopPropagation(); deleteFromWishlist(item); }} className="absolute top-4 left-4 p-2.5 hover:bg-zinc-900/80 bg-blue-500/20 hover:text-zinc-400 text-blue-400 rounded-xl border border-white/10 transition-all hover:scale-110 cursor-pointer z-30 backdrop-blur-md pointer-events-auto" title="Remove from wishlist">
                                <Bookmark className="w-4 h-4" />
                            </button>
                            <Gadget item={item} onOpen={handleOpenGadgetModal} />
                            <button onClick={(e) => { e.stopPropagation(); deleteEntity(item._id, 'Gadget', '/api/deleteGadget'); }} className="absolute top-4 right-4 p-2.5 bg-zinc-900/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-xl border border-white/10 transition-all hover:scale-110 cursor-pointer z-30 backdrop-blur-md pointer-events-auto" title="Delete item">
                                <Trash2Icon className="w-4 h-4" />
                            </button>
                        </div>
                        )
                    ))
                ) : (
                <div className="col-span-full p-12 text-center rounded-2xl bg-zinc-900/30 border border-white/5 text-zinc-500 text-sm">
                    No gadget items found. Add items inside the Closet Studio!
                </div>
                )}
            </div>
        </section>
    )
}

export default wishlistPage;
