'use client';
import axios from "axios";
import React, { useEffect } from "react";
import { MoveLeft, MoveRight } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useProgress, Html } from "@react-three/drei";
import Image from "next/image";
import Model from "./model";
import { clothesType, Position } from "@/lib/types";

const positions: Position[] = ["top", "mid", "bottom"];

interface ClosetRowsProps {
  currentItemState: { top: number; mid: number; bottom: number };
  handleClick: (dir: "left" | "right", pos: Position) => void;
  three: boolean;
}

const Loader = () => {
    const { progress } = useProgress()
    return <Html className="absolute" center>Loading {progress.toFixed(0)}%</Html>
}

export default function ClosetRows({ currentItemState, handleClick, three }: ClosetRowsProps) {
    const [items, setItems] = React.useState<clothesType[]>([]);

    const fetchItems = async () => {
        try {
            const response = await axios.get('/api/items');
            const data = response.data;
            setItems(data.clothes);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }

    useEffect(() => {
        fetchItems();
    }, []);

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
                                    <Model item={items.filter(i => i.type === pos)[currentItemState[pos]]} />
                                    <OrbitControls enableDamping dampingFactor={0.05} enableZoom={false} />
                                </React.Suspense>
                                </Canvas>
                            ) : (
                                (() => {
                                const itemsOfType = items.filter(item => item.type === pos);
                                const currentItem = itemsOfType[currentItemState[pos]];
                                if (!currentItem) return <div className="text-gray-500">No items available</div>;
                                return (
                                    <Image
                                        src={currentItem.image}
                                        alt={currentItem.name}
                                        className="w-64 h-64 object-cover rounded-lg shadow-lg"
                                        width={256}
                                        height={256}
                                    />
                                );
                                })()
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
