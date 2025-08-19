'use client'
import axios from 'axios'
import Image from 'next/image';
import React from 'react'
import { useUser } from '../context/UserContext';

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
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
                <label htmlFor="">Pfp</label>
                <input
                    type="file"
                    accept='png/jpg/jpeg'
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
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                />
                <Image alt='New Item Image' src={user?.pfp || "www.starksfamilyfh.com"} width={100} height={100} className='my-5 rounded-full' />
                <input
                    type="text"
                    placeholder="Username"
                    value={user?.username || ""}
                    onChange={(e) =>
                        setUser((prev) => (prev ? { ...prev, username: e.target.value } : null))
                    }
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={user?.email || ""}
                    onChange={(e) =>
                        setUser((prev) => (prev ? { ...prev, email: e.target.value } : null))
                    }
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={user?.password || ""}
                    onChange={(e) =>
                        setUser((prev) => (prev ? { ...prev, password: e.target.value } : null))
                    }
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                />
                <div className='flex w-full justify-around mt-4'>
                    <button
                        className="cursor-pointer w-1/3 mt-4 px-4 py-2 text-lg font-semibold bg-gradient-to-br from-blue-500 to-indigo-800 text-white rounded-lg hover:bg-gradient-to-br
                        shadow-lg hover:from-blue-600 hover:to-indigo-900 duration-200 transition-all hover:scale-105"
                        onClick={handleSave}
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

export default UserModal
