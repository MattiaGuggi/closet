'use client';
import React, { useEffect } from 'react';
import { useUser } from './context/UserContext';
import { useRouter } from 'next/navigation';
import Header from './components/header';

const Home = () => {
  const { isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push('/login');
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <>
      <Header />
      <section id='home-section' className="w-full min-h-screen flex flex-col items-center justify-start overflow-hidden py- mt-20">
        <h1 className='font-bold text-5xl text-white'>Home</h1>
      </section>
    </>
  );
}

export default Home;
