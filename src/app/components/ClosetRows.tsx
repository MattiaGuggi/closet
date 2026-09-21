'use client';
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import Image from "next/image";
import Model from "./model";
import { clothesType, OutfitPart, OutfitState, UpperLayer } from "@/lib/types";
import { Loader } from "./Loader";

type ClosetRowsProps = {
  items: clothesType[];
  currentItemState: OutfitState;
  handleClick: (dir: "left" | "right", pos: OutfitPart, layer?: UpperLayer) => void;
  three: boolean;
  hiddenLayers: Record<UpperLayer, boolean>;
  setHiddenLayers: React.Dispatch<React.SetStateAction<Record<UpperLayer, boolean>>>;
};

export default function ClosetRows({ items, currentItemState, handleClick, three, hiddenLayers, setHiddenLayers }: ClosetRowsProps) {
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({});
  const positions: OutfitPart[] = ["top", "mid", "bottom"];
  
  const [activeTopLayer, setActiveTopLayer] = useState<UpperLayer>("mid");

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

  const renderTopLayerImage = (layer: UpperLayer, zIndex: string) => {
    const layerItems = items.filter(item => item.type === "top" && item.layer === layer);
    const item = layerItems[currentItemState.top[layer]];
    const itemKey = item ? String(item._id || item.name) : '';
    const isHidden = hiddenLayers[layer];

    if (!item) return null;

    return (
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity pointer-events-none duration-300 ${zIndex} ${isHidden ? 'opacity-0' : 'opacity-100'}`}>
        <div id={`top-${layer}-wrapper`} className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
          {!loadedImages[itemKey] && (
            <div className="absolute inset-2 animate-pulse bg-zinc-800/40 rounded-2xl border border-white/5" />
          )}
          <Image
            key={itemKey}
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 80vw, 40vw"
            priority
            className={`closet-image object-contain pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] transition-transform duration-300 z-10 ${
              loadedImages[itemKey] ? "opacity-100" : "opacity-0 scale-95"
            }`}
            style={{
              transform: `scale(${item.scale || 1}) translate(${item.position?.[0]* -65 || 0}px, ${item.position?.[1]* -65 || 0}px)`
            }}
            onLoad={() => handleImageLoad(itemKey)}
          />
        </div>

      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-4 p-3 sm:p-4 rounded-3xl bg-zinc-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col gap-2">
      {positions.map((pos: OutfitPart) => {
        const isTop = pos === "top";
        const itemsOfType = items.filter(item => item.type === pos);
        const currentItem = !isTop ? itemsOfType[(currentItemState as any)[pos]] : null;
        const itemKey = currentItem ? String(currentItem._id || currentItem.name) : '';
        const rowHeight = pos === "bottom" ? "h-[16vh] min-h-[130px] sm:min-h-[150px]" : "h-[28vh] min-h-[220px] sm:min-h-[260px]";
        const wrapperAlignment = pos === "bottom" ? "items-start pt-1" : "items-center";

        return (
          <section 
            key={pos} 
            className={`closet-row relative flex items-center justify-between w-full ${rowHeight} px-4 py-2 rounded-2xl bg-zinc-950/50 border border-white/5 hover:border-white/15 transition-all overflow-visible group shadow-inner`}
          >
            <div className="absolute top-3 left-4 flex items-center gap-3 z-40">
              <span className="px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-white/10 text-[11px] font-bold uppercase tracking-wider text-indigo-400 backdrop-blur-md shadow-sm pointer-events-auto">
                {pos}
              </span>
              
              {isTop && (
                <div className="flex items-center bg-zinc-900/80 rounded-lg border border-white/10 p-0.5 backdrop-blur-md shadow-sm pointer-events-auto">
                  {(['base', 'mid', 'outer'] as UpperLayer[]).map(layer => (
                    <div key={layer} className="flex items-center">
                      <button
                        type="button"
                        onClick={() => setActiveTopLayer(layer)}
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md transition-all cursor-pointer ${
                          activeTopLayer === layer 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        {layer}
                      </button>
                      {activeTopLayer === layer && (
                        <button
                          type="button"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setHiddenLayers(prev => ({...prev, [layer]: !prev[layer]})); 
                          }}
                          className={`ml-1 mr-1 p-1 rounded-md transition-all cursor-pointer ${
                            hiddenLayers[layer] 
                              ? 'text-zinc-600 hover:bg-zinc-800' 
                              : 'text-zinc-300 hover:text-white hover:bg-zinc-700'
                          }`}
                          title="Toggle layer visibility"
                        >
                          {hiddenLayers[layer] ? <EyeOff className="w-3.5 h-3.5"/> : <Eye className="w-3.5 h-3.5"/>}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleClick("left", pos, isTop ? activeTopLayer : undefined)}
              className="relative p-3 rounded-2xl bg-zinc-900/80 hover:bg-indigo-600 text-zinc-300 hover:text-white border border-white/10 transition-all hover:scale-110 active:scale-95 cursor-pointer z-40 backdrop-blur-md shadow-xl pointer-events-auto"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className={`scene-wrapper w-full h-full flex justify-center ${wrapperAlignment} relative py-1 pointer-events-none`} id={isTop ? 'top-wrapper' : `${pos}-wrapper`}>
              <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />

              {three ? (
                <>
                  {isTop ? (
                    (() => {
                      const activeItem = items.filter(i => i.type === 'top' && i.layer === activeTopLayer)[currentItemState.top[activeTopLayer]];
                      return (
                        <div id={`top-${activeTopLayer}-wrapper`} className="absolute inset-0 w-full h-full flex items-center justify-center">
                          {activeItem && activeItem.modelFile ? (
                            <Canvas camera={{ position: [0, 0, 2.6], fov: 28 }} className="overflow-visible pointer-events-auto">
                              <React.Suspense fallback={<Loader />}>
                                <Environment preset="sunset" />
                                <Model item={activeItem} />
                                <OrbitControls enableDamping dampingFactor={0.05} enableZoom={true} />
                              </React.Suspense>
                            </Canvas>
                          ) : (
                            <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider bg-zinc-900/40 px-4 py-2 rounded-xl border border-white/5 pointer-events-auto">
                              No 3D model for this layer
                            </div>
                          )}
                        </div>
                      )
                    })()
                  ) : (
                    currentItem && currentItem.modelFile ? (
                      <Canvas camera={{ position: [0, 0, 2.6], fov: 28 }} className="overflow-visible pointer-events-auto">
                        <React.Suspense fallback={<Loader />}>
                          <Environment preset="sunset" />
                          <Model item={currentItem} />
                          <OrbitControls enableDamping dampingFactor={0.05} enableZoom={true} />
                        </React.Suspense>
                      </Canvas>
                    ) : (
                      <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider bg-zinc-900/40 px-4 py-2 rounded-xl border border-white/5 pointer-events-auto">
                        No 3D model
                      </div>
                    )
                  )}
                </>
              ) : (
                <>
                  <div className={`relative overflow-visible w-full pointer-events-none ${pos === "bottom" ? "h-28 sm:h-32" : "h-full"} max-w-md sm:max-w-lg flex items-center justify-center p-0`}>
                    
                    {isTop ? (
                      <>
                         {renderTopLayerImage('base', 'z-10')}
                         {renderTopLayerImage('mid', 'z-20')}
                         {renderTopLayerImage('outer', 'z-30')}
                      </>
                    ) : (
                      <>
                        {itemsOfType.length === 0 && (
                          <div className="text-zinc-500 text-xs font-semibold uppercase tracking-wider bg-zinc-900/40 px-4 py-2 rounded-xl border border-white/5 pointer-events-auto">
                            No items available
                          </div>
                        )}
                        {currentItem && (
                          <>
                            {!loadedImages[itemKey] && (
                              <div className="absolute inset-2 animate-pulse bg-zinc-800/40 rounded-2xl border border-white/5" />
                            )}
                            <Image
                              key={itemKey}
                              src={currentItem.image}
                              alt={currentItem.name}
                              fill
                              sizes="(max-width: 768px) 80vw, 40vw"
                              priority
                              className={`closet-image object-contain pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:scale-105 z-10 ${
                                loadedImages[itemKey] ? "opacity-100" : "opacity-0 scale-95"
                              }`}
                              style={{
                                transform: `scale(${currentItem.scale || 1}) translate(${currentItem.position?.[0]* -65 || 0}px, ${currentItem.position?.[1]* -65 || 0}px)`
                              }}
                              onLoad={() => handleImageLoad(itemKey)}
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleClick("right", pos, isTop ? activeTopLayer : undefined)}
              className="relative p-3 rounded-2xl bg-zinc-900/80 hover:bg-indigo-600 text-zinc-300 hover:text-white border border-white/10 transition-all hover:scale-110 active:scale-95 cursor-pointer z-40 backdrop-blur-md shadow-xl pointer-events-auto"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </section>
        );
      })}
    </div>
  );
}