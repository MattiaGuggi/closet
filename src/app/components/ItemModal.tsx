import Image from 'next/image';
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import Model from './model';
import { Loader } from './Loader';
import { clothesType, EditableClothesType, Position } from '@/lib/types';

const ItemModal = ({ onClose, onSave, item }: { onClose: () => void, onSave: (newItem: EditableClothesType) => void, item: clothesType }) => {
  const [newItem, setNewItem] = useState<EditableClothesType>(item);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 min-h-screen">
      <div className='bg-white shadow-lg rounded-lg p-6'>
        <div className="grid grid-cols-2 gap-20 place-content-center">
          <div className='flex flex-col items-start gap-2'>
            <h2 className="text-2xl font-bold mb-4">Import New Item</h2>
            <select
              id="item-type"
              value={newItem.type ?? ""}
              className='border border-gray-300 rounded-lg p-2 mb-4 w-full'
              onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value as Position }))}
            >
              <option value="">Select item type</option>
              <option value="top">Top</option>
              <option value="mid">Mid</option>
              <option value="bottom">Bottom</option>
            </select>

            {/* IMAGE UPLOAD */}
            <label htmlFor="image-input">Image</label>
            <input
              id='image-input'
              type="file"
              accept='.png, .jpg, .jpeg, .webp'
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setNewItem(prev => ({
                    ...prev,
                    imageFile: file,
                    image: URL.createObjectURL(file) // preview only
                  }));
                }
              }}
              className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
            />
            {newItem?.image && <Image alt='Preview' src={newItem.image} width={176} height={176} className='w-44 h-44 object-cover mx-auto mb-2' /> }

            {/* 3D MODEL UPLOAD */}
            <label htmlFor="3d-input">3D Model</label>
            <input
              id='3d-input'
              type="file"
              accept=".glb,.gltf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setNewItem(prev => ({
                    ...prev,
                    modelFileFile: file, // Keep the File separately
                    modelFilePreview: URL.createObjectURL(file), // Preview URL
                  }));
                }
              }}
              className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
            />
            {newItem?.modelFilePreview && (
              <Canvas camera={{ position: [0, 1.5, 5], fov: 20 }}>
                <React.Suspense fallback={<Loader />}>
                  <Environment preset="sunset" />
                  <Model item={{ ...newItem, modelFile: newItem.modelFilePreview }} />
                  <OrbitControls enableDamping dampingFactor={0.05} enableZoom={true} />
                </React.Suspense>
              </Canvas>
            )}
          </div>

          {/* TEXT FIELDS */}
          <div className='flex flex-col items-start gap-2'>
            <label>Name</label>
            <input type="text" value={newItem.name} onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))} className="border p-2 mb-4 w-full" />

            <label>Description</label>
            <input type="text" value={newItem.description} onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))} className="border p-2 mb-4 w-full" />

            <label>Position X</label>
            <input type="number" value={newItem.position[0]} onChange={(e) => setNewItem(prev => ({ ...prev, position: [parseFloat(e.target.value)||0, prev.position[1], prev.position[2]] }))} className="border p-2 mb-4 w-full" />
            <label>Position Y</label>
            <input type="number" value={newItem.position[1]} onChange={(e) => setNewItem(prev => ({ ...prev, position: [prev.position[0], parseFloat(e.target.value)||0, prev.position[2]] }))} className="border p-2 mb-4 w-full" />
            <label>Position Z</label>
            <input type="number" value={newItem.position[2]} onChange={(e) => setNewItem(prev => ({ ...prev, position: [prev.position[0], prev.position[1], parseFloat(e.target.value)||0] }))} className="border p-2 mb-4 w-full" />

            <label>Scale</label>
            <input type="number" value={newItem.scale} onChange={(e) => setNewItem(prev => ({ ...prev, scale: parseFloat(e.target.value)||0 }))} className="border p-2 mb-4 w-full" />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className='flex w-full justify-around mt-4'>
          <button className="w-1/4 px-4 py-2 text-lg font-semibold bg-gradient-to-br from-blue-500 to-indigo-800 text-white rounded-lg" onClick={() => onSave(newItem)}>Save</button>
          <button
              className="cursor-pointer hover:scale-105 duration-200 transition-all w-1/4 px-4 py-2 text-lg font-semibold
              text-transparent bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text shadow-lg rounded-xl"
              onClick={onClose}
          >
              Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
