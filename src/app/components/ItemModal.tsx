'use client';

import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { removeBackground } from '@imgly/background-removal';
import Model from './model';
import { Loader } from './Loader';
import { clothesType, EditableClothesType, Position } from '@/lib/types';
import { 
  X, 
  Sparkles, 
  Box, 
  Tag, 
  FileText, 
  Layers, 
  Move, 
  Maximize2, 
  Upload, 
  Loader2, 
  Check,
  ChevronUp,
  ChevronDown,
  MoveDiagonal,
  ZoomIn
} from 'lucide-react';

const ItemModal = ({
  onClose,
  onSave,
  item,
}: {
  onClose: () => void;
  onSave: (newItem: EditableClothesType) => void;
  item: clothesType;
}) => {
  const [newItem, setNewItem] = useState<EditableClothesType>({
    ...item,
    scale: item.scale || 1,
  });
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Drag scaling refs
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScaleRef = useRef(1);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Custom Input Styles
  const baseInputStyle = 
    'w-full px-3.5 py-2.5 bg-zinc-950/60 border border-white/10 rounded-xl shadow-inner text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all';
  
  const numberInputStyle = 
    `${baseInputStyle} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;

  const labelStyle = 
    'text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5';
  
  const fileInputStyle = 
    'w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer border border-white/10 rounded-xl p-1 bg-zinc-950/40 disabled:opacity-50 transition-all';

  // Helper function to update position smoothly
  const handlePositionStep = (axisIndex: number, delta: number) => {
    setNewItem((prev) => {
      const newPos = [...prev.position] as [number, number, number];
      const currentVal = newPos[axisIndex] || 0;
      newPos[axisIndex] = parseFloat((currentVal + delta).toFixed(2));
      return { ...prev, position: newPos };
    });
  };

  // Helper function to update scale smoothly
  const handleScaleStep = (delta: number) => {
    setNewItem((prev) => {
      const currentVal = prev.scale || 1;
      const updated = Math.max(0.1, parseFloat((currentVal + delta).toFixed(2)));
      return { ...prev, scale: updated };
    });
  };

  // Scroll wheel scaling handler for image preview
  const handleImageWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    handleScaleStep(delta);
  };

  // Pointer drag scaling handlers (drag handle at bottom-right of preview)
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startScaleRef.current = newItem.scale || 1;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    const newScale = Math.max(0.1, Math.min(3, parseFloat((startScaleRef.current + deltaX * 0.01).toFixed(2))));
    setNewItem((prev) => ({ ...prev, scale: newScale }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {
        // Ignore if pointer capture already released
      }
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsRemovingBg(true);

    try {
      const blob = await removeBackground(file);
      const cleanFileName = file.name.replace(/\.[^/.]+$/, '') + '-nobg.png';
      const cleanFile = new File([blob], cleanFileName, { type: 'image/png' });
      
      // Convert to Base64
      const base64Image = await fileToBase64(cleanFile);

      setNewItem((prev) => ({
        ...prev,
        imageFile: cleanFile,
        image: base64Image, // Persistent Data URL
      }));
    } catch (error) {
      const base64Image = await fileToBase64(file);
      setNewItem((prev) => ({
        ...prev,
        imageFile: file,
        image: base64Image,
      }));
    } finally {
      setIsRemovingBg(false);
    }
  };

  const fileToBase64 = (file: File | Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const typeOptions: { label: string; value: Position }[] = [
    { label: 'Top', value: 'top' },
    { label: 'Mid', value: 'mid' },
    { label: 'Bottom', value: 'bottom' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900/95 border border-white/10 shadow-2xl rounded-3xl p-6 sm:p-8 text-white backdrop-blur-2xl flex flex-col gap-6">
        
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
          
          {/* LEFT COLUMN: TYPE & MEDIA UPLOADS */}
          <div className="flex flex-col gap-5">
            
            {/* Custom Styled Select Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <label className={labelStyle}>
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Item Type
              </label>
              <button
                type="button"
                onClick={() => setIsTypeDropdownOpen((prev) => !prev)}
                className={`${baseInputStyle} flex items-center justify-between cursor-pointer text-left`}
              >
                <span className={newItem.type ? 'text-zinc-100 font-medium capitalize' : 'text-zinc-500'}>
                  {newItem.type || 'Select item type'}
                </span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isTypeDropdownOpen ? 'rotate-180 text-indigo-400' : ''}`} />
              </button>

              {/* Custom Options Menu */}
              {isTypeDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-30 p-1.5 bg-zinc-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
                  {typeOptions.map((opt) => {
                    const isSelected = newItem.type === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setNewItem((prev) => ({ ...prev, type: opt.value }));
                          setIsTypeDropdownOpen(false);
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

            {/* 2D Image Upload & Interactive Canvas */}
            <div>
              <label htmlFor="image-input" className={labelStyle}>
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                Image (Auto AI Background Removal)
              </label>
              <input
                id="image-input"
                type="file"
                disabled={isRemovingBg}
                accept=".png, .jpg, .jpeg, .webp"
                onChange={handleImageChange}
                className={fileInputStyle}
              />

              {/* Loading Indicator */}
              {isRemovingBg && (
                <div className="mt-3 flex items-center justify-center gap-3 text-xs text-indigo-400 font-medium py-6 px-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 backdrop-blur-md animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  Removing background...
                </div>
              )}

              {/* Interactive Image Scaling Preview Container */}
              {!isRemovingBg && newItem?.image && (
                <div 
                  onWheel={handleImageWheel}
                  className="mt-3 relative w-full h-48 rounded-2xl overflow-hidden border border-white/10 bg-zinc-950/80 shadow-inner flex items-center justify-center bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:12px_12px] group select-none"
                >
                  {/* Visual scale hint badge */}
                  <div className="absolute top-2.5 left-2.5 z-10 px-2 py-1 rounded-lg bg-zinc-900/80 border border-white/10 text-[10px] font-medium text-zinc-400 backdrop-blur-md flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-3 h-3 text-indigo-400" />
                    <span>Scroll or drag handle to scale ({newItem.scale || 1}x)</span>
                  </div>

                  {/* Resizable Image */}
                  <div 
                    className="relative w-full h-full flex items-center justify-center transition-transform duration-75"
                    style={{ transform: `scale(${newItem.scale || 1})` }}
                  >
                    <Image
                      alt="Preview"
                      src={newItem.image}
                      fill
                      className="object-contain p-4 drop-shadow-xl pointer-events-none"
                    />
                  </div>

                  {/* Corner Drag Scale Handle */}
                  <div
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className="absolute bottom-2 right-2 z-20 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg cursor-nwse-resize transition-all active:scale-95 flex items-center justify-center group/handle"
                    title="Drag horizontally to scale image"
                  >
                    <MoveDiagonal className="w-4 h-4 group-hover/handle:scale-110 transition-transform" />
                  </div>
                </div>
              )}
            </div>

            {/* 3D Model Upload */}
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
          </div>

          {/* RIGHT COLUMN: TEXT & NUMERIC FIELDS */}
          <div className="flex flex-col gap-5">
            
            {/* Name */}
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

            {/* Description */}
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

            {/* Position (X, Y, Z) */}
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

            {/* Scale Sync Field */}
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

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-2">
          <button
            type="button"
            disabled={isRemovingBg}
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isRemovingBg}
            onClick={() => onSave(newItem)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            Save Item
          </button>
        </div>

      </div>
    </div>
  );
};

export default ItemModal;