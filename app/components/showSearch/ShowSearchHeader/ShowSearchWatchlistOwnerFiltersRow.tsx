'use client'
import { backdropBackground } from "@/app/utils/stylingConstants";
import { X } from "lucide-react";
import { CurrentUserFilters } from "./ShowSearchCurrentUserFilters";
import { Rating } from "@/app/models/rating";
import { Status } from "@/app/models/status";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ShowSearchFiltersType } from "./ShowSearchHeader";
import { Button } from "@/components/ui/button";
import { useOptimistic, useTransition } from "react";

type ShowSearchWatchlistOwnerFiltersRowProps = {
    filters: CurrentUserFilters;
    pathname: string;
    currentFilters: ShowSearchFiltersType;
    userId?: string;
    statuses?: Status[];
}

export default function ShowSearchWatchlistOwnerFiltersRow({ 
    filters, 
    pathname, 
    currentFilters,
    userId,
    statuses = []
}: ShowSearchWatchlistOwnerFiltersRowProps) {
    const router = useRouter();
    
    const [isPending, startTransition] = useTransition();
    const [optimisticFilters, updateOptimisticFilters] = useOptimistic(
        filters,
        (state, update: Partial<CurrentUserFilters>) => ({
            ...state,
            ...update
        })
    );

    // Function to find status name by id
    const getStatusName = (statusId: number): string => {
        const status = statuses.find(s => s.id === statusId);
        return status?.name || `Status ${statusId}`;
    };

    const createRemoveFilterURL = (key: keyof CurrentUserFilters, value: Rating | Status | boolean | undefined) => {
        const url = new URL(pathname, typeof window !== 'undefined' ? window.location.origin : '');
        
        // Add all current filter params
        if (currentFilters.service.length > 0) url.searchParams.set('service', currentFilters.service.map(s => s.id).join(','));
        if (currentFilters.length.length > 0) url.searchParams.set('length', currentFilters.length.join(','));
        if (currentFilters.airDate.length > 0) url.searchParams.set('airDate', currentFilters.airDate.join(','));
        if (currentFilters.limitedSeries !== undefined && currentFilters.limitedSeries !== null) url.searchParams.set('limitedSeries', currentFilters.limitedSeries.toString());
        if (currentFilters.running !== undefined && currentFilters.running !== null) url.searchParams.set('running', currentFilters.running.toString());
        if (currentFilters.currentlyAiring !== undefined && currentFilters.currentlyAiring !== null) url.searchParams.set('currentlyAiring', currentFilters.currentlyAiring.toString());
        
        // Handle watchlist owner filter params
        if (key === 'ratings') {
            const newRatings = optimisticFilters.ratings.filter(r => r !== value);
            if (newRatings.length > 0) {
                url.searchParams.set('ownerRatings', newRatings.join(','));
            }
        } else if (optimisticFilters.ratings && optimisticFilters.ratings.length > 0) {
            url.searchParams.set('ownerRatings', optimisticFilters.ratings.join(','));
        }
        
        if (key === 'statuses') {
            const newStatuses = optimisticFilters.statuses.filter(s => s.id !== (value as Status).id);
            if (newStatuses.length > 0) {
                url.searchParams.set('ownerStatuses', newStatuses.map(s => s.id).join(','));
            }
        } else if (optimisticFilters.statuses && optimisticFilters.statuses.length > 0) {
            url.searchParams.set('ownerStatuses', optimisticFilters.statuses.map(s => s.id).join(','));
        }
        
        if (key !== 'addedToWatchlist' && optimisticFilters.addedToWatchlist !== undefined) {
            url.searchParams.set('ownerWatchlist', optimisticFilters.addedToWatchlist.toString());
        }
        
        return pathname + url.search;
    };

    const renderFilterBubbles = (): ReactNode[] => {
        const bubbles: ReactNode[] = [];
        const bubbleStyle = `${backdropBackground} rounded-full text-white px-3 py-1 inline-flex items-center`;

        // Handle ratings
        if (optimisticFilters.ratings && optimisticFilters.ratings.length > 0) {
            optimisticFilters.ratings.forEach((rating) => {
                bubbles.push(
                    <div
                        key={`owner-rating-${rating}`}
                        onClick={() => {
                            startTransition(() => {
                                const newRatings = optimisticFilters.ratings.filter(r => r !== rating);
                                updateOptimisticFilters({ ratings: newRatings });
                                router.push(createRemoveFilterURL('ratings', rating));
                            });
                        }}
                    >
                        <Button variant="outline" className={bubbleStyle}>
                            Their Rating: {rating.toString()}
                            <X className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                );
            });
        }

        // Handle statuses
        if (optimisticFilters.statuses && optimisticFilters.statuses.length > 0) {
            optimisticFilters.statuses.forEach((status) => {
                bubbles.push(
                    <div
                        key={`owner-status-${status.id}`}
                        onClick={() => {
                            startTransition(() => {
                                const newStatuses = optimisticFilters.statuses.filter(s => s.id !== status.id);
                                updateOptimisticFilters({ statuses: newStatuses });
                                router.push(createRemoveFilterURL('statuses', status));
                            });
                        }}
                    >
                        <Button variant="outline" className={bubbleStyle}>  
                            Their Status: {getStatusName(status.id)}
                            <X className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                );
            });
        }

        // Handle watch list filter
        if (optimisticFilters.addedToWatchlist !== undefined) {
            const watchlistText = optimisticFilters.addedToWatchlist 
                ? "In Their Watch List" 
                : "Not In Their Watch List";
                
            bubbles.push(
                <div
                    key="owner-watchlist"
                    onClick={() => {
                        startTransition(() => {
                            const newWatchlistValue = !optimisticFilters.addedToWatchlist;
                            updateOptimisticFilters({ addedToWatchlist: newWatchlistValue });
                            router.push(createRemoveFilterURL('addedToWatchlist', newWatchlistValue));
                        });
                    }}
                >
                    <Button variant="outline" className={bubbleStyle}>
                        {watchlistText}
                        <X className="ml-1 h-4 w-4" />
                    </Button>
                </div>
            );
        }

        return bubbles;
    };

    const hasActiveFilters = () => {
        return Object.values(optimisticFilters).some(value => 
            (Array.isArray(value) && value.length > 0) || 
            (typeof value === 'boolean' && value !== undefined)
        );
    };

    // Create a URL that clears all watchlist owner filters but keeps other filters
    const clearOwnerFiltersURL = () => {
        const url = new URL(pathname, typeof window !== 'undefined' ? window.location.origin : '');
        
        // Add only show filter params
        if (currentFilters.service.length > 0) url.searchParams.set('service', currentFilters.service.map(s => s.id).join(','));
        if (currentFilters.length.length > 0) url.searchParams.set('length', currentFilters.length.join(','));
        if (currentFilters.airDate.length > 0) url.searchParams.set('airDate', currentFilters.airDate.join(','));
        if (currentFilters.limitedSeries !== undefined && currentFilters.limitedSeries !== null) url.searchParams.set('limitedSeries', currentFilters.limitedSeries.toString());
        if (currentFilters.running !== undefined && currentFilters.running !== null) url.searchParams.set('running', currentFilters.running.toString());
        if (currentFilters.currentlyAiring !== undefined && currentFilters.currentlyAiring !== null) url.searchParams.set('currentlyAiring', currentFilters.currentlyAiring.toString());
        
        return pathname + url.search;
    };

    return (
        <div className="flex flex-wrap gap-2 items-center">
            {renderFilterBubbles()}
            {hasActiveFilters() && (
                <div
                    onClick={() => {
                        startTransition(() => {
                            router.push(clearOwnerFiltersURL());
                        });
                    }}
                >
                    <Button variant="outline" className="m-1 bg-white/90 text-black hover:bg-white/10 hover:text-white px-3 py-1 rounded-md inline-flex items-center">
                        Clear Their Filters
                        <X className="ml-1 h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
} 