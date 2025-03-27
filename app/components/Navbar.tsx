import React from 'react';
import Link from 'next/link';
import AuthButton from '@/supabase_components/AuthButton';

function Navbar() {

    const textButtonStyle = ' my-auto text-white p-1 outline rounded-md m-1 hover:text-black hover:bg-white hover:shadow-md transition duration-300 ease-in-out';

    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-800/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-800/60 overflow-x-hidden">
            <div className="container flex h-14 items-center">
                <div className="flex w-64 text-center">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="font-semibold text-xs sm:text-xl text-white">TV Show App</span>
                    </Link>
                </div>
                <nav className="flex justify-between w-full">
                    <ul className='flex items-center space-x-6 text-sm font-medium'>
                        <Link href="/" className="transition-colors hover:text-white text-gray-300">
                        Home
                        </Link>
                        <Link href="/watchlist" className="transition-colors hover:text-white text-gray-300">
                        Watchlist
                        </Link>
                        <Link href="/discoverShows" className="transition-colors hover:text-white text-gray-300">
                        Discover
                        </Link>
                    </ul>
                    <AuthButton />
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
