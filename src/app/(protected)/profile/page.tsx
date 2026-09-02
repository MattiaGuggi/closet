'use client';

import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useUser } from '@/app/context/UserContext';
import UserModal from '@/app/components/UserModal';
import Outfit from '@/app/components/Outfit';
import Clothing from '@/app/components/Clothing';
import ItemModal from '@/app/components/ItemModal';
import SkeletonCard from '@/app/components/SkeletonCard';
import { clothesType, EditableClothesType, outfitType } from '@/lib/types';
import OutfitModal from '@/app/components/OutfitModal';
import { Trash2Icon, LogOut, Edit3, Shirt, Layers, AlertCircle, CheckCircle2, X } from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useUser();
  const [clothes, setClothes] = useState<clothesType[] | null>(null);
  const [outfits, setOutfits] = useState<outfitType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentItem, setCurrentItem] = useState<clothesType>({ 
    name: '', image: '', modelFile: '', scale: 1.0, position: [0, 0, 0], description: '', type: null, creator: user 
  });
  const [currentOutfit, setCurrentOutfit] = useState<outfitType>({ 
    creator: user, top: undefined, mid: undefined, bottom: undefined 
  });

  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [isOutfitModalOpen, setIsOutfitModalOpen] = useState<boolean>(false);

  // UI Feedback States (Toast & Confirm)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', description: '', onConfirm: () => {} });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchUserDetails = useCallback(async () => {
    if (!user?._id) return;
    setIsLoading(true);
    try {
      const response = await axios.get('/api/user', { params: { userId: user._id } });
      const data = response.data;
      setClothes(data.clothes || []);
      setOutfits(data.outfits || []);
    } catch (err) {
      console.error(err);
      showToast('Errore nel recupero dati utente', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [user?._id]);

  const saveItem = async (item: EditableClothesType) => {
    try {
      const formData = new FormData();
      formData.append("item", JSON.stringify(item));

      if (item.imageFile) formData.append("image", item.imageFile);
      if (item.modelFileFile) formData.append("model", item.modelFileFile);

      formData.append("name", item.name);
      formData.append("scale", String(item.scale));
      formData.append("description", item.description);
      formData.append("position", JSON.stringify(item.position));
      if (item.type) formData.append("type", item.type);

      const response = await axios.post("/api/updateItem", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setIsItemModalOpen(false);
        await fetchUserDetails();
        showToast("Capo salvato con successo!", "success");
      } else {
        showToast("Errore durante l'aggiornamento del capo", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Errore durante il salvataggio del capo", "error");
    }
  };

  const saveOutfit = async (outfit: outfitType) => {
    try {
      const formData = new FormData();
      formData.append("outfit", JSON.stringify(outfit));

      const response = await axios.post("/api/updateOutfit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setIsOutfitModalOpen(false);
        await fetchUserDetails();
        showToast("Outfit salvato con successo!", "success");
      } else {
        showToast("Errore durante l'aggiornamento dell'outfit", "error");
      }
    } catch (err) {
      console.error('Error updating outfit', err);
      showToast("Errore di connessione durante il salvataggio dell'outfit", "error");
    }
  };

  const handleOpenItemModal = (item: clothesType) => {
    setCurrentItem(item);
    setIsItemModalOpen(true);
  };

  const handleOpenOutfitModal = (outfit: outfitType) => {
    setCurrentOutfit(outfit);
    setIsOutfitModalOpen(true);
  };
  
  const handleCloseItemModal = () => setIsItemModalOpen(false);
  const handleCloseOutfitModal = () => setIsOutfitModalOpen(false);

  const requestDeleteItem = (id?: number) => {
    if (!id) {
      showToast('ID del capo mancante', 'error');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Delete Item',
      description: 'Are you sure you want to delete this item? The action is irreversible.',
      onConfirm: async () => {
        try {
          const response = await axios.delete(`/api/deleteItem?id=${id}`);
          if (response.data.success) {
            await fetchUserDetails();
            showToast('Item deleted', 'success');
          } else {
            showToast('Error during deletion', 'error');
          }
        } catch (err) {
          console.error('Error deleting item', err);
          showToast('Error during deletion', 'error');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const requestDeleteOutfit = (id?: number) => {
    if (!id) {
      showToast('ID outfit mancante', 'error');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Elimina Outfit',
      description: 'Sei sicuro di voler eliminare questo outfit salvato?',
      onConfirm: async () => {
        try {
          const response = await axios.delete(`/api/deleteOutfit?id=${id}`);
          if (response.data.success) {
            await fetchUserDetails();
            showToast('Outfit eliminato', 'success');
          } else {
            showToast('Errore durante l\'eliminazione dell\'outfit', 'error');
          }
        } catch (err) {
          console.error('Error deleting outfit', err);
          showToast('Errore durante l\'eliminazione dell\'outfit', 'error');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  useEffect(() => {
    if (user?._id) fetchUserDetails();
  }, [user?._id, fetchUserDetails]);

  return (
    <>
      {/* Toast Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-zinc-900/90 border border-white/10 text-white shadow-2xl backdrop-blur-xl">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-500" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
          <button 
            onClick={() => setToast(null)}
            className="ml-2 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Trash2Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">{confirmModal.title}</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {confirmModal.description}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}

      {isUserModalOpen && <UserModal onClose={() => setIsUserModalOpen(false)} />}
      {isItemModalOpen && <ItemModal onSave={saveItem} onClose={handleCloseItemModal} item={currentItem} />}
      {isOutfitModalOpen && <OutfitModal onSave={saveOutfit} onClose={handleCloseOutfitModal} outfit={currentOutfit} items={clothes} />}

      <section id="profile-section" className="w-full max-w-6xl mx-auto px-6 py-10 flex flex-col items-center">
        
        {/* User Card Banner */}
        <div className="w-full rounded-3xl bg-zinc-900/60 border border-white/10 p-8 sm:p-10 backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden mb-12">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500/40 p-1 bg-zinc-950 shadow-xl">
              <Image
                priority
                src={user?.pfp || "/default-pfp.png"}
                alt="Pfp"
                fill
                className="object-cover rounded-full"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {user?.username || 'Creator Profile'}
              </h1>
              <p className="text-xs text-zinc-400 mt-1">{user?.email}</p>
            </div>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-xl border border-white/10 transition-all hover:scale-105 cursor-pointer"
              onClick={() => setIsUserModalOpen(true)}
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
              Update Profile
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-xs rounded-xl border border-red-500/20 transition-all hover:scale-105 cursor-pointer"
              onClick={logout}
            >
              <LogOut className="w-3.5 h-3.5" />
              Exit
            </button>
          </div>
        </div>

        {/* Clothes Section */}
        <section id="clothes-section" className="w-full mb-16">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Your Clothes</h2>
                <p className="text-xs text-zinc-400">Garments stored in your studio</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-white/10">
              {isLoading ? 'Loading...' : `${clothes?.length || 0} Item(s)`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : clothes && clothes.length > 0 ? (
              clothes.map((clothing, idx) => (
                <div key={clothing._id || idx} className="relative group">
                  <Clothing item={clothing} onOpen={handleOpenItemModal} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      requestDeleteItem(clothing._id);
                    }}
                    className="absolute top-4 right-4 p-2.5 bg-zinc-900/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-xl border border-white/10 transition-all hover:scale-110 cursor-pointer z-20 backdrop-blur-md"
                    title="Delete item"
                  >
                    <Trash2Icon className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full p-12 text-center rounded-2xl bg-zinc-900/30 border border-white/5 text-zinc-500 text-sm">
                No clothing items found. Add items inside the Closet Studio!
              </div>
            )}
          </div>
        </section>

        {/* Outfit Section */}
        <section id="outfit-section" className="w-full mb-16">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Your Outfits</h2>
                <p className="text-xs text-zinc-400">Saved fashion combinations</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-white/10">
              {isLoading ? 'Loading...' : `${outfits?.length || 0} Outfit(s)`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : outfits && outfits.length > 0 ? (
              outfits.map((outfit, idx) => (
                <div key={outfit._id || idx} className="relative group">
                  <Outfit item={outfit} onOpen={handleOpenOutfitModal} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      requestDeleteOutfit(outfit._id);
                    }}
                    className="absolute top-4 right-4 p-2.5 bg-zinc-900/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-xl border border-white/10 transition-all hover:scale-110 cursor-pointer z-20 backdrop-blur-md"
                    title="Delete outfit"
                  >
                    <Trash2Icon className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full p-12 text-center rounded-2xl bg-zinc-900/30 border border-white/5 text-zinc-500 text-sm">
                No saved outfits found.
              </div>
            )}
          </div>
        </section>

      </section>
    </>
  );
}

export default ProfilePage;