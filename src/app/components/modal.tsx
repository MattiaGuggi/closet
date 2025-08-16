import React from 'react'

const Modal = ({ onClose }: { onClose: () => void; }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Import New Item</h2>
        <input type="file" accept='glb/gltf' />
        <button
            className="cursor-pointer w-1/3 mt-4 px-4 py-2 bg-gradient-to-br from-blue-500 to-indigo-800 text-white rounded-lg hover:bg-gradient-to-br
            hover:from-blue-600 hover:to-indigo-900 duration-200 transition-all hover:scale-105"
            onClick={onClose}
        >
            Close
        </button>
        </div>
    </div>
  )
}

export default Modal
