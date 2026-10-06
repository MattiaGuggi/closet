'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useUser } from '@/app/context/UserContext';
import Outfit from '@/app/components/Outfit';
import Clothing from '@/app/components/Clothing';
import SkeletonCard from '@/app/components/SkeletonCard';
import { clothesType, gadgetType, outfitType } from '@/lib/types';
import { Trash2Icon, LogOut, Edit3, Shirt, Layers, Watch, ListFilter, ChevronDown, Check, Bookmark } from 'lucide-react';
import Gadget from '@/app/components/Gadget';
import useClosetAPI from '@/app/hooks/useClosetAPI';
import { useModal } from '@/app/context/ModalContext';

type SortOption = 'Default' | 'A-Z' | 'Z-A' | 'Type A-Z' | 'Type Z-A';

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

const sortItems = <T extends { name?: string; type?: string | null }>(
  items: T[] | null,
  sortOption: SortOption
): T[] | null => {
  if (!items) return null;
  const arr = [...items];

  if (sortOption === 'A-Z') {
    arr.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else if (sortOption === 'Z-A') {
    arr.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
  } else if (sortOption === 'Type A-Z') {
    arr.sort((a, b) => {
      const typeCompare = (a.type || '').localeCompare(b.type || '');
      return typeCompare !== 0 ? typeCompare : (a.name || '').localeCompare(b.name || '');
    });
  } else if (sortOption === 'Type Z-A') {
    arr.sort((a, b) => {
      const typeCompare = (b.type || '').localeCompare(a.type || '');
      return typeCompare !== 0 ? typeCompare : (a.name || '').localeCompare(b.name || '');
    });
  }
  
  return arr;
};

const ProfilePage = () => {
  const { user, logout } = useUser();
  const { openModal, setActiveModal } = useModal();
  const { fetchUserDetails, deleteEntity, clothes, outfits, gadgets, isLoading, saveItem, saveOutfit, saveGadget, toggleWishlist } = useClosetAPI(user);
  const [clothesSort, setClothesSort] = useState<SortOption>('Default');
  const [gadgetsSort, setGadgetsSort] = useState<SortOption>('Default');
  const [activeDropdown, setActiveDropdown] = useState<'clothes' | 'gadgets' | null>(null);

  const handleOpenItemModal = (item: clothesType) => openModal('item', { item, onSave: saveItem });
  const handleOpenOutfitModal = (outfit: outfitType) => openModal('outfit', { outfit, items: clothes, onSave: saveOutfit });
  const handleOpenGadgetModal = (gadget: gadgetType) => openModal('gadget', { item: gadget, onSave: saveGadget });

  const sortedClothes = useMemo(() => sortItems(clothes, clothesSort), [clothes, clothesSort]);
  const sortedGadgets = useMemo(() => sortItems(gadgets, gadgetsSort), [gadgets, gadgetsSort]);

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

  return (
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
          <button className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-xl border border-white/10 transition-all hover:scale-105 cursor-pointer" onClick={() => setActiveModal('user')}>
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
              options={['Default', 'A-Z', 'Z-A', 'Type A-Z', 'Type Z-A']} 
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
              !clothing.isWishlisted && (
                <Clothing key={clothing._id || idx} item={clothing} onOpen={handleOpenItemModal} onToggleWishlist={toggleWishlist} onDelete={confirmDelete} />
              )
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
              !outfit.isWishlisted && (
                <Outfit key={outfit._id || idx} item={outfit} onOpen={handleOpenOutfitModal} onDelete={confirmDelete} onToggleWishlist={toggleWishlist} />
              )
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
              !gadget.isWishlisted && (
                <Gadget key={gadget._id || idx} item={gadget} onOpen={handleOpenGadgetModal} onDelete={confirmDelete} onToggleWishlist={toggleWishlist} />
              )
            ))
          ) : (
            <div className="col-span-full p-12 text-center rounded-2xl bg-zinc-900/30 border border-white/5 text-zinc-500 text-sm">
              No saved gadgets found.
            </div>
          )}
        </div>
      </section>
    </section>
  );
}

export default ProfilePage;