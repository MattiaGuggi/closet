'use client';
import { MoveLeft, MoveRight } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useProgress, Html } from "@react-three/drei";
import Image from "next/image";
import React from "react";
import Model from "./model";
import { items, Position } from "@/lib/data";

const positions: Position[] = ["top", "mid", "bottom"];

interface ClosetRowsProps {
  itemState: { top: number; mid: number; bottom: number };
  handleClick: (dir: "left" | "right", pos: Position) => void;
  three: boolean;
}

const Loader = () => {
    const { progress } = useProgress()
    return <Html className="absolute" center>Loading {progress.toFixed(0)}%</Html>
}

export default function ClosetRows({ itemState, handleClick, three }: ClosetRowsProps) {
  return (
    <>
        {positions.map((pos: Position, idx: number) => (
            <React.Fragment key={pos}>
                <section className="closet-row flex items-center justify-around h-[35vh]">
                    <MoveLeft
                        size={48}
                        strokeWidth={3}
                        className="cursor-pointer text-gray-400 mx-10 scale-150 duration-400 transition-all hover:scale-200"
                        onClick={() => handleClick("left", pos)}
                    />
                    <div className="scene-wrapper w-full h-full flex justify-center items-center" id={`${pos}-wrapper`}>
                    {three ? (
                        <Canvas camera={{ position: [0, 1.5, 5], fov: 20 }}>
                        <React.Suspense fallback={<Loader />}>
                            <Environment preset="sunset" />
                            <Model item={items[pos][itemState[pos]]} />
                            <OrbitControls enableDamping dampingFactor={0.05} enableZoom={false} />
                        </React.Suspense>
                        </Canvas>
                    ) : (
                        <Image
                            src={items[pos][itemState[pos]].image}
                            alt={items[pos][itemState[pos]].name}
                            className="w-64 h-64 object-cover rounded-lg shadow-lg"
                            width={256}
                            height={256}
                        />
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
        ))}
    </>
  );
}
