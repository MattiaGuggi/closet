'use client'

import { useCallback, useEffect, useState } from 'react'
import Toast from '@/app/components/Toast';
import { Bookmark, Trash2Icon } from 'lucide-react';
import { useUser } from '@/app/context/UserContext';
import axios from 'axios';
import { clothesType, gadgetType, outfitType } from '@/lib/types';
import Outfit from '@/app/components/Outfit';
import Gadget from '@/app/components/Gadget';
import Clothing from '@/app/components/Clothing';
import SkeletonCard from '@/app/components/SkeletonCard';

const wishlistPage = () => {
    const { user } = useUser();
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [clothes, setClothes] = useState<clothesType[] | null>(null);
    const [outfits, setOutfits] = useState<outfitType[] | null>(null);
    const [gadgets, setGadgets] = useState<gadgetType[] | null>(null);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: '', description: '', onConfirm: () => {} });
    
    const [currentItem, setCurrentItem] = useState<clothesType>({ 
        name: '', image: '', modelFile: '', scale: 1.0, position: [0, 0, 0], description: '', type: null, creator: user 
    });
    
    const [currentOutfit, setCurrentOutfit] = useState<outfitType>({ 
        creator: user, top: { base: null, mid: null, outer: null }, mid: undefined, bottom: undefined 
    });
    
    const [currentGadget, setCurrentGadget] = useState<gadgetType>({ 
        creator: user, name: '', image: '', description: '', type: null, scale: 1.0, position: [0, 0, 0]
    });

    const [activeModal, setActiveModal] = useState<'user' | 'item' | 'outfit' | 'gadget' | null>(null);

    const showToast = (message: string, type: 'success' | 'info' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleOpenItemModal = (item: clothesType) => {
        setCurrentItem(item);
        setActiveModal('item');
    };
    
    const handleOpenOutfitModal = (outfit: outfitType) => {
        setCurrentOutfit(outfit);
        setActiveModal('outfit');
    };
    
    const handleOpenGadgetModal = (gadget: gadgetType) => {
        setCurrentGadget(gadget);
        setActiveModal('gadget');
    };

    const fetchUserDetails = useCallback(async () => {
        if (!user?._id) return;
        setIsLoading(true);
        try {
            const response = await axios.get('/api/user', { params: { userId: user._id } });
            const data = response.data;
          
            setClothes(Array.isArray(data.clothes) ? data.clothes.filter((c: clothesType) => c && c._id) : []);
            setOutfits(Array.isArray(data.outfits) ? data.outfits.filter((o: outfitType) => o && o._id) : []);
            setGadgets(Array.isArray(data.gadgets) ? data.gadgets.filter((g: gadgetType) => g && g._id) : []);
        } catch (err) {
            console.error(err);
            showToast('Errore nel recupero dati utente', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [user?._id]);

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

    const requestDelete = <T extends { _id?: string | number }>(
        id: string | number | undefined,
        entityName: string,
        endpoint: string,
        items: T[] | null,
        setItems: React.Dispatch<React.SetStateAction<T[] | null>>
    ) => {
        if (!id) {
            showToast(`${entityName} ID missing`, 'error');
            return;
        }
    
        const itemToRestore = items?.find((i) => i._id === id);
    
        setConfirmModal({
        isOpen: true,
        title: `Delete ${entityName}`,
        description: `Are you sure you want to delete this ${entityName.toLowerCase()}? The action is irreversible.`,
        onConfirm: async () => {
            setConfirmModal((prev) => ({ ...prev, isOpen: false }));
            setItems((prev) => prev?.filter((i) => i._id !== id) || []);
            showToast(`${entityName} deleted`, 'success');
    
            try {
                const response = await axios.delete(`${endpoint}?id=${id}`);
                if (response.data.success) {
                    fetchUserDetails();
                } else {
                    throw new Error(`Server failed to delete ${entityName.toLowerCase()}`);
                }
            } catch (err) {
                console.error(`Error deleting ${entityName.toLowerCase()}`, err);
                if (itemToRestore) setItems((prev) => (prev ? [...prev, itemToRestore] : [itemToRestore]));
                showToast(`Error during deletion. ${entityName} restored.`, 'error');
            }
        },
        });
    };

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                    <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20"><Trash2Icon className="w-6 h-6" /></div>
                            <h3 className="text-xl font-bold text-white">{confirmModal.title}</h3>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">{confirmModal.description}</p>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))} className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer">Cancel</button>
                            <button type="button" onClick={confirmModal.onConfirm} className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 transition-all cursor-pointer">Confirm Deletion</button>
                        </div>
                    </div>
                </div>
            )}

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
                            <button onClick={(e) => { e.stopPropagation(); requestDelete(item._id, 'Item', '/api/deleteItem', clothes, setClothes); }} className="absolute top-4 right-4 p-2.5 bg-zinc-900/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-xl border border-white/10 transition-all hover:scale-110 cursor-pointer z-30 backdrop-blur-md pointer-events-auto" title="Delete item">
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
                            <button onClick={(e) => { e.stopPropagation(); requestDelete(item._id, 'Item', '/api/deleteItem', outfits, setOutfits); }} className="absolute top-4 right-4 p-2.5 bg-zinc-900/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-xl border border-white/10 transition-all hover:scale-110 cursor-pointer z-30 backdrop-blur-md pointer-events-auto" title="Delete item">
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
                            <button onClick={(e) => { e.stopPropagation(); requestDelete(item._id, 'Item', '/api/deleteItem', gadgets, setGadgets); }} className="absolute top-4 right-4 p-2.5 bg-zinc-900/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-xl border border-white/10 transition-all hover:scale-110 cursor-pointer z-30 backdrop-blur-md pointer-events-auto" title="Delete item">
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
        </>
    )
}

export default wishlistPage;
