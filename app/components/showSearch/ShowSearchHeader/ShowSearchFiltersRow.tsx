'use client'
import { Button } from "@/components/ui/button";
import { ShowSearchFiltersType, defaultFilters } from "./ShowSearchHeader";
import { X } from "lucide-react";
import { ReactNode } from "react";
import { Service } from "@/app/models/service";
import { ShowLength } from "@/app/models/showLength";
import { AirDate } from "@/app/models/airDate";
import { backdropBackground } from "@/utils/stylingConstants";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";

// Define button styles as a constant
const buttonStyles = ` ${backdropBackground} rounded-full text-white`;

export default function ShowSearchFiltersRow({ 
    filters, 
    pathname 
}: { 
    filters: ShowSearchFiltersType, 
    pathname: string 
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [optimisticFilters, updateOptimisticFilters] = useOptimistic(
        filters,
        (state, update: Partial<ShowSearchFiltersType>) => ({
            ...state,
            ...update
        })
    );

    // Function to create a URL with the filter removed
    const createRemoveFilterURL = (key: keyof ShowSearchFiltersType, value: Service | ShowLength | AirDate | boolean) => {
        const url = new URL(pathname, "http://localhost");
        
        // Add current filter params except the one we're removing
        if (optimisticFilters.service.length > 0) {
            if (key === 'service') {
                const newServices = optimisticFilters.service.filter(s => s.id !== (value as Service).id);
                if (newServices.length > 0) {
                    url.searchParams.set('service', newServices.map(s => s.id).join(','));
                }
            } else {
                url.searchParams.set('service', optimisticFilters.service.map(s => s.id).join(','));
            }
        }
        
        if (optimisticFilters.length.length > 0) {
            if (key === 'length') {
                const newLengths = optimisticFilters.length.filter(l => l !== value);
                if (newLengths.length > 0) {
                    url.searchParams.set('length', newLengths.join(','));
                }
            } else {
                url.searchParams.set('length', optimisticFilters.length.join(','));
            }
        }
        
        if (optimisticFilters.airDate.length > 0) {
            if (key === 'airDate') {
                const newAirDates = optimisticFilters.airDate.filter(a => a !== value);
                if (newAirDates.length > 0) {
                    url.searchParams.set('airDate', newAirDates.join(','));
                }
            } else {
                url.searchParams.set('airDate', optimisticFilters.airDate.join(','));
            }
        }
        
        if (optimisticFilters.limitedSeries !== undefined && key !== 'limitedSeries') {
            url.searchParams.set('limitedSeries', optimisticFilters.limitedSeries.toString());
        }
        
        if (optimisticFilters.running !== undefined && key !== 'running') {
            url.searchParams.set('running', optimisticFilters.running.toString());
        }
        
        if (optimisticFilters.currentlyAiring !== undefined && key !== 'currentlyAiring') {
            url.searchParams.set('currentlyAiring', optimisticFilters.currentlyAiring.toString());
        }
        
        return pathname + url.search;
    };

    const renderFilterBubbles = (): ReactNode[] => {
        const bubbles: ReactNode[] = [];

        // Handle array filters (service, length, airDate)
        Object.entries(optimisticFilters).forEach(([key, value]) => {
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
                        <div
                            key={`${key}-${displayValue}`}
                            onClick={() => {
                                startTransition(() => {
                                    const currentFilters = optimisticFilters[key as keyof ShowSearchFiltersType];
                                    if (Array.isArray(currentFilters)) {
                                        const newFilters = currentFilters.filter((i) => i !== item);
                                        updateOptimisticFilters({ [key as keyof ShowSearchFiltersType]: newFilters });
                                        router.push(createRemoveFilterURL(key as keyof ShowSearchFiltersType, item));
                                    }
                                });
                            }}
                        >
                            <Button variant="outline" className={buttonStyles}>
                                {displayValue}
                                <X className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    );
                });
            }
            // Handle boolean filters (limitedSeries, running, currentlyAiring)
            else if (typeof value === 'boolean') {
                bubbles.push(
                    <div
                        key={key}
                        onClick={() => {
                            startTransition(() => {
                                updateOptimisticFilters({ [key]: undefined });
                                router.push(createRemoveFilterURL(key as keyof ShowSearchFiltersType, value));
                            });
                        }}
                    >
                        <Button variant="outline" className={buttonStyles}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                            <X className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                );
            }
        });

        return bubbles;
    };

    const hasActiveFilters = () => {
        return Object.values(optimisticFilters).some(value => 
            (Array.isArray(value) && value.length > 0) || 
            (typeof value === 'boolean' && value !== undefined)
        );
    };

    return (
        <div className="flex flex-wrap items-center p-2 space-x-2">
            {renderFilterBubbles()}
            {hasActiveFilters() && (
                <div
                    onClick={() => {
                        startTransition(() => {
                            router.push(pathname);
                        });
                    }}
                >
                    <Button variant="outline" className="m-1 bg-white/90 text-black hover:bg-white/10 hover:text-white px-3 py-1 rounded-md inline-flex items-center">
                        Clear Show Filters
                        <X className="ml-1 h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}