"use client";

import { Rating } from "@/app/models/rating";
import { Status } from "@/app/models/status";
import { backdropBackground } from "@/app/utils/stylingConstants";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { ShowSearchFiltersType } from "./ShowSearchHeader";

export type CurrentUserFilters = {
    addedToWatchlist?: boolean;
    ratings: Rating[];
    statuses: Status[];
}

export const defaultCurrentUserFilters: CurrentUserFilters = {
    addedToWatchlist: undefined,
    ratings: [],
    statuses: []
}

type ShowSearchCurrentUserFiltersProps = {
    filters: CurrentUserFilters;
    pathname: string;
    currentFilters: ShowSearchFiltersType;
}

export default function ShowSearchCurrentUserFilters({ filters, pathname, currentFilters }: ShowSearchCurrentUserFiltersProps) {
    const router = useRouter();
    
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
        const url = new URL(pathname, typeof window !== 'undefined' ? window.location.origin : '');
        
        // Add current show filter params
        if (currentFilters.service.length > 0) url.searchParams.set('service', currentFilters.service.map(s => s.id).join(','));
        if (currentFilters.length.length > 0) url.searchParams.set('length', currentFilters.length.join(','));
        if (currentFilters.airDate.length > 0) url.searchParams.set('airDate', currentFilters.airDate.join(','));
        if (currentFilters.limitedSeries !== undefined) url.searchParams.set('limitedSeries', currentFilters.limitedSeries.toString());
        if (currentFilters.running !== undefined) url.searchParams.set('running', currentFilters.running.toString());
        if (currentFilters.currentlyAiring !== undefined) url.searchParams.set('currentlyAiring', currentFilters.currentlyAiring.toString());
        
        // Apply changes to user filters
        const newFilters = { ...safeFilters, ...changes };
        
        // Add updated user filter params
        if (newFilters.addedToWatchlist !== undefined) url.searchParams.set('addedToWatchlist', newFilters.addedToWatchlist.toString());
        if (newFilters.ratings && newFilters.ratings.length > 0) url.searchParams.set('ratings', newFilters.ratings.join(','));
        if (newFilters.statuses && newFilters.statuses.length > 0) {
            url.searchParams.set('statuses', newFilters.statuses.map(s => s.id).join(','));
        }
        
        return url.pathname + url.search;
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

    // Handle removing a status with optimistic update
    const handleRemoveStatus = (status: Status) => {
        startTransition(() => {
            const newStatuses = optimisticFilters.statuses.filter(s => s.id !== status.id);
            updateOptimisticFilters({ statuses: newStatuses });
            router.push(createFilterURL({ statuses: newStatuses }));
        });
    };

    // Handle adding a status with optimistic update
    const handleAddStatus = (status: Status) => {
        startTransition(() => {
            const newStatuses = [...optimisticFilters.statuses, status];
            updateOptimisticFilters({ statuses: newStatuses });
            router.push(createFilterURL({ statuses: newStatuses }));
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
            router.push(clearFiltersURL());
        });
    };

    // URL for clearing all user filters
    const clearFiltersURL = () => {
        const url = new URL(pathname, typeof window !== 'undefined' ? window.location.origin : '');
        return url.pathname;
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
                <div className="text-lg font-medium">Filter by Rating</div>
                <RatingButtons />
            </div>
        )
    }

    const StatusButtons = () => {
        // Replace empty array with fetch from the Status enum or model
        // Since we don't have access to all statuses in this component,
        // we need to handle potential undefined statuses
        const allStatuses: Status[] = []; // This would typically be fetched or passed as props
        
        return (
            <div className="grid grid-cols-2 gap-2">
                {optimisticFilters.statuses.map((status) => (
                    <div
                        key={status.name || status.id}
                        onClick={() => handleRemoveStatus(status)}
                        className={selectedBubbleStyle}
                    >
                        {status.name || `Status ${status.id}`}
                    </div>
                ))}

                {/* We can't show unselected statuses if we don't have the full list */}
            </div>
        )
    }

    const StatusesRow = () => {
        return (
            <div className="p-6 pb-0">
                <div className="text-lg font-medium">Filter by Status</div>
                <StatusButtons />
            </div>
        )
    }

    const WatchListRow = () => {
        return (
            <div className="p-6 pb-0">
                <div className="text-lg font-medium">Filter by Watch List</div>
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
                            <Label htmlFor="inWatchlist">In My Watch List</Label>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div onClick={() => handleWatchlistChange(false)} className="flex items-center space-x-2 cursor-pointer">
                            <RadioGroupItem value="false" id="notInWatchlist" />
                            <Label htmlFor="notInWatchlist">Not In My Watch List</Label>
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
                    <Button variant="outline" className={`${backdropBackground} text-white`}>
                        <User className="mr-2 h-4 w-4" />
                        Your Filters
                    </Button>
                </SheetTrigger>
                <SheetContent className={`${backdropBackground} text-white`}>
                    <SheetHeader>
                        <span className="flex justify-between items-center">
                            <SheetTitle className="text-white">My Show Filters</SheetTitle>
                            <Button 
                                onClick={handleClearFilters}
                                className={`${backdropBackground} text-white me-2 hover:bg-white hover:text-black px-4 py-2 rounded-md`}
                            >
                                Reset Filters
                            </Button>
                        </span>
                        <SheetDescription className="text-white/70">
                            Filter shows based on your personal data.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <RatingsRow />
                        <StatusesRow />
                        <WatchListRow />
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}