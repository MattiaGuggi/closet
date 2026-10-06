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

const WishlistPage = () => {
    const { user } = useUser();
    const { openModal } = useModal();
    const { clothes, outfits, gadgets, isLoading, fetchUserDetails, saveItem, saveOutfit, saveGadget, deleteEntity, toggleWishlist } = useClosetAPI(user);
    
    const handleOpenItemModal = (item: clothesType) => openModal('item', { item, onSave: saveItem });
    const handleOpenOutfitModal = (outfit: outfitType) => openModal('outfit', { outfit, items: clothes, onSave: saveOutfit });
    const handleOpenGadgetModal = (gadget: gadgetType) => openModal('gadget', { item: gadget, onSave: saveGadget });

    const allItems = [
        ...(clothes || []).map(c => ({ ...c, category: 'clothing' as const })),
        ...(outfits || []).map(o => ({ ...o, category: 'outfit' as const })),
        ...(gadgets || []).map(g => ({ ...g, category: 'gadget' as const }))
    ];
    
    const wishlistedItems = allItems.filter(item => item.isWishlisted);

    const confirmDelete = (id: string | number | undefined, type: 'Item' | 'Outfit' | 'Gadget', endpoint: string) => {
        if (!id) return;
        openModal('confirm', {
            title: `Delete ${type}`,
            description: 'Are you sure you want to delete this? The action is irreversible.',
            onConfirm: () => deleteEntity(id, type, endpoint)
        });
    };

    useEffect(() => {
        if (user?._id) fetchUserDetails();
    }, [user?._id, fetchUserDetails]);

    if (wishlistedItems.length === 0 && !isLoading) {
        return (
            <div className="col-span-full p-12 text-center rounded-2xl bg-zinc-900/30 border border-white/5 text-zinc-500 text-sm mt-10 max-w-6xl mx-auto">
                Your wishlist is empty. Start adding items to see them here!
            </div>
        )
    }

    return (
        <section id="wishlist-section" className="w-full max-w-6xl mx-auto px-6 py-10 flex flex-col items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {isLoading ? (
                <>
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </>
                ) :  (
                    wishlistedItems.map((item, idx) => {
                        if (item.category === 'outfit') {
                            return <Outfit key={item._id || idx} item={item as outfitType} onOpen={handleOpenOutfitModal} onDelete={confirmDelete} onToggleWishlist={toggleWishlist} />
                        }
                        if (item.category === 'clothing') {
                            return <Clothing key={item._id || idx} item={item as clothesType} onOpen={handleOpenItemModal} onDelete={confirmDelete} onToggleWishlist={toggleWishlist} />
                        }
                        if (item.category === 'gadget') {
                            return <Gadget key={item._id || idx} item={item as gadgetType} onOpen={handleOpenGadgetModal} onDelete={confirmDelete} onToggleWishlist={toggleWishlist} />
                        }
                        return null;
                    })
                )}
            </div>
        </section>
    )
}

export default WishlistPage;