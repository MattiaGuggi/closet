'use client';

import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import Model from './model';
import { Loader } from './Loader';
import { 
  X, Sparkles, Box, Tag, FileText, Layers, Move, 
  Maximize2, Upload, Loader2, Check, ChevronUp, 
  ChevronDown, MoveDiagonal, ZoomIn, ListFilter
} from 'lucide-react';
import { clothesType, OutfitPart, Gadget, gadgetType } from '@/lib/types';

// SHARED STYLES & CONSTANTS
const baseInputStyle = 'w-full px-3.5 py-2.5 bg-zinc-950/60 border border-white/10 rounded-xl shadow-inner text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all';
const numberInputStyle = `${baseInputStyle} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;
const labelStyle = 'text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5';
const fileInputStyle = 'w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer border border-white/10 rounded-xl p-1 bg-zinc-950/40 disabled:opacity-50 transition-all';

const clothingOptions: { label: string; value: OutfitPart }[] = [
  { label: 'Top', value: 'top' },
  { label: 'Mid', value: 'mid' },
  { label: 'Bottom', value: 'bottom' },
];

const gadgetOptions: { label: string; value: Gadget }[] = [
  { label: 'Hat', value: 'hat' },
  { label: 'Glasses', value: 'glasses' },
  { label: 'Bracelet', value: 'bracelet' },
  { label: 'Fragrance', value: 'fragrance' },
  { label: 'Watch', value: 'watch' },
];

type EditableItem<T extends clothesType | gadgetType> = T & {
  imageFile?: File;
  modelFileFile?: File;
  modelFilePreview?: string;
  imagePreview?: string;
  scale: number;
  position: [number, number, number];
};

type ItemModalProps<T extends clothesType | gadgetType> = {
  onClose: () => void;
  onSave: (newItem: EditableItem<T>, choice: string) => void;
  item: T;
};

interface SubComponentProps<T extends clothesType | gadgetType> {
  newItem: EditableItem<T>;
  setNewItem: React.Dispatch<React.SetStateAction<EditableItem<T>>>;
}

interface TypeDropdownProps<T extends clothesType | gadgetType> extends SubComponentProps<T> {
  mainCategory: 'Clothing' | 'Gadget' | null;
  setMainCategory: React.Dispatch<React.SetStateAction<'Clothing' | 'Gadget' | null>>;
}

// MAIN COMPONENT
function ItemModal<T extends clothesType | gadgetType>({
  onClose,
  onSave,
  item,
}: ItemModalProps<T>) {
  const [newItem, setNewItem] = useState<EditableItem<T>>({
    ...item,
    scale: item.scale || 1,
    position: item.position || [0, 0, 0],
  } as EditableItem<T>);
  
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  const getInitialCategory = () => {
    if (!item.type) return null;
    const currentType = item.type as string; 
    if (clothingOptions.some(opt => opt.value === currentType)) return 'Clothing';
    if (gadgetOptions.some(opt => opt.value === currentType)) return 'Gadget';
    return null;
  };

  const [mainCategory, setMainCategory] = useState<'Clothing' | 'Gadget' | null>(getInitialCategory());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900/95 border border-white/10 shadow-2xl rounded-3xl p-6 sm:p-8 text-white backdrop-blur-2xl flex flex-col gap-6 custom-scrollbar">
        
        {/* Header Section */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {item._id ? 'Edit Item' : 'Import New Item'}
              </h2>
              <p className="text-xs text-zinc-400">Customize item details, 2D preview, and 3D model</p>
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

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-5">
            <TypeDropdown 
              newItem={newItem} 
              setNewItem={setNewItem} 
              mainCategory={mainCategory}
              setMainCategory={setMainCategory}
            />
            
            <ImageSection 
              newItem={newItem} 
              setNewItem={setNewItem} 
              isRemovingBg={isRemovingBg}
              setIsRemovingBg={setIsRemovingBg}
            />
            
            <ModelSection newItem={newItem} setNewItem={setNewItem} />
          </div>

          <div className="flex flex-col gap-5">
            <DetailsForm newItem={newItem} setNewItem={setNewItem} />
          </div>
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
            disabled={isRemovingBg || !newItem.type || !mainCategory}
            onClick={() => onSave(newItem, mainCategory as string)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 disabled:hover:scale-100"
          >
            {isRemovingBg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {isRemovingBg ? 'Processing Image...' : 'Save Item'}
          </button>
        </div>

      </div>
    </div>
  );
}

// SUB-COMPONENTS
function TypeDropdown<T extends clothesType | gadgetType>({ newItem, setNewItem, mainCategory, setMainCategory }: TypeDropdownProps<T>) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  
  const categoryRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setIsTypeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOptions = mainCategory === 'Clothing' ? clothingOptions : gadgetOptions;

  return (
    <div className="flex flex-col gap-5">
      <div className="relative" ref={categoryRef}>
        <label className={labelStyle}>
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          Primary Category
        </label>
        <button
          type="button"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className={`${baseInputStyle} flex items-center justify-between cursor-pointer text-left`}
        >
          <span className={mainCategory ? 'text-zinc-100 font-medium' : 'text-zinc-500'}>
            {mainCategory || 'Select Clothing or Gadget'}
          </span>
          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180 text-indigo-400' : ''}`} />
        </button>

        {isCategoryOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 z-40 p-1.5 bg-zinc-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
            {['Clothing', 'Gadget'].map((cat) => {
              const isSelected = mainCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setMainCategory(cat as 'Clothing' | 'Gadget');
                    setIsCategoryOpen(false);
                    if (mainCategory !== cat) {
                      setNewItem((prev) => ({ ...prev, type: null as T['type'] }));
                    }
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                  }`}
                >
                  <span>{cat}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {mainCategory && (
        <div className="relative animate-in slide-in-from-top-2 fade-in duration-200" ref={typeRef}>
          <label className={labelStyle}>
            <ListFilter className="w-3.5 h-3.5 text-indigo-400" />
            Specific Type
          </label>
          <button
            type="button"
            onClick={() => setIsTypeOpen(!isTypeOpen)}
            className={`${baseInputStyle} flex items-center justify-between cursor-pointer text-left ${!newItem.type ? 'ring-1 ring-rose-500/50 border-rose-500/30' : ''}`}
          >
            <span className={newItem.type ? 'text-zinc-100 font-medium capitalize' : 'text-rose-400 font-medium'}>
              {newItem.type || `Select a specific ${mainCategory.toLowerCase()} type`}
            </span>
            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isTypeOpen ? 'rotate-180 text-indigo-400' : ''}`} />
          </button>

          {isTypeOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-30 p-1.5 bg-zinc-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150 max-h-48 overflow-y-auto custom-scrollbar">
              {currentOptions.map((opt) => {
                const isSelected = newItem.type === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setNewItem((prev) => ({ ...prev, type: opt.value as T['type'] }));
                      setIsTypeOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ImageSection<T extends clothesType | gadgetType>({ 
  newItem, 
  setNewItem, 
  isRemovingBg, 
  setIsRemovingBg 
}: SubComponentProps<T> & { isRemovingBg: boolean, setIsRemovingBg: (val: boolean) => void }) {
  
  const [autoRemoveBg, setAutoRemoveBg] = useState(true);
  const workerRef = useRef<Worker | null>(null);

  const isScalingRef = useRef(false);
  const startXScaleRef = useRef(0);
  const startScaleValRef = useRef(1);

  const isPanningRef = useRef(false);
  const panStartRef = useRef({ mouseX: 0, mouseY: 0, startPosX: 0, startPosY: 0 });

  useEffect(() => {
    workerRef.current = new Worker(new URL('../../lib/bg-worker.ts', import.meta.url), { type: 'module' });
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleScaleStep = (delta: number) => {
    setNewItem((prev) => {
      const currentVal = prev.scale || 1;
      const updated = Math.max(0.1, parseFloat((currentVal + delta).toFixed(2)));
      return { ...prev, scale: updated };
    });
  };

  const handleImageWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    handleScaleStep(delta);
  };

  const handlePanStart = (e: React.PointerEvent) => {
    if ((e.target as Element).closest('.scale-handle')) return;
    
    e.preventDefault();
    isPanningRef.current = true;
    panStartRef.current = { 
      mouseX: e.clientX, 
      mouseY: e.clientY,
      startPosX: newItem.position[0] || 0,
      startPosY: newItem.position[1] || 0
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePanMove = (e: React.PointerEvent) => {
    if (!isPanningRef.current) return;
    
    const deltaX = e.clientX - panStartRef.current.mouseX;
    const deltaY = e.clientY - panStartRef.current.mouseY;

    const newPosX = parseFloat((panStartRef.current.startPosX + (deltaX / 100)).toFixed(2));
    const newPosY = parseFloat((panStartRef.current.startPosY - (deltaY / 100)).toFixed(2));

    setNewItem((prev) => {
      const newPos = [...prev.position] as [number, number, number];
      newPos[0] = newPosX;
      newPos[1] = newPosY;
      return { ...prev, position: newPos };
    });
  };

  const handlePanEnd = (e: React.PointerEvent) => {
    if (isPanningRef.current) {
      isPanningRef.current = false;
      try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch (err) {}
    }
  };

  const handleResetPosition = () => {
    setNewItem((prev) => {
      const newPos = [...prev.position] as [number, number, number];
      newPos[0] = 0;
      newPos[1] = 0;
      return { ...prev, position: newPos };
    });
  };

  const handleScaleStart = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isScalingRef.current = true;
    startXScaleRef.current = e.clientX;
    startScaleValRef.current = newItem.scale || 1;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleScaleMove = (e: React.PointerEvent) => {
    if (!isScalingRef.current) return;
    const deltaX = e.clientX - startXScaleRef.current;
    const newScale = Math.max(0.1, Math.min(3, parseFloat((startScaleValRef.current + deltaX * 0.01).toFixed(2))));
    setNewItem((prev) => ({ ...prev, scale: newScale }));
  };

  const handleScaleEnd = (e: React.PointerEvent) => {
    if (isScalingRef.current) {
      isScalingRef.current = false;
      try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch (err) {}
    }
  };

  const processImageInWorker = (imageUrl: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) return reject(new Error("Worker not initialized"));
      workerRef.current.onmessage = (event) => {
        const { status, blob, error } = event.data;
        if (status === 'complete') resolve(blob);
        if (status === 'error') reject(new Error(error));
      };
      workerRef.current.postMessage({ imageUrl });
    });
  };

  const processFile = async (file: File) => {
    setIsRemovingBg(true);
    handleResetPosition();

    try {
      let finalFile = file;

      if (autoRemoveBg) {
        const tempUrl = URL.createObjectURL(file);
        const imgBlob = await processImageInWorker(tempUrl);
        const cleanFileName = (file.name || 'pasted-image').replace(/\.[^/.]+$/, '') + '-nobg.png';
        finalFile = new File([imgBlob], cleanFileName, { type: 'image/png' });
        URL.revokeObjectURL(tempUrl);
      }
      
      const previewUrl = URL.createObjectURL(finalFile);

      setNewItem((prev) => ({
        ...prev,
        imageFile: finalFile,
        image: previewUrl,
      }));
    } catch (error) {
      console.error("Worker background removal failed:", error);
      const previewUrl = URL.createObjectURL(file);
      setNewItem((prev) => ({
        ...prev,
        imageFile: file,
        image: previewUrl,
      }));
    } finally {
      setIsRemovingBg(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    e.target.value = ''; 
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isRemovingBg) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            const finalFile = new File([file], file.name || 'pasted-image.png', { type: file.type });
            processFile(finalFile);
            return;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [autoRemoveBg, isRemovingBg]);

  const visualTranslateX = (newItem.position[0] || 0) * 100;
  const visualTranslateY = (newItem.position[1] || 0) * -100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="image-input" className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5 text-indigo-400" />
          Image <span className="text-[10px] text-zinc-500 font-normal lowercase tracking-normal ml-1">(or paste Ctrl+V)</span>
        </label>
        
        <label className="group flex items-center gap-2 cursor-pointer">
          <div className="relative flex items-center justify-center">
            <input 
              type="checkbox" 
              checked={autoRemoveBg}
              onChange={(e) => setAutoRemoveBg(e.target.checked)}
              className="peer appearance-none w-4 h-4 rounded bg-zinc-950/80 border border-white/10 checked:bg-indigo-600 checked:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer group-hover:border-indigo-500/50 shadow-inner"
            />
            <Check className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
          </div>
          <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
            Auto-remove background
          </span>
        </label>
      </div>

      <input
        id="image-input"
        type="file"
        disabled={isRemovingBg}
        accept=".png, .jpg, .jpeg, .webp"
        onChange={handleImageChange}
        className={fileInputStyle}
      />

      {isRemovingBg && (
        <div className="mt-3 flex items-center justify-center gap-3 text-xs text-indigo-400 font-medium py-6 px-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 backdrop-blur-md animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          Processing in background...
        </div>
      )}

      {!isRemovingBg && newItem?.image && (
        <div 
          onWheel={handleImageWheel}
          className="mt-3 relative w-full h-48 rounded-2xl overflow-hidden border border-white/10 bg-zinc-950/80 shadow-inner flex items-center justify-center bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:12px_12px] group select-none"
        >
          <div className="absolute top-2.5 left-2.5 z-10 px-2 py-1 rounded-lg bg-zinc-900/80 border border-white/10 text-[10px] font-medium text-zinc-400 backdrop-blur-md flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none">
            <ZoomIn className="w-3 h-3 text-indigo-400" />
            <span>Scroll/drag handle to scale, click & drag to move</span>
          </div>

          <div 
            onPointerDown={handlePanStart}
            onPointerMove={handlePanMove}
            onPointerUp={handlePanEnd}
            onPointerCancel={handlePanEnd}
            onDoubleClick={handleResetPosition}
            className="relative w-full h-full flex items-center justify-center transition-transform duration-75 cursor-grab active:cursor-grabbing"
            style={{ transform: `translate(${visualTranslateX}px, ${visualTranslateY}px) scale(${newItem.scale || 1})` }}
          >
            <Image
              alt="Preview"
              src={newItem.image}
              fill
              className="object-contain p-4 drop-shadow-xl pointer-events-none"
            />
          </div>

          <div
            onPointerDown={handleScaleStart}
            onPointerMove={handleScaleMove}
            onPointerUp={handleScaleEnd}
            className="scale-handle absolute bottom-2 right-2 z-20 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg cursor-nwse-resize transition-all active:scale-95 flex items-center justify-center group/handle"
            title="Drag horizontally to scale image"
          >
            <MoveDiagonal className="w-4 h-4 group-hover/handle:scale-110 transition-transform" />
          </div>
        </div>
      )}
    </div>
  );
}

function ModelSection<T extends clothesType | gadgetType>({ newItem, setNewItem }: SubComponentProps<T>) {
  return (
    <div>
      <label htmlFor="3d-input" className={labelStyle}>
        <Box className="w-3.5 h-3.5 text-indigo-400" />
        3D Model (.glb / .gltf)
      </label>
      <input
        id="3d-input"
        type="file"
        accept=".glb,.gltf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setNewItem((prev) => ({
              ...prev,
              modelFileFile: file,
              modelFilePreview: URL.createObjectURL(file),
            }));
          }
        }}
        className={fileInputStyle}
      />

      {newItem?.modelFilePreview && (
        <div className="mt-3 h-48 w-full rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 shadow-inner relative">
          <Canvas camera={{ position: [0, 1.5, 5], fov: 20 }}>
            <React.Suspense fallback={<Loader />}>
              <Environment preset="sunset" />
              <Model item={{ ...newItem, modelFile: newItem.modelFilePreview }} />
              <OrbitControls enableDamping dampingFactor={0.05} enableZoom={true} />
            </React.Suspense>
          </Canvas>
        </div>
      )}
    </div>
  );
}

