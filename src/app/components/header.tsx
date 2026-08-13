'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Shirt, Sparkles, User, Home as HomeIcon } from 'lucide-react'

const Header = () => {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/closet', label: 'Closet', icon: Shirt },
    { href: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <header className="sticky top-4 z-50 w-[calc(100%-2rem)] max-w-5xl mx-auto border border-white/10 bg-zinc-900/60 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-black/50 transition-all">
      <nav className="flex justify-between items-center px-6 py-3.5">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Closet<span className="text-indigo-400">Studio</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center gap-1.5 p-1 bg-zinc-950/40 rounded-xl border border-white/5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-indigo-600/20 border border-indigo-500/30 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-zinc-400'}`} />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
