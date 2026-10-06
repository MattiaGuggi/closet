'use client'

import { useEffect } from 'react'
import { useUser } from '@/app/context/UserContext';
import { clothesType, gadgetType, outfitType } from '@/lib/types';
import Outfit from '@/app/components/Outfit';
import Gadget from '@/app/components/Gadget';
import Clothing from '@/app/components/Clothing';
import SkeletonCard from '@/app/components/SkeletonCard';
import useClosetAPI from '@/app/hooks/useClosetAPI';
import { useModal } from '@/app/context/ModalContext';

const wishlistPage = () => {
    const { user } = useUser();
    const { openModal } = useModal();
    const { clothes, outfits, gadgets, isLoading, fetchUserDetails, saveItem, saveOutfit, saveGadget } = useClosetAPI(user);
    
    const handleOpenItemModal = (item: clothesType) => openModal('item', { item, onSave: saveItem });
    const handleOpenOutfitModal = (outfit: outfitType) => openModal('outfit', { outfit, items: clothes, onSave: saveOutfit });
    const handleOpenGadgetModal = (gadget: gadgetType) => openModal('gadget', { item: gadget, onSave: saveGadget });

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
                            <Clothing key={item._id || idx} item={item} onOpen={handleOpenItemModal} />
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
                            <Outfit key={item._id || idx} item={item} onOpen={handleOpenOutfitModal} />
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
                            <Gadget key={item._id || idx} item={item} onOpen={handleOpenGadgetModal} />
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
