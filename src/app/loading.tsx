import React from 'react';

const Loading = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-50 mb-6"></div>
      <p className="text-lg font-medium bg-gradient-to-br from-blue-500 to-indigo-700 bg-clip-text text-transparent">Loading, please wait...</p>
    </div>
  );
};

export default Loading;
