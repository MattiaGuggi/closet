'use client';
import React, { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#home-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        markers: true,
      },
    });

    
  }, []);

  return (
    <div id='home-section'>Home</div>
  );
}

export default Home;
