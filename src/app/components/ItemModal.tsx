'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { removeBackground } from '@imgly/background-removal';
import Model from './model';
import { Loader } from './Loader';
import { clothesType, EditableClothesType, Position } from '@/lib/types';

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

  // Common styles for consistency
  const inputStyle = 'w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-800 bg-white';
  const labelStyle = 'text-sm font-semibold text-gray-700 mb-1 block';
  const fileInputStyle = 'w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer border border-gray-300 rounded-lg p-1 bg-white disabled:opacity-50';

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsRemovingBg(true);

    try {
      // 1. Remove background directly in browser
      const blob = await removeBackground(file);

      // 2. Convert transparent blob back into a PNG File object
      const cleanFileName = file.name.replace(/\.[^/.]+$/, '') + '-nobg.png';
      const cleanFile = new File([blob], cleanFileName, { type: 'image/png' });

      // 3. Update state with transparent PNG preview
      const previewUrl = URL.createObjectURL(cleanFile);
      setNewItem((prev) => ({
        ...prev,
        imageFile: cleanFile,
        image: previewUrl,
      }));
    } catch (error) {
      console.error('Failed to remove background, falling back to original image:', error);
      // Fallback to raw file if processing fails
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
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
          Import / Edit Item
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT COLUMN: TYPE & MEDIA UPLOADS */}
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="item-type" className={labelStyle}>
                Item Type
              </label>
              <select
                id="item-type"
                value={newItem.type ?? ''}
                className={inputStyle}
                onChange={(e) =>
                  setNewItem((prev) => ({ ...prev, type: e.target.value as Position }))
                }
              >
                <option value="">Select item type</option>
                <option value="top">Top</option>
                <option value="mid">Mid</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>

            {/* IMAGE UPLOAD WITH BG REMOVAL */}
            <div>
              <label htmlFor="image-input" className={labelStyle}>
                Image (Background automatically removed)
              </label>
              <input
                id="image-input"
                type="file"
                disabled={isRemovingBg}
                accept=".png, .jpg, .jpeg, .webp"
                onChange={handleImageChange}
                className={fileInputStyle}
              />

              {/* LOADING STATE */}
              {isRemovingBg && (
                <div className="mt-3 flex items-center justify-center gap-2 text-sm text-indigo-600 font-medium py-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  Removing background...
                </div>
              )}

              {/* IMAGE PREVIEW */}
              {!isRemovingBg && newItem?.image && (
                <div className="mt-3 relative w-44 h-44 mx-auto rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:12px_12px]">
                  <Image
                    alt="Preview"
                    src={newItem.image}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              )}
            </div>

            {/* 3D MODEL UPLOAD */}
            <div>
              <label htmlFor="3d-input" className={labelStyle}>
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
                <div className="mt-3 h-48 w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-inner">
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
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelStyle}>Name</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Item name"
                className={inputStyle}
              />
            </div>

            <div>
              <label className={labelStyle}>Description</label>
              <textarea
                rows={3}
                value={newItem.description}
                onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Item description"
                className={inputStyle}
              />
            </div>

            {/* POSITION FIELDS IN GRID */}
            <div>
              <label className={labelStyle}>Position (X, Y, Z)</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-xs font-medium text-gray-500 mb-1 block">X</span>
                  <input
                    type="number"
                    step="0.1"
                    value={newItem.position[0]}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        position: [parseFloat(e.target.value) || 0, prev.position[1], prev.position[2]],
                      }))
                    }
                    className={inputStyle}
                  />
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 mb-1 block">Y</span>
                  <input
                    type="number"
                    step="0.1"
                    value={newItem.position[1]}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        position: [prev.position[0], parseFloat(e.target.value) || 0, prev.position[2]],
                      }))
                    }
                    className={inputStyle}
                  />
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 mb-1 block">Z</span>
                  <input
                    type="number"
                    step="0.1"
                    value={newItem.position[2]}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        position: [prev.position[0], prev.position[1], parseFloat(e.target.value) || 0],
                      }))
                    }
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelStyle}>Scale</label>
              <input
                type="number"
                step="0.1"
                value={newItem.scale}
                onChange={(e) => setNewItem((prev) => ({ ...prev, scale: parseFloat(e.target.value) || 0 }))}
                className={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex w-full justify-end gap-4 mt-8 pt-4 border-t border-gray-100">
          <button
            type="button"
            disabled={isRemovingBg}
            className="px-6 py-2.5 cursor-pointer text-sm font-semibold text-gray-600 hover:text-gray-800 rounded-xl transition-all disabled:opacity-50"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            disabled={isRemovingBg}
            className="px-6 py-2.5 hover:scale-105 duration-200 transition-all cursor-pointer text-sm font-semibold bg-gradient-to-br from-blue-500 to-indigo-800 text-white rounded-xl shadow-md hover:shadow-lg disabled:opacity-50"
            onClick={() => onSave(newItem)}
          >
            Save Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;