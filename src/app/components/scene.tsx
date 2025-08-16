'use client'
import React, { useRef } from 'react'
import { Group } from 'three'
import { Canvas } from '@react-three/fiber'
import { Environment, useGLTF, OrbitControls } from '@react-three/drei'
import { itemStateType } from '@/lib/data'

const Scene = ({ item }: { item: itemStateType }) => {
    const groupRef = useRef<Group>(null);
    const { scene } = useGLTF(item.model);

    return (
        <Canvas camera={{ position: [0, 1.5, 5], fov: 20 }} id={`${item.name}-scene`}>
            <Environment preset="sunset" />
            <group ref={groupRef} position={[0, 0, 0]} rotation={[0, 0, 0]} dispose={null}>
                <primitive object={scene} scale={item.scale} position={item.position} />
            </group>
            <OrbitControls 
                enableDamping 
                dampingFactor={0.05} 
                enableZoom={false} 
                minDistance={2} 
                maxDistance={10} 
            />
        </Canvas>
    )
}

export default Scene
