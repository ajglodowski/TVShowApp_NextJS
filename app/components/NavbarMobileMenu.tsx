'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { ClientSearch } from './search/ClientSearch';
import { Menu, PlusCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useIsMobile } from '@/components/hooks/use-mobile';
import { Button } from '@/components/ui/button';

export function NavbarMobileMenu({ isAdmin }: { isAdmin: boolean }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isMobile = useIsMobile();

    if (!isMobile) {
        return null;
    }

    return (
        <div className="md:hidden ml-auto">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/10 h-9 w-9"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] bg-neutral-900 border-neutral-800">
                    <SheetHeader>
                        <SheetTitle className="text-white text-left">Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 flex flex-col gap-1">
                        <SheetClose asChild>
                            <Link 
                                href="/" 
                                className="block px-3 py-2.5 rounded-md transition-colors hover:bg-neutral-800 text-gray-300 hover:text-white"
                            >
                                Home
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link 
                                href="/watchlist" 
                                className="block px-3 py-2.5 rounded-md transition-colors hover:bg-neutral-800 text-gray-300 hover:text-white"
                            >
                                Watchlist
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link 
                                href="/discoverShows" 
                                className="block px-3 py-2.5 rounded-md transition-colors hover:bg-neutral-800 text-gray-300 hover:text-white"
                            >
                                Discover
                            </Link>
                        </SheetClose>
                        {isAdmin && (
                            <SheetClose asChild>
                                <Link 
                                    href="/newShow/import" 
                                    className="flex items-center gap-2 px-3 py-2.5 mt-2 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium transition-colors border border-white/20"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    <span>New Show</span>
                                </Link>
                            </SheetClose>
                        )}
                        <div className="pt-4 mt-4 border-t border-neutral-800">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-3">Search</p>
                            <ClientSearch onResultClick={() => setMobileMenuOpen(false)} usePortal={false} />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
