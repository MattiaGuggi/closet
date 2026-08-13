'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from './components/header';
import Image from 'next/image';
import gsap from 'gsap';
import { useUser } from './context/UserContext';
import { Shirt, Sparkles, Box, Layers, ArrowUpRight } from 'lucide-react';

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
      y: 60,
    });
    gsap.to('.presentation-card', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power3.out',
    });
  }, []);

  return (
    <>
      <div id="home-section" className="w-full max-w-6xl mx-auto px-6 py-12 flex flex-col items-center">
        
        {/* Hero Section */}
        <div className="w-full rounded-3xl bg-gradient-to-b from-indigo-950/40 via-zinc-900/60 to-zinc-900/30 border border-white/10 p-10 sm:p-16 text-center backdrop-blur-2xl relative overflow-hidden my-6 shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-indigo-500/15 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Virtual Wardrobe
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
            Build & Visualize Your Perfect Outfits
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload custom garments, arrange items in interactive 2D rows, or switch into high-fidelity 3D mode.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
              onClick={() => router.push('/closet')}
            >
              <Shirt className="w-4 h-4" /> Open Closet Studio
            </button>
            <button
              className="px-6 py-3.5 bg-zinc-800/80 hover:bg-zinc-800 border border-white/10 text-zinc-200 font-semibold text-sm rounded-xl transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
              onClick={() => router.push('/profile')}
            >
              <span>Your Outfits</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Features Showcase */}
        <div className="w-full py-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Studio Capabilities</h2>
            <p className="text-xs text-zinc-400 mt-2">Everything you need to master your wardrobe</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="presentation-card p-8 bg-zinc-900/50 border border-white/10 rounded-2xl backdrop-blur-xl hover:border-indigo-500/30 transition-all hover:scale-[1.02] flex flex-col items-center text-center group">
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <Shirt className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Upload Custom Clothes</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">High resolution image uploads with 3D model GLTF attachment support.</p>
            </div>

            <div className="presentation-card p-8 bg-zinc-900/50 border border-white/10 rounded-2xl backdrop-blur-xl hover:border-indigo-500/30 transition-all hover:scale-[1.02] flex flex-col items-center text-center group">
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Mix & Match Engine</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Smoothly slide through tops, mids, and bottoms to find perfect combinations.</p>
            </div>

            <div className="presentation-card p-8 bg-zinc-900/50 border border-white/10 rounded-2xl backdrop-blur-xl hover:border-indigo-500/30 transition-all hover:scale-[1.02] flex flex-col items-center text-center group">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Box className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Interactive 3D Stage</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Inspect clothes with Three.js orbit controls in real-time lighting environments.</p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Home;