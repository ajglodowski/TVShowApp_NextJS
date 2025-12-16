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
        <div className="flex items-center gap-2 flex-1 md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/10"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] bg-neutral-800/95 backdrop-blur">
                    <SheetHeader>
                        <SheetTitle className="text-white">Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                        <SheetClose asChild>
                            <Link 
                                href="/" 
                                className="block transition-colors hover:text-white text-gray-300"
                            >
                                Home
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link 
                                href="/watchlist" 
                                className="block transition-colors hover:text-white text-gray-300"
                            >
                                Watchlist
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link 
                                href="/discoverShows" 
                                className="block transition-colors hover:text-white text-gray-300"
                            >
                                Discover
                            </Link>
                        </SheetClose>
                        {isAdmin && (
                            <SheetClose asChild>
                                <Link 
                                    href="/newShow/import" 
                                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-white hover:bg-gray-100 text-black font-medium transition-colors"
                                >
                                    <PlusCircle className="h-5 w-5" />
                                    <span>Add Show</span>
                                </Link>
                            </SheetClose>
                        )}
                        <div className="pt-4 border-t border-neutral-700">
                            <p className="text-sm font-medium text-white mb-2">Search</p>
                            <ClientSearch onResultClick={() => setMobileMenuOpen(false)} usePortal={false} />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
