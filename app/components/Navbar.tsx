import React from 'react';
import Link from 'next/link';
import AuthButton from '@/supabase_components/AuthButton';
import { ClientSearch } from './search/ClientSearch';
import { NavbarMobileMenu } from './NavbarMobileMenu';

function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-800/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-800/60 overflow-x-hidden overflow-y-visible">
            <div className="container flex h-14 items-center">
                <div className="flex w-64 text-center items-center">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="font-semibold text-xs sm:text-xl text-white">TV Show App</span>
                    </Link>
                </div>
                <nav className="flex justify-between w-full items-center overflow-y-visible">
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2 md:space-x-6 text-sm font-medium flex-1 overflow-y-visible">
                        <Link href="/" className="transition-colors hover:text-white text-gray-300">
                            Home
                        </Link>
                        <Link href="/watchlist" className="transition-colors hover:text-white text-gray-300">
                            Watchlist
                        </Link>
                        <Link href="/discoverShows" className="transition-colors hover:text-white text-gray-300">
                            Discover
                        </Link>
                        <div className="flex-1 max-w-md ml-4 relative overflow-y-visible">
                            <ClientSearch />
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <NavbarMobileMenu />

                    {/* Avatar - Always in corner */}
                    <div className="ml-auto flex items-center">
                        <AuthButton />
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
