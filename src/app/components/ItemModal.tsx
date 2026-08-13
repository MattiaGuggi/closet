'use client';

import Image from 'next/image';
import React, { useState } from 'react';
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
  ChevronDown
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
  const [newItem, setNewItem] = useState<EditableClothesType>(item);
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  // Custom Input Styles (includes hiding default spin buttons)
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
      const currentVal = prev.scale || 0;
      const updated = Math.max(0, parseFloat((currentVal + delta).toFixed(2)));
      return { ...prev, scale: updated };
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsRemovingBg(true);

    try {
      const blob = await removeBackground(file);
      const cleanFileName = file.name.replace(/\.[^/.]+$/, '') + '-nobg.png';
      const cleanFile = new File([blob], cleanFileName, { type: 'image/png' });
      const previewUrl = URL.createObjectURL(cleanFile);

      setNewItem((prev) => ({
        ...prev,
        imageFile: cleanFile,
        image: previewUrl,
      }));
    } catch (error) {
      console.error('Failed to remove background, falling back to original image:', error);
      setNewItem((prev) => ({
        ...prev,
        imageFile: file,
        image: URL.createObjectURL(file),
      }));
    } finally {
      setIsRemovingBg(false);
    }
  };

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
            
            {/* Item Type */}
            <div>
              <label htmlFor="item-type" className={labelStyle}>
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Item Type
              </label>
              <select
                id="item-type"
                value={newItem.type ?? ''}
                className={baseInputStyle}
                onChange={(e) =>
                  setNewItem((prev) => ({ ...prev, type: e.target.value as Position }))
                }
              >
                <option value="" className="bg-zinc-900 text-zinc-400">Select item type</option>
                <option value="top" className="bg-zinc-900 text-white">Top</option>
                <option value="mid" className="bg-zinc-900 text-white">Mid</option>
                <option value="bottom" className="bg-zinc-900 text-white">Bottom</option>
              </select>
            </div>

            {/* 2D Image Upload */}
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

              {/* Loading Indicator for AI Background Removal */}
              {isRemovingBg && (
                <div className="mt-3 flex items-center justify-center gap-3 text-xs text-indigo-400 font-medium py-6 px-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 backdrop-blur-md animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  Removing background...
                </div>
              )}

              {/* Image Preview Area */}
              {!isRemovingBg && newItem?.image && (
                <div className="mt-3 relative w-full h-44 rounded-2xl overflow-hidden border border-white/10 bg-zinc-950/80 shadow-inner flex items-center justify-center bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:12px_12px]">
                  <Image
                    alt="Preview"
                    src={newItem.image}
                    fill
                    className="object-contain p-3 drop-shadow-lg"
                  />
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

            {/* Position (X, Y, Z) with Custom Spin Buttons */}
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
                    {/* Custom Up/Down Arrows */}
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

            {/* Scale with Custom Spin Buttons */}
            <div>
              <label className={labelStyle}>
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                3D Model Scale
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  step="0.1"
                  value={newItem.scale}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, scale: parseFloat(e.target.value) || 0 }))}
                  className={`${numberInputStyle} pr-8`}
                />
                {/* Custom Up/Down Arrows */}
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