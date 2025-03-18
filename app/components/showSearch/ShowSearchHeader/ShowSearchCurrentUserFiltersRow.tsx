'use client'
import { Button } from "@/components/ui/button";
import { backdropBackground } from "@/utils/stylingConstants";
import { X } from "lucide-react";
import { CurrentUserFilters } from "./ShowSearchCurrentUserFilters";
import { Rating } from "@/app/models/rating";
import { Status } from "@/app/models/status";
import { ReactNode } from "react";

type ShowSearchCurrentUserFiltersProps = {
    filters: CurrentUserFilters;
    setFilters: Function;
}

export default function ShowSearchCurrentUserFiltersRow(props: ShowSearchCurrentUserFiltersProps) {
    const { filters, setFilters } = props;

    const removeFilter = (key: keyof CurrentUserFilters, value: Rating | Status | boolean | undefined) => {
        setFilters((prev: CurrentUserFilters) => {
            const newFilters = { ...prev };
            if (key === 'ratings') {
                newFilters.ratings = newFilters.ratings.filter(item => item !== value);
            } else if (key === 'statuses') {
                newFilters.statuses = newFilters.statuses.filter(item => item !== value);
            } else {
                newFilters.addedToWatchlist = undefined;
            }
            return newFilters;
        });
    };

    const renderFilterBubbles = (): ReactNode[] => {
        const bubbles: ReactNode[] = [];
        const bubbleStyle = `${backdropBackground} rounded-full text-white`;

        // Handle ratings
        if (filters.ratings.length > 0) {
            filters.ratings.forEach((rating) => {
                bubbles.push(
                    <Button
                        key={`rating-${rating}`}
                        variant="outline"
                        className={bubbleStyle}
                        onClick={() => removeFilter('ratings', rating)}
                    >
                        Rating: {rating.toString()}
                        <X className="ml-0.5 h-4 w-4" />
                    </Button>
                );
            });
        }

        // Handle statuses
        if (filters.statuses.length > 0) {
            filters.statuses.forEach((status) => {
                bubbles.push(
                    <Button
                        key={`status-${status}`}
                        variant="outline"
                        className={bubbleStyle}
                        onClick={() => removeFilter('statuses', status)}
                    >
                        Status: {status.toString()}
                        <X className="ml-0.5 h-4 w-4" />
                    </Button>
                );
            });
        }

        // Handle watch list filter
        if (filters.addedToWatchlist !== undefined) {
            const watchlistText = filters.addedToWatchlist ? "In Watch List" : "Not In Watch List";
            bubbles.push(
                <Button
                    key="watchlist"
                    variant="outline"
                    className={bubbleStyle}
                    onClick={() => removeFilter('addedToWatchlist', filters.addedToWatchlist)}
                >
                    {watchlistText}
                    <X className="ml-0.5 h-4 w-4" />
                </Button>
            );
        }

        return bubbles;
    };

    const hasActiveFilters = () => {
        return Object.values(filters).some(value => 
            (Array.isArray(value) && value.length > 0) || 
            (typeof value === 'boolean' && value)
        );
    };

    const clearAllFilters = () => {
        setFilters({
            addedToWatchlist: undefined,
            ratings: [],
            statuses: []
        });
    };

    return (
        <div className="flex flex-wrap gap-2 items-center">
            {renderFilterBubbles()}
            {hasActiveFilters() && (
                <Button
                    variant="outline"
                    className="m-1 bg-white/90 text-black hover:bg-white/10 hover:text-white"
                    onClick={clearAllFilters}
                >
                    Clear Your Filters
                    <X className=" h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
