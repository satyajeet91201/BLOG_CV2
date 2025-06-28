import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Content2 from './Content2';
import { AppContent } from '../context/AppContext';

const Home = () => {
  const { isLoggedIn, loading } = useContext(AppContent);

  return (
    <div className='flex flex-col items-center justify-start min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
      {/* Navbar always visible */}
      <Navbar />

      {/* Show loading until auth check finishes */}
      {loading ? (
        <div className='mt-40 text-white text-xl'>Loading...</div>
      ) : isLoggedIn ? (
        <Header />
      ) : (
        <Header />
      )}
    </div>
  );
};

export default Home;
