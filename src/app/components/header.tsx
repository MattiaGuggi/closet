'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Header = () => {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/closet', label: 'Closet' },
    { href: '/profile', label: 'Profile' }
  ];

  return (
    <header className="w-full border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <nav className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
          ClosetApp
        </Link>

        <ul className="flex gap-6">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-indigo-700 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-300'
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-indigo-600 rounded-full" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header
