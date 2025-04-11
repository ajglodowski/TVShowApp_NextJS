"use client";

import { Rating } from "@/app/models/rating";
import { Status } from "@/app/models/status";
import { backdropBackground } from "@/app/utils/stylingConstants";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { CurrentUserFilters, defaultCurrentUserFilters } from "./ShowSearchCurrentUserFilters";
import { ShowSearchFiltersType } from "./ShowSearchHeader";

type ShowSearchWatchlistOwnerFiltersProps = {
    filters: CurrentUserFilters;
    pathname: string;
    currentFilters: ShowSearchFiltersType;
    userId?: string;
}

export default function ShowSearchWatchlistOwnerFilters({ 
    filters, 
    pathname, 
    currentFilters,
    userId
}: ShowSearchWatchlistOwnerFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Ensure filters is properly initialized with default values
    const safeFilters: CurrentUserFilters = {
        addedToWatchlist: filters?.addedToWatchlist,
        ratings: filters?.ratings || [],
        statuses: filters?.statuses || []
    };
    
    const [isPending, startTransition] = useTransition();
    const [optimisticFilters, updateOptimisticFilters] = useOptimistic(
        safeFilters,
        (state, update: Partial<CurrentUserFilters>) => ({
            ...state,
            ...update
        })
    );

    const getStringFromBool = (bool: boolean | undefined): string => {
        if (bool === true) return 'true';
        if (bool === false) return 'false';
        return 'undefined';
    }

    // Create URLs for various filter changes
    const createFilterURL = (changes: Partial<CurrentUserFilters>) => {
        // Create a URLSearchParams object to build the query string
        const params = new URLSearchParams(searchParams?.toString() || "");
        
        // Remove the parameters we're going to update
        params.delete('ownerWatchlist');
        params.delete('ownerRatings');
        params.delete('ownerStatuses');
        
        // Apply changes to user filters
        const newFilters = { ...safeFilters, ...changes };
        
        // Add updated watchlist owner filter params
        if (newFilters.addedToWatchlist !== undefined) params.set('ownerWatchlist', newFilters.addedToWatchlist.toString());
        if (newFilters.ratings && newFilters.ratings.length > 0) params.set('ownerRatings', newFilters.ratings.join(','));
        if (newFilters.statuses && newFilters.statuses.length > 0) {
            params.set('ownerStatuses', newFilters.statuses.map(s => s.id).join(','));
        }
        
        // Build the new URL
        const queryString = params.toString();
        return pathname + (queryString ? `?${queryString}` : '');
    };

    // Handle removing a rating with optimistic update
    const handleRemoveRating = (rating: Rating) => {
        startTransition(() => {
            const newRatings = optimisticFilters.ratings.filter(r => r !== rating);
            updateOptimisticFilters({ ratings: newRatings });
            router.push(createFilterURL({ ratings: newRatings }));
        });
    };

    // Handle adding a rating with optimistic update
    const handleAddRating = (rating: Rating) => {
        startTransition(() => {
            const newRatings = [...optimisticFilters.ratings, rating];
            updateOptimisticFilters({ ratings: newRatings });
            router.push(createFilterURL({ ratings: newRatings }));
        });
    };

    // Handle setting watch list filter with optimistic update
    const handleWatchlistChange = (value: boolean | undefined) => {
        startTransition(() => {
            updateOptimisticFilters({ addedToWatchlist: value });
            router.push(createFilterURL({ addedToWatchlist: value }));
        });
    };

    // Handle clearing all filters
    const handleClearFilters = () => {
        startTransition(() => {
            const clearedFilters = {
                addedToWatchlist: undefined,
                ratings: [],
                statuses: []
            };
            updateOptimisticFilters(clearedFilters);
            
            // Create a URLSearchParams object to build the query string
            const params = new URLSearchParams(searchParams?.toString() || "");
            
            // Remove owner filter parameters
            params.delete('ownerWatchlist');
            params.delete('ownerRatings');
            params.delete('ownerStatuses');
            
            // Build the new URL
            const queryString = params.toString();
            router.push(pathname + (queryString ? `?${queryString}` : ''));
        });
    };

    const selectedBubbleStyle = 'rounded-full py-1 px-2 mx-2 text-center outline outline-1 outline-white hover:bg-white hover:text-black bg-white text-black cursor-pointer'
    const unselectedBubbleStyle = 'rounded-full py-1 px-2 mx-2 text-center outline outline-1 outline-white hover:bg-white hover:text-black text-white cursor-pointer'

    const RatingButtons = () => {
        const allRatings = Object.values(Rating);
        const unselectedRatings = allRatings.filter((rating) => !optimisticFilters.ratings.includes(rating));

        return (
            <div className="grid grid-cols-2 gap-2">
                {optimisticFilters.ratings.map((rating) => (
                    <div
                        key={rating}
                        onClick={() => handleRemoveRating(rating)}
                        className={selectedBubbleStyle}
                    >
                        {rating}
                    </div>
                ))}

                {unselectedRatings.map((rating) => (
                    <div
                        key={rating}
                        onClick={() => handleAddRating(rating)}
                        className={unselectedBubbleStyle}
                    >
                        {rating}
                    </div>
                ))}
            </div>
        )
    }

    const RatingsRow = () => {
        return (
            <div className="p-6 pb-0">
                <div className="text-lg font-medium">Filter by Their Rating</div>
                <RatingButtons />
            </div>
        )
    }

    const WatchListRow = () => {
        return (
            <div className="p-6 pb-0">
                <div className="text-lg font-medium">Filter by Their Watch List</div>
                <RadioGroup defaultValue={getStringFromBool(optimisticFilters.addedToWatchlist)}>
                    <div className="flex items-center space-x-2 mt-2">
                        <div onClick={() => handleWatchlistChange(undefined)} className="flex items-center space-x-2 cursor-pointer">
                            <RadioGroupItem value="undefined" id="all" />
                            <Label htmlFor="all">All</Label>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div onClick={() => handleWatchlistChange(true)} className="flex items-center space-x-2 cursor-pointer">
                            <RadioGroupItem value="true" id="inWatchlist" />
                            <Label htmlFor="inWatchlist">In Their Watch List</Label>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div onClick={() => handleWatchlistChange(false)} className="flex items-center space-x-2 cursor-pointer">
                            <RadioGroupItem value="false" id="notInWatchlist" />
                            <Label htmlFor="notInWatchlist">Not In Their Watch List</Label>
                        </div>
                    </div>
                </RadioGroup>
            </div>
        )
    }

    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="bg-white/5 space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Their Filters</span>
                    </Button>
                </SheetTrigger>
                <SheetContent className={`w-[400px] ${backdropBackground}`}>
                    <SheetHeader>
                        <SheetTitle className="text-white">
                            Watchlist Owner Filters
                        </SheetTitle>
                        <SheetDescription className="text-white/70">
                            Filter shows based on the watchlist owner's ratings and status
                        </SheetDescription>
                    </SheetHeader>
                    
                    <div className="grid gap-4">
                        <WatchListRow />
                        <RatingsRow />
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                        <Button 
                            onClick={handleClearFilters}
                            disabled={isPending}
                        >
                            Clear All
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
} 