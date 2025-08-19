import Image from 'next/image';
import React, { useState } from 'react'
import { clothesType, Position } from '@/lib/types';

const ItemModal = ({ onClose, onSave, item }: { onClose: () => void, onSave: (newItem: clothesType) => void, item: clothesType }) => {
  const [newItem, setNewItem] = useState<clothesType>(item);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Import New Item</h2>
        <select name="type" id="item-type" className='border border-gray-300 rounded-lg p-2 mb-4 w-full' onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value as Position }))}>
          <option value="">Select item type</option>
          <option value="top">Top</option>
          <option value="mid">Mid</option>
          <option value="bottom">Bottom</option>
        </select>
        <label htmlFor="">Image</label>
        <input type="file" accept='png/jpg/jpeg' onChange={(e) => setNewItem(prev => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                setNewItem({ ...prev, image: e.target?.result as string });
              };
              reader.readAsDataURL(file);
            }
            return { ...prev, image: file ? URL.createObjectURL(file) : '' };
          })}
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
        />
        <Image alt='New Item Image' src={newItem.image} width={175} height={175} />
        <label htmlFor="">3D Model</label>
        <input type="file" accept='glb/gltf' onChange={(e) => setNewItem(prev => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                setNewItem({ ...prev, modelFile: e.target?.result as string });
              };
              reader.readAsDataURL(file);
            }
            return { ...prev, modelFile: file ? URL.createObjectURL(file) : '' };
          })}
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
        />
        <input type="text" placeholder='Name' onChange={(e) => {
            setNewItem(prev => ({ ...prev, name: e.target.value }));
          }}
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
        />
        <input type="text" placeholder='Description' onChange={(e) => {
            setNewItem(prev => ({ ...prev, description: e.target.value }));
          }}
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
        />
        <input type="number" placeholder='Position X' value={newItem.position[0]} onChange={(e) => {
            const val = parseFloat(e.target.value) || 0;
            setNewItem(prev => ({ ...prev, position: [val, prev.position[1], prev.position[2]] }));
          }}
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
        />

        <input type="number" placeholder='Position Y' value={newItem.position[1]} onChange={(e) => {
            const val = parseFloat(e.target.value) || 0;
            setNewItem(prev => ({ ...prev, position: [prev.position[0], val, prev.position[2]] }));
          }}
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
        />

        <input type="number" placeholder='Position Z' value={newItem.position[2]} onChange={(e) => {
            const val = parseFloat(e.target.value) || 0;
            setNewItem(prev => ({ ...prev, position: [prev.position[0], prev.position[1], val] }));
          }}
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
        />

        <input type="number" min={0} placeholder='Scale' onChange={(e) => {
            setNewItem(prev => ({ ...prev, scale: parseFloat(e.target.value) || 0 }));
          }}
          className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
        />
        <div className='flex w-full justify-around mt-4'>
          <button
              className="cursor-pointer w-1/3 mt-4 px-4 py-2 text-lg font-semibold bg-gradient-to-br from-blue-500 to-indigo-800 text-white rounded-lg hover:bg-gradient-to-br
              shadow-lg hover:from-blue-600 hover:to-indigo-900 duration-200 transition-all hover:scale-105"
              onClick={() => onSave(newItem)}
          >
              Save
          </button>
          <button
              className="cursor-pointer w-1/3 mt-4 px-4 py-2 font-semibold text-lg text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-indigo-800 rounded-lg hover:bg-gradient-to-br
              shadow-lg hover:from-blue-600 hover:to-indigo-900 duration-200 transition-all hover:scale-105"
              onClick={onClose}
          >
              Close
          </button>
        </div>
        </div>
    </div>
  )
}

export default ItemModal
