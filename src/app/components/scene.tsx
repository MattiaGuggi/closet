import React from 'react'
import { AnimationMixer, Group, AnimationAction } from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Html, useProgress, useGLTF, OrbitControls } from '@react-three/drei'
import gsap from 'gsap'

type customType = {
    id: number;
    name: string;
    image: string;
    model: string;
    description: string;
};

const Scene = ({ item }: { item: customType }) => {
    const groupRef = React.useRef<Group>(null);
    const { scene, animations } = useGLTF(item.model);
    const mixer = React.useRef<AnimationMixer | null>(null);
    const action = React.useRef<AnimationAction | null>(null);
    const { progress } = useProgress();
    const [isLoaded, setIsLoaded] = React.useState(false);

    return (
        <p className='text-white text-xl font-semibold'>
            {item.id}
            {item.name}
            {item.image}
            {item.model}
            {item.description}
        </p>
    )
}

export default Scene
