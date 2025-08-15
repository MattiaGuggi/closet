'use client';
import React, { useEffect } from 'react';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';

const AnimationProvider = ({children}: { children: React.ReactNode }) => {
    const pathname = usePathname();

    useEffect(() => {
        const sections = gsap.utils.toArray<HTMLElement>("section");
        for (const page of sections) {
            gsap.fromTo(page, {
                opacity: 0,
                y: 50,
            }, {
                opacity: 1,
                y: 0,
                ease: 'power2.inOut',
                duration: 0.4
            });
        }
    }, [pathname]);

    return (
        <>{children}</>
    )
}

export default AnimationProvider
