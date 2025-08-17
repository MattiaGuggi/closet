'use client'
import { itemStateType } from '@/lib/data';
import { useGLTF } from '@react-three/drei';
import React from 'react'
import { Group } from 'three';

const Scene = ({ item }: { item: itemStateType }) => {
    const groupRef = React.useRef<Group>(null);
    const { scene } = useGLTF(item.model);

    return (
        <group ref={groupRef} position={[0, 0, 0]} rotation={[0, 0, 0]} dispose={null}>
            <primitive object={scene} scale={item.scale} position={item.position} />
        </group>
    )
}

export default Scene;
