'use client';

import axios from 'axios';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useUser } from '@/app/context/UserContext';
import UserModal from '@/app/components/UserModal';
import Outfit from '@/app/components/Outfit';
import Clothing from '@/app/components/Clothing';
import ItemModal from '@/app/components/ItemModal';
import SkeletonCard from '@/app/components/SkeletonCard';
import { clothesType, EditableClothesType, gadgetType, outfitType } from '@/lib/types';
import OutfitModal from '@/app/components/OutfitModal';
import { Trash2Icon, LogOut, Edit3, Shirt, Layers, AlertCircle, CheckCircle2, X, Watch, ListFilter, ChevronDown, Check } from 'lucide-react';
import Gadget from '@/app/components/Gadget';
import GadgetModal from '@/app/components/GadgetModal';
import Toast from '@/app/components/Toast';

// 1. Updated SortOptions to include Type A-Z and Type Z-A
type SortOption = 'Default' | 'A-Z' | 'Z-A' | 'Type A-Z' | 'Type Z-A';

// Reusable Dropdown Component
function SortDropdown({
  value,
  options,
  onChange,
  isOpen,
  onToggle,
  onClose
}: {
  value: SortOption;
  options: SortOption[];
  onChange: (val: SortOption) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative z-40">
      {isOpen && <div className="fixed inset-0 z-30" onClick={onClose} />}
      <button
        onClick={onToggle}
        className="relative z-40 flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-900/80 border border-white/10 rounded-lg text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-pointer backdrop-blur-md"
      >
        <ListFilter className="w-3 h-3" />
        {value === 'Default' ? 'Sort' : value}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); onClose(); }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer ${value === opt ? 'bg-indigo-500/10 text-indigo-400 font-medium' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
            >
              {opt}
              {value === opt && <Check className="w-3 h-3" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const ProfilePage = () => {
  const { user, logout } = useUser();
  const [clothes, setClothes] = useState<clothesType[] | null>(null);
  const [outfits, setOutfits] = useState<outfitType[] | null>(null);
  const [gadgets, setGadgets] = useState<gadgetType[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sorting States
  const [clothesSort, setClothesSort] = useState<SortOption>('Default');
  const [gadgetsSort, setGadgetsSort] = useState<SortOption>('Default');
  const [activeDropdown, setActiveDropdown] = useState<'clothes' | 'gadgets' | null>(null);

  const [currentItem, setCurrentItem] = useState<clothesType>({ 
    name: '', image: '', modelFile: '', scale: 1.0, position: [0, 0, 0], description: '', type: null, creator: user 
  });
  const [currentOutfit, setCurrentOutfit] = useState<outfitType>({ 
    creator: user, top: undefined, mid: undefined, bottom: undefined 
  });
  const [currentGadget, setCurrentGadget] = useState<gadgetType>({ 
    creator: user, name: '', image: '', description: '', type: null, scale: 1.0, position: [0, 0, 0]
  });

  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [isOutfitModalOpen, setIsOutfitModalOpen] = useState<boolean>(false);
  const [isGadgetModalOpen, setIsGadgetModalOpen] = useState<boolean>(false);

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

  // --- Sorting Logic using useMemo ---
  const sortedClothes = useMemo(() => {
    if (!clothes) return null;
    const arr = [...clothes];
    if (clothesSort === 'A-Z') arr.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    if (clothesSort === 'Z-A') arr.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    return arr;
  }, [clothes, clothesSort]);

  const sortedGadgets = useMemo(() => {
    if (!gadgets) return null;
    const arr = [...gadgets];
    
    if (gadgetsSort === 'A-Z') {
      arr.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (gadgetsSort === 'Z-A') {
      arr.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    } else if (gadgetsSort === 'Type A-Z') {
      arr.sort((a, b) => {
        const typeCompare = (a.type || '').localeCompare(b.type || '');
        // Fallback: If types are the same, sort alphabetically by name
        return typeCompare !== 0 ? typeCompare : (a.name || '').localeCompare(b.name || '');
      });
    } else if (gadgetsSort === 'Type Z-A') {
      arr.sort((a, b) => {
        const typeCompare = (b.type || '').localeCompare(a.type || '');
        // Fallback: If types are the same, sort alphabetically by name
        return typeCompare !== 0 ? typeCompare : (a.name || '').localeCompare(b.name || '');
      });
    }
    return arr;
  }, [gadgets, gadgetsSort]);


  const saveGadget = async (gadget: gadgetType & { imageFile?: File }) => {
    setIsGadgetModalOpen(false);
    
    const oldGadget = gadgets?.find((g) => g._id === gadget._id);
    setGadgets((prev) => prev?.map((g) => g._id === gadget._id ? gadget : g) || []);

    try {
      const formData = new FormData();
      formData.append("gadget", JSON.stringify(gadget));
      if (gadget.imageFile) formData.append("image", gadget.imageFile);

      const response = await axios.post("/api/updateGadget", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        fetchUserDetails();
        showToast("Gadget saved successfully!", "success");
      } else {
        throw new Error("Failed to update gadget");
      }
    } catch (err) {
      console.error(err);
      if (oldGadget) {
        setGadgets((prev) => prev?.map((g) => g._id === oldGadget._id ? oldGadget : g) || []);
      }
      showToast("Error updating gadget. Changes reverted.", "error");
    }
  };

  const saveItem = async (item: EditableClothesType) => {
    setIsItemModalOpen(false);

    const oldItem = clothes?.find((c) => c._id === item._id);
    setClothes((prev) => prev?.map((c) => c._id === item._id ? (item as unknown as clothesType) : c) || []);

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
        fetchUserDetails();
        showToast("Capo salvato con successo!", "success");
      } else {
        throw new Error("Failed to update item");
      }
    } catch (err) {
      console.error(err);
      if (oldItem) {
        setClothes((prev) => prev?.map((c) => c._id === oldItem._id ? oldItem : c) || []);
      }
      showToast("Errore durante l'aggiornamento. Modifiche annullate.", "error");
    }
  };

  const saveOutfit = async (outfit: outfitType) => {
    setIsOutfitModalOpen(false);
    
    const oldOutfit = outfits?.find((o) => o._id === outfit._id);
    setOutfits((prev) => prev?.map((o) => o._id === outfit._id ? outfit : o) || []);

    try {
      const formData = new FormData();
      formData.append("outfit", JSON.stringify(outfit));

      const response = await axios.post("/api/updateOutfit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        fetchUserDetails();
        showToast("Outfit salvato con successo!", "success");
      } else {
        throw new Error("Failed to update outfit");
      }
    } catch (err) {
      console.error('Error updating outfit', err);
      if (oldOutfit) {
        setOutfits((prev) => prev?.map((o) => o._id === oldOutfit._id ? oldOutfit : o) || []);
      }
      showToast("Errore di connessione. Modifiche annullate.", "error");
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

  const handleOpenGadgetModal = (gadget: gadgetType) => {
    setCurrentGadget(gadget);
    setIsGadgetModalOpen(true);
  };
  
  const handleCloseItemModal = () => setIsItemModalOpen(false);
  const handleCloseOutfitModal = () => setIsOutfitModalOpen(false);
  const handleCloseGadgetModal = () => setIsGadgetModalOpen(false);

  const requestDeleteItem = (id?: string | number) => {
    if (!id) {
      showToast('ID del capo mancante', 'error');
      return;
    }

    const itemToRestore = clothes?.find((c) => c._id === id);

    setConfirmModal({
      isOpen: true,
      title: 'Delete Item',
      description: 'Are you sure you want to delete this item? The action is irreversible.',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setClothes((prev) => prev?.filter((c) => c._id !== id) || []);
        showToast('Item deleted', 'success');

        try {
          const response = await axios.delete(`/api/deleteItem?id=${id}`);
          if (response.data.success) {
            fetchUserDetails();
          } else {
            throw new Error("Server failed to delete item");
          }
        } catch (err) {
          console.error('Error deleting item', err);
          if (itemToRestore) setClothes((prev) => (prev ? [...prev, itemToRestore] : [itemToRestore]));
          showToast('Error during deletion. Item restored.', 'error');
        }
      },
    });
  };

  const requestDeleteOutfit = (id?: string | number) => {
    if (!id) {
      showToast('ID outfit mancante', 'error');
      return;
    }

    const outfitToRestore = outfits?.find((o) => o._id === id);

    setConfirmModal({
      isOpen: true,
      title: 'Elimina Outfit',
      description: 'Sei sicuro di voler eliminare questo outfit salvato?',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setOutfits((prev) => prev?.filter((o) => o._id !== id) || []);
        showToast('Outfit eliminato', 'success');

        try {
          const response = await axios.delete(`/api/deleteOutfit?id=${id}`);
          if (response.data.success) {
            fetchUserDetails();
          } else {
            throw new Error("Server failed to delete outfit");
          }
        } catch (err) {
          console.error('Error deleting outfit', err);
          if (outfitToRestore) setOutfits((prev) => (prev ? [...prev, outfitToRestore] : [outfitToRestore]));
          showToast("Errore durante l'eliminazione dell'outfit. Ripristinato.", 'error');
        }
      },
    });
  };

  const requestDeleteGadget = (id?: string | number) => {
    if (!id) {
      showToast('ID del gadget mancante', 'error');
      return;
    }

    const gadgetToRestore = gadgets?.find((g) => g._id === id);

    setConfirmModal({
      isOpen: true,
      title: 'Delete Gadget',
      description: 'Are you sure you want to delete this gadget? The action is irreversible.',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setGadgets((prev) => prev?.filter((g) => g._id !== id) || []);
        showToast('Gadget deleted', 'success');

        try {
          const response = await axios.delete(`/api/deleteGadget?id=${id}`);
          if (response.data.success) {
            fetchUserDetails();
          } else {
            throw new Error("Server failed to delete gadget");
          }
        } catch (err) {
          console.error('Error deleting item', err);
          if (gadgetToRestore) setGadgets((prev) => (prev ? [...prev, gadgetToRestore] : [gadgetToRestore]));
          showToast('Error during deletion. Gadget restored.', 'error');
        }
      },
    });
  };

  useEffect(() => {
    if (user?._id) fetchUserDetails();
  }, [user?._id, fetchUserDetails]);

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

      {isUserModalOpen && <UserModal onClose={() => setIsUserModalOpen(false)} />}
      {isItemModalOpen && <ItemModal onSave={saveItem} onClose={handleCloseItemModal} item={currentItem} />}
      {isOutfitModalOpen && <OutfitModal onSave={saveOutfit} onClose={handleCloseOutfitModal} outfit={currentOutfit} items={clothes} />}
      {isGadgetModalOpen && <GadgetModal onSave={saveGadget} onClose={handleCloseGadgetModal} gadget={currentGadget} />}

      <section id="profile-section" className="w-full max-w-6xl mx-auto px-6 py-10 flex flex-col items-center">
        
        <div className="w-full rounded-3xl bg-zinc-900/60 border border-white/10 p-8 sm:p-10 backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden mb-12">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500/40 p-1 bg-zinc-950 shadow-xl">
              <Image priority src={user?.pfp || "/default-pfp.png"} alt="Pfp" fill className="object-cover rounded-full" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{user?.username || 'Creator Profile'}</h1>
              <p className="text-xs text-zinc-400 mt-1">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-xl border border-white/10 transition-all hover:scale-105 cursor-pointer" onClick={() => setIsUserModalOpen(true)}>
              <Edit3 className="w-3.5 h-3.5 text-indigo-400" /> Update Profile
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-xs rounded-xl border border-red-500/20 transition-all hover:scale-105 cursor-pointer" onClick={logout}>
              <LogOut className="w-3.5 h-3.5" /> Exit
            </button>
          </div>
        </div>

        {/* Clothes Section */}
        <section id="clothes-section" className="w-full mb-16">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"><Shirt className="w-5 h-5" /></div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Your Clothes</h2>
                <p className="text-xs text-zinc-400">Garments stored in your studio</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2.5">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-white/10">
                {isLoading ? 'Loading...' : `${clothes?.length || 0} Item(s)`}
              </span>
              <SortDropdown 
                value={clothesSort} 
                options={['Default', 'A-Z', 'Z-A']} 
                onChange={setClothesSort} 
                isOpen={activeDropdown === 'clothes'}
                onToggle={() => setActiveDropdown(prev => prev === 'clothes' ? null : 'clothes')}
                onClose={() => setActiveDropdown(null)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : sortedClothes && sortedClothes.length > 0 ? (
              sortedClothes.map((clothing, idx) => (
                <div key={clothing._id || idx} className="relative group transition-transform hover:scale-[1.02]">
                  <Clothing item={clothing} onOpen={handleOpenItemModal} />
                  <button onClick={(e) => { e.stopPropagation(); requestDeleteItem(clothing._id); }} className="absolute top-4 right-4 p-2.5 bg-zinc-900/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-xl border border-white/10 transition-all hover:scale-110 cursor-pointer z-30 backdrop-blur-md pointer-events-auto" title="Delete item">
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
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400"><Layers className="w-5 h-5" /></div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Your Outfits</h2>
                <p className="text-xs text-zinc-400">Saved fashion combinations</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2.5">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-white/10">
                {isLoading ? 'Loading...' : `${outfits?.length || 0} Outfit(s)`}
              </span>
            </div>
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
                <div key={outfit._id || idx} className="relative group transition-transform hover:scale-[1.02]">
                  <Outfit item={outfit} onOpen={handleOpenOutfitModal} />
                  <button onClick={(e) => { e.stopPropagation(); requestDeleteOutfit(outfit._id); }} className="absolute top-4 right-4 p-2.5 bg-zinc-900/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-xl border border-white/10 transition-all hover:scale-110 cursor-pointer z-30 backdrop-blur-md pointer-events-auto" title="Delete outfit">
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

        {/* Gadget Section */}
        <section id="gadget-section" className="w-full mb-16">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400"><Watch className="w-5 h-5" /></div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Your Gadgets</h2>
                <p className="text-xs text-zinc-400">Saved accessory items</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2.5">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-white/10">
                {isLoading ? 'Loading...' : `${gadgets?.length || 0} Gadget(s)`}
              </span>
              <SortDropdown 
                value={gadgetsSort} 
                options={['Default', 'A-Z', 'Z-A', 'Type A-Z', 'Type Z-A']} 
                onChange={setGadgetsSort} 
                isOpen={activeDropdown === 'gadgets'}
                onToggle={() => setActiveDropdown(prev => prev === 'gadgets' ? null : 'gadgets')}
                onClose={() => setActiveDropdown(null)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : sortedGadgets && sortedGadgets.length > 0 ? (
              sortedGadgets.map((gadget, idx) => (
                <div key={gadget._id || idx} className="relative group transition-transform hover:scale-[1.02]">
                  <Gadget item={gadget} onOpen={handleOpenGadgetModal} />
                  <button onClick={(e) => { e.stopPropagation(); requestDeleteGadget(gadget._id); }} className="absolute top-4 right-4 p-2.5 bg-zinc-900/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-xl border border-white/10 transition-all hover:scale-110 cursor-pointer z-30 backdrop-blur-md pointer-events-auto" title="Delete gadget">
                    <Trash2Icon className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full p-12 text-center rounded-2xl bg-zinc-900/30 border border-white/5 text-zinc-500 text-sm">
                No saved gadgets found.
              </div>
            )}
          </div>
        </section>
      </section>
    </>
  );
}

export default ProfilePage;