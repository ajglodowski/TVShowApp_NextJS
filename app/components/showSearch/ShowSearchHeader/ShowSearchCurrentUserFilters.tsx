"use client";

import { Rating } from "@/app/models/rating";
import { ShowSearchType } from "@/app/models/showSearchType";
import { Status } from "@/app/models/status";
import { backdropBackground } from "@/app/utils/stylingConstants";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useOptimistic, useTransition } from "react";
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
    searchType?: ShowSearchType;
    userId?: string;
    currentUserId?: string;
    getStatusesFunction: Promise<Status[] | null>;
}

export default function ShowSearchCurrentUserFilters({ 
    filters, 
    pathname, 
    currentFilters,
    searchType = ShowSearchType.UNRESTRICTED,
    userId,
    currentUserId,
    getStatusesFunction
}: ShowSearchCurrentUserFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const statuses = use(getStatusesFunction);
    
    // Determine if viewing other user's watchlist where current user != watchlist owner
    const isViewingOtherUserWatchlist = searchType === ShowSearchType.OTHER_USER_WATCHLIST && 
                                       currentUserId && userId && currentUserId !== userId;
    
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
        params.delete('addedToWatchlist');
        params.delete('ratings');
        params.delete('statuses');
        params.delete('page'); // Remove page param to reset to first page
        
        // Apply changes to user filters
        const newFilters = { ...safeFilters, ...changes };
        
        // Add updated user filter params
        if (newFilters.addedToWatchlist !== undefined) params.set('addedToWatchlist', newFilters.addedToWatchlist.toString());
        if (newFilters.ratings && newFilters.ratings.length > 0) params.set('ratings', newFilters.ratings.join(','));
        if (newFilters.statuses && newFilters.statuses.length > 0) {
            params.set('statuses', newFilters.statuses.map(s => s.id).join(','));
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
            
            // Create a URLSearchParams object to build the query string
            const params = new URLSearchParams(searchParams?.toString() || "");
            
            // Remove current user filter parameters
            params.delete('addedToWatchlist');
            params.delete('ratings');
            params.delete('statuses');
            params.delete('page'); // Remove page param to reset to first page
            
            // Build the new URL
            const queryString = params.toString();
            router.push(pathname + (queryString ? `?${queryString}` : ''));
        });
    };

    const selectedBubbleStyle = 'rounded-full py-1 px-2 mx-2 my-auto text-center outline outline-1 outline-white hover:bg-white hover:text-black bg-white text-black cursor-pointer'
    const unselectedBubbleStyle = 'rounded-full py-1 px-2 mx-2 my-auto text-center outline outline-1 outline-white hover:bg-white hover:text-black text-white cursor-pointer'

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
        const allStatuses: Status[] = statuses || [];
        
        // Filter out already selected statuses from the list of all statuses
        const unselectedStatuses = allStatuses.filter(status => 
            !optimisticFilters.statuses.some(s => s.id === status.id)
        );
        
        return (
            <div className="grid grid-cols-2 gap-2">
                {optimisticFilters.statuses.map((selectedStatus) => {
                    // Try to find a matching full status from the fetched statuses list
                    const matchingStatus = allStatuses.find(s => s.id === selectedStatus.id);
                    return (
                        <div
                            key={`selected-${selectedStatus.id}`}
                            onClick={() => handleRemoveStatus(selectedStatus)}
                            className={selectedBubbleStyle}
                        >
                            {matchingStatus?.name || `Status ${selectedStatus.id}`}
                        </div>
                    );
                })}

                {unselectedStatuses.map((status) => (
                    <div
                        key={`unselected-${status.id}`}
                        onClick={() => handleAddStatus(status)}
                        className={unselectedBubbleStyle}
                    >   
                        {status.name || `Status ${status.id}`}
                    </div>
                ))}
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
        const watchlistLabel = isViewingOtherUserWatchlist ? "Filter by My Watch List" : "Filter by Watch List";
        
        return (
            <div className="p-6 pb-0">
                <div className="text-lg font-medium">{watchlistLabel}</div>
                <div className="flex flex-col gap-2 mt-2">
                    <div 
                        onClick={() => handleWatchlistChange(undefined)}
                        className={optimisticFilters.addedToWatchlist === undefined ? selectedBubbleStyle : unselectedBubbleStyle}
                    >
                        All
                    </div>
                    <div 
                        onClick={() => handleWatchlistChange(true)}
                        className={optimisticFilters.addedToWatchlist === true ? selectedBubbleStyle : unselectedBubbleStyle}
                    >
                        {isViewingOtherUserWatchlist ? "In My Watch List" : "In Watch List"}
                    </div>
                    <div 
                        onClick={() => handleWatchlistChange(false)}
                        className={optimisticFilters.addedToWatchlist === false ? selectedBubbleStyle : unselectedBubbleStyle}
                    >
                        {isViewingOtherUserWatchlist ? "Not In My Watch List" : "Not In Watch List"}
                    </div>
                </div>
            </div>
        )
    }

    const getFilterButtonTitle = () => {
        if (isViewingOtherUserWatchlist) {
            return "My Filters";
        }
        return "User Filters";
    };

    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="bg-white/5 space-x-2">
                        <User className="h-4 w-4" />
                        <span>{getFilterButtonTitle()}</span>
                    </Button>
                </SheetTrigger>
                <SheetContent className={`w-[400px] ${backdropBackground}`}>
                    <SheetHeader>
                        <SheetTitle className="text-white">
                            {isViewingOtherUserWatchlist ? "My Show Filters" : "User Show Filters"}
                        </SheetTitle>
                        <SheetDescription className="text-white/70">
                            {isViewingOtherUserWatchlist 
                                ? "Filter shows based on your ratings and watchlist status"
                                : "Filter shows based on your ratings and watchlist status"}
                        </SheetDescription>
                    </SheetHeader>
                    
                    <div className="grid gap-4">
                        <WatchListRow />
                        <RatingsRow />
                        <StatusesRow />
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                        <Button 
                            onClick={handleClearFilters}
                            disabled={isPending}
                            className={`${backdropBackground} hover:bg-white/10`}
                        >
                            Clear All
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}