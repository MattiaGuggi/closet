import React from 'react'

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center gap-4 p-6 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
        <p className="text-sm">
            © {new Date().getFullYear()} Guggi Mattia Ha. All rights reserved.
        </p>
    </footer>
  )
}

export default Footer
