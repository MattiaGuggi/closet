'use client';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MoveLeft, MoveRight } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useProgress, Html, useGLTF  } from "@react-three/drei";
import Image from "next/image";
import Model from "./model";
import { clothesType, Position } from "@/lib/types";

type ClosetRowsProps = {
  currentItemState: { top: number; mid: number; bottom: number };
  handleClick: (dir: "left" | "right", pos: Position) => void;
  three: boolean;
}

const Loader = () => {
  const { progress } = useProgress();
  return <Html className="absolute" center>Loading {progress.toFixed(0)}%</Html>;
};

export default function ClosetRows({ currentItemState, handleClick, three }: ClosetRowsProps) {
  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState<clothesType[]>([]);
  const positions: Position[] = ["top", "mid", "bottom"];

  const fetchItems = async () => {
    try {
        const response = await axios.get('/api/items');
        setItems(response.data.clothes);

        for (const item of response.data.clothes) {
            if (item.modelFile) {
                useGLTF.preload(item.modelFile);
            }
        }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <>
      {positions.map((pos: Position, idx: number) => {
        const itemsOfType = items.filter(item => item.type === pos);
        const currentItem = itemsOfType[currentItemState[pos]];

        return (
          <React.Fragment key={pos}>
            <section className="closet-row flex items-center justify-around h-[35vh]">
                <MoveLeft
                    size={48}
                    strokeWidth={3}
                    className="cursor-pointer text-gray-400 mx-10 scale-150 duration-400 transition-all hover:scale-200"
                    onClick={() => handleClick("left", pos)}
                />

                <div className="scene-wrapper w-full h-full flex justify-center items-center relative" id={`${pos}-wrapper`}>
                    {three ? (
                        <>
                            {currentItem && currentItem.modelFile ? (
                                <Canvas camera={{ position: [0, 1.5, 5], fov: 20 }}>
                                    <React.Suspense fallback={<Loader />}>
                                    <Environment preset="sunset" />
                                    <Model item={currentItem} />
                                    <OrbitControls enableDamping dampingFactor={0.05} enableZoom={false} />
                                    </React.Suspense>
                                </Canvas>
                            ) : (
                                <div className="text-gray-500">No 3D model available</div>
                            )}
                        </>
                    ) : (
                        <>
                            {itemsOfType.length === 0 && (
                                <div className="text-gray-500">No items available</div>
                            )}
                            {currentItem && (
                                <div className="relative w-64 h-64">
                                    {!loaded && (
                                        <div className="absolute w-64 h-64 inset-0 animate-pulse bg-gray-300 rounded-lg" />
                                    )}
                                    <Image
                                        src={currentItem.image}
                                        alt={currentItem.name}
                                        className={`closet-image w-64 h-64 object-cover rounded-lg shadow-lg transition-all duration-500 ${
                                            loaded ? "opacity-100" : "opacity-0"
                                        }`}
                                        width={256}
                                        height={256}
                                        onLoad={() => setLoaded(true)}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>

                <MoveRight
                    size={48}
                    strokeWidth={3}
                    className="cursor-pointer text-gray-400 mx-10 scale-150 duration-400 transition-all hover:scale-200"
                    onClick={() => handleClick("right", pos)}
                />
            </section>

            {idx < positions.length - 1 && <hr />}
          </React.Fragment>
        );
      })}
    </>
  );
}
