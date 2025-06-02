'use client';

import { Input } from "@/components/ui/input";
import { Loader2, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, FormEvent, useEffect } from "react";

type ShowSearchInputProps = {
    searchResults: string;
    pathname: string;
};

export default function ShowSearchInput({ searchResults, pathname }: ShowSearchInputProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [inputValue, setInputValue] = useState(searchResults);

    // Update input value if external searchResults prop changes
    useEffect(() => {
        setInputValue(searchResults);
    }, [searchResults]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const currentQuery = searchParams?.get('search') || '';
        if (inputValue !== currentQuery) {
            triggerSearch(inputValue);
        }
    };
    
    // Function to trigger search navigation
    const triggerSearch = (term: string) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams?.toString() || "");
            if (term) {
                params.set('search', term);
            } else {
                params.delete('search');
            }
            params.delete('page');
            const url = `${pathname}?${params.toString()}`;
            router.push(url, { scroll: false });
        });
    };
    
    // Handler for clear button
    const handleClear = () => {
        if (inputValue) {
            setInputValue(''); // Clear local input state
            triggerSearch(''); // Trigger navigation with empty search term
        }
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="relative w-full"
        >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
           
            <Input
                className={`pl-10 pr-10 h-10 bg-white/5 text-white border-border/40 focus:border-border/60 transition-colors ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search shows..." 
                disabled={isPending}
            />
            
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isPending ? (
                    // Show spinner when pending
                    <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                ) : inputValue ? (
                    // Show clear button if not pending and input has value
                    <button 
                        type="button"
                        onClick={handleClear}
                        className="p-1 text-gray-400 hover:text-white transition-colors touch-manipulation"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </button>
                ) : null} 
            </div>
        </form>
    );
} 