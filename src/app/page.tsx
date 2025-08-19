'use client';
import React, { use, useEffect } from 'react';
import { useUser } from './context/UserContext';
import { useRouter } from 'next/navigation';
import Header from './components/header';
import Image from 'next/image';
import gsap from 'gsap';

const Home = () => {
  const { isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  useEffect(() => {
    gsap.set('.presentation-card', {
      opacity: 0,
      y: 120,
    });
    gsap.to('.presentation-card', {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.2,
      ease: 'power2.out',
    });
  }, []);

  return (
    <>
      <Header />
      <div id='home-section' className="w-full min-h-screen flex flex-col items-center justify-start overflow-hidden">
        {/* Hero */}
        <div className="w-full h-[40vh] flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-32 text-center">
          <h1 className="text-5xl font-bold mb-4">Build Your Perfect Outfit</h1>
          <p className="text-xl mb-8">Upload clothes or use our 3D library to create outfits.</p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 hover:scale-105 duration-200
              transition-all cursor-pointer"
              onClick={() => router.push('/closet')}
            >
              Upload Clothes
            </button>
            <button className="bg-gradient-to-br from-blue-500 to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gradient-to-br
            hover:from-blue-600 hover:to-indigo-800 hover:scale-105 duration-200
              transition-all cursor-pointer"
              onClick={() => router.push('/profile')}
            >
              Your Outfits
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="py-20 text-center min-h-[70vh]">
          <h2 className="text-4xl font-bold mb-12 bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            <div className="presentation-card p-6 bg-white rounded-xl shadow-lg">
              <Image src="/images/hoodie.webp" width={50} height={50} alt="Upload" className="mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent">Upload Your Clothes</h3>
              <p>Support for images to customize your wardrobe.</p>
            </div>
            <div className="presentation-card p-6 bg-white rounded-xl shadow-lg">
              <Image src="/images/hoodie.webp" width={50} height={50} alt="Mix" className="mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent">Mix & Match</h3>
              <p>Scroll through your items to create stylish outfits easily.</p>
            </div>
            <div className="presentation-card p-6 bg-white rounded-xl shadow-lg">
              <Image src="/images/hoodie.webp" width={50} height={50} alt="3D" className="mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent">Try in 3D</h3>
              <p>Rotate, scale, and view your outfit in full 3D.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
