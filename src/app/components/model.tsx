'use client'
import { clothesType } from '@/lib/types';
import { useGLTF } from '@react-three/drei';
import React from 'react'
import { Group } from 'three';

const Model = ({ item }: { item: clothesType }) => {
    const groupRef = React.useRef<Group>(null);
    const { scene } = useGLTF(item.modelFile);

    return (
        <group ref={groupRef} position={[0, 0, 0]} rotation={[0, 0, 0]} dispose={null}>
            <primitive object={scene} scale={item.scale} position={item.position} />
        </group>
    )
}

export default Model;
