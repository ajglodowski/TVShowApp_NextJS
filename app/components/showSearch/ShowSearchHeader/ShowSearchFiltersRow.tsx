'use client'
import { Button } from "@/components/ui/button";
import { ShowSearchFiltersType, defaultFilters } from "./ShowSearchHeader";
import { X } from "lucide-react";
import { ReactNode } from "react";
import { Service } from "@/app/models/service";
import { ShowLength } from "@/app/models/showLength";
import { AirDate } from "@/app/models/airDate";
import { backdropBackground } from "@/utils/stylingConstants";

// Define button styles as a constant
const buttonStyles = ` ${backdropBackground} rounded-full text-white`;

export default function ShowSearchFiltersRow({ filters, setFilters }: { filters: ShowSearchFiltersType, setFilters: Function }) {
    const removeFilter = (key: keyof ShowSearchFiltersType, value: Service | ShowLength | AirDate | boolean) => {
        setFilters((prev: ShowSearchFiltersType) => {
            const newFilters = { ...prev };
            if (Array.isArray(newFilters[key])) {
                switch (key) {
                    case 'service':
                        newFilters.service = newFilters.service.filter(item => item !== value);
                        break;
                    case 'length':
                        newFilters.length = newFilters.length.filter(item => item !== value);
                        break;
                    case 'airDate':
                        newFilters.airDate = newFilters.airDate.filter(item => item !== value);
                        break;
                }
            } else {
                switch (key) {
                    case 'limitedSeries':
                        newFilters.limitedSeries = undefined;
                        break;
                    case 'running':
                        newFilters.running = undefined;
                        break;
                    case 'currentlyAiring':
                        newFilters.currentlyAiring = undefined;
                        break;
                }
            }
            return newFilters;
        });
    };

    const clearAllFilters = () => {
        setFilters(defaultFilters);
    };

    const renderFilterBubbles = (): ReactNode[] => {
        const bubbles: ReactNode[] = [];

        // Handle array filters (service, length, airDate)
        Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
                value.forEach((item) => {
                    let displayValue: string;
                    if (key === 'service') {
                        displayValue = (item as Service).name;
                    } else if (key === 'length') {
                        displayValue = item as ShowLength;
                    } else {
                        displayValue = item as AirDate;
                    }
                    bubbles.push(
                        <Button
                            key={`${key}-${displayValue}`}
                            variant="outline"
                            className={buttonStyles}
                            onClick={() => removeFilter(key as keyof ShowSearchFiltersType, item)}
                        >
                            {displayValue}
                            <X className="ml-0 h-4 w-4" />
                        </Button>
                    );
                });
            }
            // Handle boolean filters (limitedSeries, running, currentlyAiring)
            else if (typeof value === 'boolean') {
                bubbles.push(
                    <Button
                        key={key}
                        variant="outline"
                        className={buttonStyles}
                        onClick={() => removeFilter(key as keyof ShowSearchFiltersType, value)}
                    >
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                        <X className="ml-0 h-4 w-4" />
                    </Button>
                );
            }
        });

        return bubbles;
    };

    const hasActiveFilters = () => {
        return Object.values(filters).some(value => 
            (Array.isArray(value) && value.length > 0) || 
            (typeof value === 'boolean' && value)
        );
    };

    return (
        <div className="flex flex-wrap items-center p-2 space-x-2">
            {renderFilterBubbles()}
            {hasActiveFilters() && (
                <Button
                    variant="outline"
                    className="m-1 bg-white/90 text-black hover:bg-white/10 hover:text-white"
                    onClick={clearAllFilters}
                >
                    Clear Show Filters
                    <X className=" h-4 w-4" />
                </Button>
            )}
        </div>
    );
}