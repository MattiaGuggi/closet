import React from 'react';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen text-gray-800 p-6">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h1 className="text-5xl font-bold mb-2 text-white">404</h1>
      <p className="text-xl mb-6 text-white">Oops! The page you're looking for doesn't exist.</p>
    </div>
  );
};

export default NotFound;
