import React from 'react';
import Link from 'next/link';
import AuthButton from '@/supabase_components/AuthButton';
import { ClientSearch } from './search/ClientSearch';
import { NavbarMobileMenu } from './NavbarMobileMenu';
import { createClient } from '@/app/utils/supabase/server';
import { isAdmin } from '@/app/utils/userService';
import { backdropBackground } from '@/app/utils/stylingConstants';
import { PlusCircle } from 'lucide-react';

async function Navbar() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userIsAdmin = await isAdmin(user?.id);

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
                        {userIsAdmin && (
                            <Link 
                                href="/newShow/import" 
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-gray-50 text-black font-medium transition-all border-2 border-transparent hover:border-white hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                            >
                                <PlusCircle className="h-4 w-4" />
                                <span>Add Show</span>
                            </Link>
                        )}
                        <div className="flex-1 max-w-md ml-4 relative overflow-y-visible">
                            <ClientSearch />
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <NavbarMobileMenu isAdmin={userIsAdmin} />

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
