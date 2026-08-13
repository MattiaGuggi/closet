'use client'
import axios from 'axios'
import Image from 'next/image';
import React from 'react'
import { useUser } from '../context/UserContext';
import { X, Upload, Save } from 'lucide-react';

const UserModal = ({ onClose }: { onClose: () => void }) => {
  const { user, setUser } = useUser();

  const handleSave = async () => {
    if (user) {
      const response = await axios.post('/api/updateUser', { user });
      const data = response.data;

      if (data.sucess) localStorage.setItem('user', JSON.stringify(user));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Edit Profile Details</h2>

        <div className="space-y-4">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border border-white/10 bg-zinc-950">
              <Image
                alt='New Item Image'
                src={user?.pfp || "/default-pfp.png"}
                fill
                className='object-cover'
              />
            </div>
            <label className="cursor-pointer text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Change Avatar</span>
              <input
                id='pfp-input'
                name='pfp-input'
                type="file"
                accept='.png, .jpg, .jpeg'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setUser((prev) => prev ? { ...prev, pfp: event.target?.result as string } : null);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Username</label>
            <input
              type="text"
              placeholder="Username"
              value={user?.username || ""}
              onChange={(e) =>
                setUser((prev) => (prev ? { ...prev, username: e.target.value } : null))
              }
              className="w-full px-4 py-3 rounded-xl bg-zinc-950/60 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={user?.email || ""}
              onChange={(e) =>
                setUser((prev) => (prev ? { ...prev, email: e.target.value } : null))
              }
              className="w-full px-4 py-3 rounded-xl bg-zinc-950/60 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={user?.password || ""}
              onChange={(e) =>
                setUser((prev) => (prev ? { ...prev, password: e.target.value } : null))
              }
              className="w-full px-4 py-3 rounded-xl bg-zinc-950/60 border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className='flex items-center gap-3 pt-4'>
            <button
              className="flex-1 py-3 px-4 font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer"
              onClick={handleSave}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            <button
              className="py-3 px-4 font-semibold text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default UserModal;