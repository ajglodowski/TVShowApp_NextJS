'use client'
import { backdropBackground } from "@/utils/stylingConstants";
import { X } from "lucide-react";
import { CurrentUserFilters } from "./ShowSearchCurrentUserFilters";
import { Rating } from "@/app/models/rating";
import { Status } from "@/app/models/status";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ShowSearchFiltersType } from "./ShowSearchHeader";
import { Button } from "@/components/ui/button";
import { useOptimistic, useTransition } from "react";

type ShowSearchCurrentUserFiltersProps = {
    filters: CurrentUserFilters;
    pathname: string;
    currentFilters: ShowSearchFiltersType;
}

export default function ShowSearchCurrentUserFiltersRow({ 
    filters, 
    pathname, 
    currentFilters 
}: ShowSearchCurrentUserFiltersProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [optimisticFilters, updateOptimisticFilters] = useOptimistic(
        filters,
        (state, update: Partial<CurrentUserFilters>) => ({
            ...state,
            ...update
        })
    );

    const createRemoveFilterURL = (key: keyof CurrentUserFilters, value: Rating | Status | boolean | undefined) => {
        const url = new URL(pathname, "http://localhost");
        
        // Add all current filter params
        if (currentFilters.service.length > 0) url.searchParams.set('service', currentFilters.service.map(s => s.id).join(','));
        if (currentFilters.length.length > 0) url.searchParams.set('length', currentFilters.length.join(','));
        if (currentFilters.airDate.length > 0) url.searchParams.set('airDate', currentFilters.airDate.join(','));
        if (currentFilters.limitedSeries !== undefined) url.searchParams.set('limitedSeries', currentFilters.limitedSeries.toString());
        if (currentFilters.running !== undefined) url.searchParams.set('running', currentFilters.running.toString());
        if (currentFilters.currentlyAiring !== undefined) url.searchParams.set('currentlyAiring', currentFilters.currentlyAiring.toString());
        
        // Handle user filter params
        if (key === 'ratings') {
            const newRatings = optimisticFilters.ratings.filter(r => r !== value);
            if (newRatings.length > 0) {
                url.searchParams.set('ratings', newRatings.join(','));
            }
        } else if (optimisticFilters.ratings && optimisticFilters.ratings.length > 0) {
            url.searchParams.set('ratings', optimisticFilters.ratings.join(','));
        }
        
        if (key === 'statuses') {
            const newStatuses = optimisticFilters.statuses.filter(s => s !== value);
            if (newStatuses.length > 0) {
                url.searchParams.set('statuses', newStatuses.join(','));
            }
        } else if (optimisticFilters.statuses && optimisticFilters.statuses.length > 0) {
            url.searchParams.set('statuses', optimisticFilters.statuses.join(','));
        }
        
        if (key !== 'addedToWatchlist' && optimisticFilters.addedToWatchlist !== undefined) {
            url.searchParams.set('addedToWatchlist', optimisticFilters.addedToWatchlist.toString());
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
                        key={`rating-${rating}`}
                        onClick={() => {
                            startTransition(() => {
                                const newRatings = optimisticFilters.ratings.filter(r => r !== rating);
                                updateOptimisticFilters({ ratings: newRatings });
                                router.push(createRemoveFilterURL('ratings', rating));
                            });
                        }}
                    >
                        <Button variant="outline" className={bubbleStyle}>
                            Rating: {rating.toString()}
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
                        key={`status-${status}`}
                        onClick={() => {
                            startTransition(() => {
                                const newStatuses = optimisticFilters.statuses.filter(s => s !== status);
                                updateOptimisticFilters({ statuses: newStatuses });
                                router.push(createRemoveFilterURL('statuses', status));
                            });
                        }}
                    >
                        <Button variant="outline" className={bubbleStyle}>  
                            Status: {status.toString()}
                            <X className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                );
            });
        }

        // Handle watch list filter
        if (optimisticFilters.addedToWatchlist !== undefined) {
            const watchlistText = optimisticFilters.addedToWatchlist ? "In Watch List" : "Not In Watch List";
            bubbles.push(
                <div
                    key="watchlist"
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

    // Create a URL that clears all user filters but keeps show filters
    const clearUserFiltersURL = () => {
        const url = new URL(pathname, "http://localhost");
        
        // Add only show filter params
        if (currentFilters.service.length > 0) url.searchParams.set('service', currentFilters.service.map(s => s.id).join(','));
        if (currentFilters.length.length > 0) url.searchParams.set('length', currentFilters.length.join(','));
        if (currentFilters.airDate.length > 0) url.searchParams.set('airDate', currentFilters.airDate.join(','));
        if (currentFilters.limitedSeries !== undefined) url.searchParams.set('limitedSeries', currentFilters.limitedSeries.toString());
        if (currentFilters.running !== undefined) url.searchParams.set('running', currentFilters.running.toString());
        if (currentFilters.currentlyAiring !== undefined) url.searchParams.set('currentlyAiring', currentFilters.currentlyAiring.toString());
        
        return pathname + url.search;
    };

    return (
        <div className="flex flex-wrap gap-2 items-center">
            {renderFilterBubbles()}
            {hasActiveFilters() && (
                <div
                    onClick={() => {
                        startTransition(() => {
                            router.push(clearUserFiltersURL());
                        });
                    }}
                >
                    <Button variant="outline" className="m-1 bg-white/90 text-black hover:bg-white/10 hover:text-white px-3 py-1 rounded-md inline-flex items-center">
                        Clear Your Filters
                        <X className="ml-1 h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
