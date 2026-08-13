'use client';

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import Image from "next/image";
import Model from "./model";
import { clothesType, Position } from "@/lib/types";
import { Loader } from "./Loader";

type ClosetRowsProps = {
  items: clothesType[]; // Riceve i capi direttamente dal padre
  currentItemState: { top: number; mid: number; bottom: number };
  handleClick: (dir: "left" | "right", pos: Position) => void;
  three: boolean;
};

export default function ClosetRows({ items, currentItemState, handleClick, three }: ClosetRowsProps) {
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});
  const positions: Position[] = ["top", "mid", "bottom"];

  // Pre-carica i modelli 3D quando la prop items cambia
  useEffect(() => {
    for (const item of items) {
      if (item.modelFile) {
        useGLTF.preload(item.modelFile);
      }
    }
  }, [items]);

  const handleImageLoad = (itemKey: string) => {
    setLoadedImages((prev) => ({ ...prev, [itemKey]: true }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-4 p-3 sm:p-4 rounded-3xl bg-zinc-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col gap-3">
      {positions.map((pos: Position) => {
        const itemsOfType = items.filter(item => item.type === pos);
        const currentItem = itemsOfType[currentItemState[pos]];
        const itemKey = currentItem ? String(currentItem._id || currentItem.name) : '';

        return (
          <section 
            key={pos} 
            className="closet-row relative flex items-center justify-between w-full h-[28vh] min-h-[220px] sm:min-h-[260px] px-4 py-2 rounded-2xl bg-zinc-950/50 border border-white/5 hover:border-white/15 transition-all overflow-hidden group shadow-inner"
          >
            {/* Label indicatore di livello */}
            <div className="absolute top-3 left-4 flex items-center gap-2 z-10">
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-white/10 text-[11px] font-bold uppercase tracking-wider text-indigo-400 backdrop-blur-md shadow-sm">
                {pos}
              </span>
            </div>

            {/* Nome del Capo Corrente */}
            {currentItem?.name && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-zinc-900/80 border border-white/10 text-xs font-medium text-zinc-300 backdrop-blur-md z-10 flex items-center gap-1.5 shadow-md pointer-events-none">
                <Tag className="w-3 h-3 text-indigo-400" />
                <span>{currentItem.name}</span>
              </div>
            )}

            {/* Left Nav Button */}
            <button
              type="button"
              onClick={() => handleClick("left", pos)}
              className="p-3 rounded-2xl bg-zinc-900/80 hover:bg-indigo-600 text-zinc-300 hover:text-white border border-white/10 transition-all hover:scale-110 active:scale-95 cursor-pointer z-20 backdrop-blur-md shadow-xl"
              aria-label={`Previous ${pos} Item`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Stage Canvas / Image Container */}
            <div className="scene-wrapper w-full h-full flex justify-center items-center relative py-2" id={`${pos}-wrapper`}>
              <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />

              {three ? (
                <>
                  {currentItem && currentItem.modelFile ? (
                    <Canvas camera={{ position: [0, 0, 2.6], fov: 28 }}>
                      <React.Suspense fallback={<Loader />}>
                        <Environment preset="sunset" />
                        <Model item={currentItem} />
                        <OrbitControls enableDamping dampingFactor={0.05} enableZoom={true} />
                      </React.Suspense>
                    </Canvas>
                  ) : (
                    <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider bg-zinc-900/40 px-4 py-2 rounded-xl border border-white/5">
                      No 3D model
                    </div>
                  )}
                </>
              ) : (
                <>
                  {itemsOfType.length === 0 && (
                    <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider bg-zinc-900/40 px-4 py-2 rounded-xl border border-white/5">
                      No items available
                    </div>
                  )}
                  {currentItem && (
                    <div className="relative w-full h-full max-w-[340px] flex items-center justify-center p-2">
                      {!loadedImages[itemKey] && (
                        <div className="absolute inset-4 animate-pulse bg-zinc-800/40 rounded-2xl border border-white/5" />
                      )}
                      <Image
                        key={itemKey}
                        src={currentItem.image}
                        alt={currentItem.name}
                        fill
                        sizes="(max-width: 768px) 80vw, 40vw"
                        priority
                        className={`closet-image object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] transition-all duration-300 hover:scale-105 ${
                          loadedImages[itemKey] ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                        onLoad={() => handleImageLoad(itemKey)}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right Nav Button */}
            <button
              type="button"
              onClick={() => handleClick("right", pos)}
              className="p-3 rounded-2xl bg-zinc-900/80 hover:bg-indigo-600 text-zinc-300 hover:text-white border border-white/10 transition-all hover:scale-110 active:scale-95 cursor-pointer z-20 backdrop-blur-md shadow-xl"
              aria-label={`Next ${pos} Item`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

          </section>
        );
      })}
    </div>
  );
}