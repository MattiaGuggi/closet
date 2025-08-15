'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Header = () => {
    const pathname = usePathname();

    return (
        <header
            className="absolute flex flex-wrap sm:justify-start sm:flex-nowrap w-full h-20 top-0 z-20 bg-white/10 dark:bg-neutral-900/30 backdrop-blur-xl border-b border-indigo-800/40 shadow-xl"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25)' }}
        >
            <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between h-full">
            <div
                id="hs-navbar-example"
                className="hidden hs-collapse overflow-hidden transition-all duration-300 basis-full grow sm:block"
                aria-labelledby="hs-navbar-example-collapse"
            >
                <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
                <Link
                    href="/"
                    className={`text-lg font-extrabold tracking-wide transition-all duration-200 px-4 py-2 rounded-xl
                    ${pathname === "/" ? "bg-gradient-to-r from-indigo-500 to-indigo-900 text-white shadow-lg scale-105" :
                    "text-indigo-100 hover:bg-gradient-to-r hover:from-indigo-700 hover:to-indigo-900 hover:text-white"}`}
                >
                    Home
                </Link>
                <Link
                    href="/closet"
                    className={`text-lg font-extrabold tracking-wide transition-all duration-200 px-4 py-2 rounded-xl
                    ${pathname.startsWith("/closet") ? "bg-gradient-to-r from-indigo-500 to-indigo-900 text-white shadow-lg scale-105" :
                    "text-indigo-100 hover:bg-gradient-to-r hover:from-indigo-700 hover:to-indigo-900 hover:text-white"}`}
                >
                    Closet
                </Link>
                <Link
                    href="/profile"
                    className={`text-lg font-extrabold tracking-wide transition-all duration-200 px-4 py-2 rounded-xl
                    ${pathname.startsWith("/profile") ? "bg-gradient-to-r from-indigo-500 to-indigo-900 text-white shadow-lg scale-105" :
                    "text-indigo-100 hover:bg-gradient-to-r hover:from-indigo-700 hover:to-indigo-900 hover:text-white"}`}
                >
                    Profile
                </Link>
                </div>
            </div>
            </nav>
        </header>
    )
}

export default Header