function DetailsForm<T extends clothesType | gadgetType>({ newItem, setNewItem }: SubComponentProps<T>) {
  const handlePositionStep = (axisIndex: number, delta: number) => {
    setNewItem((prev) => {
      const newPos = [...prev.position] as [number, number, number];
      const currentVal = newPos[axisIndex] || 0;
      newPos[axisIndex] = parseFloat((currentVal + delta).toFixed(2));
      return { ...prev, position: newPos };
    });
  };

  const handleScaleStep = (delta: number) => {
    setNewItem((prev) => {
      const currentVal = prev.scale || 1;
      const updated = Math.max(0.1, parseFloat((currentVal + delta).toFixed(2)));
      return { ...prev, scale: updated };
    });
  };

  return (
    <>
      <div>
        <label className={labelStyle}>
          <Tag className="w-3.5 h-3.5 text-indigo-400" />
          Item Name
        </label>
        <input
          type="text"
          value={newItem.name}
          onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="e.g. Vintage Denim Jacket"
          className={baseInputStyle}
        />
      </div>

      <div>
        <label className={labelStyle}>
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          Description
        </label>
        <textarea
          rows={3}
          value={newItem.description}
          onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Add details about fabric, fit, style..."
          className={`${baseInputStyle} resize-none`}
        />
      </div>

      <div>
        <label className={labelStyle}>
          <Move className="w-3.5 h-3.5 text-indigo-400" />
          Position (X, Y, Z)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['X', 'Y', 'Z'].map((axis, index) => (
            <div key={axis} className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-zinc-500 pointer-events-none select-none">
                {axis}
              </span>
              <input
                type="number"
                step="0.1"
                value={newItem.position[index]}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setNewItem((prev) => {
                    const newPos = [...prev.position] as [number, number, number];
                    newPos[index] = val;
                    return { ...prev, position: newPos };
                  });
                }}
                className={`${numberInputStyle} pl-7 pr-7 text-center`}
              />
              <div className="absolute right-1.5 flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => handlePositionStep(index, 0.1)}
                  className="p-0.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handlePositionStep(index, -0.1)}
                  className="p-0.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className={labelStyle}>
          <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
          Scale (Image & 3D Model)
        </label>
        <div className="relative flex items-center">
          <input
            type="number"
            step="0.1"
            value={newItem.scale}
            onChange={(e) => setNewItem((prev) => ({ ...prev, scale: parseFloat(e.target.value) || 1 }))}
            className={`${numberInputStyle} pr-8`}
          />
          <div className="absolute right-1.5 flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => handleScaleStep(0.1)}
              className="p-0.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors cursor-pointer"
            >
              <ChevronUp className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => handleScaleStep(-0.1)}
              className="p-0.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors cursor-pointer"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ItemModal;