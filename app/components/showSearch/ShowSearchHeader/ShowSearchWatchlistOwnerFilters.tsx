"use client";

import { Rating } from "@/app/models/rating";
import { Status } from "@/app/models/status";
import { backdropBackground } from "@/app/utils/stylingConstants";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Loader2, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { CurrentUserFilters } from "./ShowSearchCurrentUserFilters";
import { ShowSearchFiltersType } from "./ShowSearchHeader";
import { StatusIcon } from "@/app/utils/StatusIcon";

type ShowSearchWatchlistOwnerFiltersProps = {
    filters: CurrentUserFilters;
    pathname: string;
    currentFilters: ShowSearchFiltersType;
    userId?: string;
    statuses: Status[] | null;
}

export default function ShowSearchWatchlistOwnerFilters({ 
    filters, 
    pathname, 
    currentFilters,
    userId,
    statuses
}: ShowSearchWatchlistOwnerFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Ensure incoming filters is properly initialized
    const safeFilters: CurrentUserFilters = {
        addedToWatchlist: filters?.addedToWatchlist,
        ratings: filters?.ratings || [],
        statuses: filters?.statuses || []
    };

    // Re-introduce useOptimistic
    const [optimisticFilters, updateOptimisticFilters] = useOptimistic(
        safeFilters,
        (state, update: Partial<CurrentUserFilters>) => ({
            ...state,
            ...update
        })
    );

    // Create URL for applying filters (renamed)
    const createFilterUrl = (applyFilters: CurrentUserFilters) => {
        const params = new URLSearchParams(searchParams?.toString() || "");
        params.delete('ownerWatchlist');
        params.delete('ownerRatings');
        params.delete('ownerStatuses');
        params.delete('page');
        
        if (applyFilters.addedToWatchlist !== undefined) params.set('ownerWatchlist', applyFilters.addedToWatchlist.toString());
        if (applyFilters.ratings && applyFilters.ratings.length > 0) params.set('ownerRatings', applyFilters.ratings.join(','));
        if (applyFilters.statuses && applyFilters.statuses.length > 0) {
            params.set('ownerStatuses', applyFilters.statuses.map(s => s.id).join(','));
        }
        
        const queryString = params.toString();
        return pathname + (queryString ? `?${queryString}` : '');
    };

    // --- Update Handlers to apply immediately with optimistic updates ---
    const handleRemoveRating = (rating: Rating) => {
        const newRatings = optimisticFilters.ratings.filter(r => r !== rating);
        startTransition(() => {
            updateOptimisticFilters({ ratings: newRatings });
            router.push(createFilterUrl({ ...optimisticFilters, ratings: newRatings }), { scroll: false });
        });
    };

    const handleAddRating = (rating: Rating) => {
        const newRatings = [...optimisticFilters.ratings, rating];
        startTransition(() => {
            updateOptimisticFilters({ ratings: newRatings });
            router.push(createFilterUrl({ ...optimisticFilters, ratings: newRatings }), { scroll: false });
        });
    };

    const handleRemoveStatus = (status: Status) => {
        const newStatuses = optimisticFilters.statuses.filter(s => s.id !== status.id);
        startTransition(() => {
            updateOptimisticFilters({ statuses: newStatuses });
            router.push(createFilterUrl({ ...optimisticFilters, statuses: newStatuses }), { scroll: false });
        });
    };

    const handleAddStatus = (status: Status) => {
        const newStatuses = [...optimisticFilters.statuses, status];
        startTransition(() => {
            updateOptimisticFilters({ statuses: newStatuses });
            router.push(createFilterUrl({ ...optimisticFilters, statuses: newStatuses }), { scroll: false });
        });
    };

    const handleWatchlistChange = (value: boolean | undefined) => {
        const newValue = value === true ? true : undefined;
        startTransition(() => {
            updateOptimisticFilters({ addedToWatchlist: newValue });
            router.push(createFilterUrl({ ...optimisticFilters, addedToWatchlist: newValue }), { scroll: false });
        });
    };

    const selectedBubbleStyle = 'rounded-full py-1 px-2 mx-2 my-auto text-center outline outline-1 outline-white hover:bg-white hover:text-black bg-white text-black cursor-pointer'
    const unselectedBubbleStyle = 'rounded-full py-1 px-2 mx-2 my-auto text-center outline outline-1 outline-white hover:bg-white hover:text-black text-white cursor-pointer'

    const RatingButtons = () => {
        const allRatings = Object.values(Rating);
        // Use optimisticFilters for display
        const unselectedRatings = allRatings.filter((rating) => !optimisticFilters.ratings.includes(rating));

        return (
            <div className="grid grid-cols-2 gap-2">
                {optimisticFilters.ratings.map((rating) => (
                    <div
                        key={rating}
                        onClick={() => handleRemoveRating(rating)}
                        className={selectedBubbleStyle}
                        style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                    >
                        {rating}
                    </div>
                ))}

                {unselectedRatings.map((rating) => (
                    <div
                        key={rating}
                        onClick={() => handleAddRating(rating)}
                        className={unselectedBubbleStyle}
                        style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                    >
                        {rating}
                    </div>
                ))}
            </div>
        )
    }

    const StatusButtons = () => {
        const allStatuses: Status[] = statuses || [];
        
        // Filter out already selected statuses from the list of all statuses
        // Use optimisticFilters for display
        const unselectedStatuses = allStatuses.filter(status => 
            !optimisticFilters.statuses.some(s => s.id === status.id)
        );
        
        return (
            <div className="grid grid-cols-2 gap-2">
                {optimisticFilters.statuses.map((selectedStatus) => {
                    const matchingStatus = allStatuses.find(s => s.id === selectedStatus.id);
                    return (
                        <div
                            key={`selected-${selectedStatus.id}`}
                            onClick={() => handleRemoveStatus(selectedStatus)}
                            className={selectedBubbleStyle}
                            style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                        >
                            <div className="flex items-center gap-1">
                                <StatusIcon {...selectedStatus} />
                                {matchingStatus?.name || `Status ${selectedStatus.id}`}
                            </div>
                        </div>
                    );
                })}

                {unselectedStatuses.map((status) => (
                    <div
                        key={`unselected-${status.id}`}
                        onClick={() => handleAddStatus(status)}
                        className={unselectedBubbleStyle}
                        style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                    >   
                        <div className="flex items-center gap-1">
                            <StatusIcon {...status} />
                            {status.name || `Status ${status.id}`}
                        </div>
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

    const StatusesRow = () => {
        return (
            <div className="p-6 pb-0">
                <div className="text-lg font-medium">Filter by Their Status</div>
                <StatusButtons />
            </div>
        )
    }

    const WatchListRow = () => {
        return (
            <div className="p-6 pb-0">
                <div className="text-lg font-medium">Filter by Their Watch List</div>
                <div className="flex flex-col gap-2 mt-2">
                    <div 
                        onClick={() => handleWatchlistChange(true)}
                        className={optimisticFilters.addedToWatchlist === true ? selectedBubbleStyle : unselectedBubbleStyle}
                        style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                    >
                        In Their Watch List
                    </div>
                    <div 
                        onClick={() => handleWatchlistChange(undefined)}
                        className={optimisticFilters.addedToWatchlist === undefined ? selectedBubbleStyle : unselectedBubbleStyle}
                        style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                    >
                        Any (Show All Watchlist Items)
                    </div>
                </div>
            </div>
        )
    }

    // Calculate badge count based on applied filters (props)
    const badgeCount = [
        safeFilters.ratings.length,
        safeFilters.statuses.length,
        // Don't count addedToWatchlist for owner as it's implicit
    ].reduce((acc, count) => acc + count, 0);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className={`${backdropBackground} text-white relative`} disabled={isPending}>
                    <Users className="h-4 w-4 mr-2" />
                    <span>Owner Filters</span>
                    {isPending && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                    {badgeCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {badgeCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className={`p-0 overflow-y-auto bg-black/80 border-l border-l-white/20 ${isPending ? 'opacity-75' : ''}`}>
                <SheetHeader>
                    <SheetTitle className="text-white">Owner Filters</SheetTitle>
                    <SheetDescription>
                        Filter shows based on the watchlist owner&apos;s interactions.
                    </SheetDescription>
                </SheetHeader>
                
                <ScrollArea className="h-[calc(100vh-150px)] pr-4">
                    <RatingsRow />
                    <StatusesRow />
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
} 