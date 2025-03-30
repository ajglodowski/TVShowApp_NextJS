import { AirDate } from "@/app/models/airDate";
import { Service } from "@/app/models/service";
import { ShowLength } from "@/app/models/showLength";
import { Input } from "@/components/ui/input";
import ShowSearchCurrentUserFilters, { CurrentUserFilters, defaultCurrentUserFilters } from "./ShowSearchCurrentUserFilters";
import { Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShowSearchFilterButton from "./ShowSearchFilterButton";
import ShowSearchFiltersRow from "./ShowSearchFiltersRow";
import ShowSearchCurrentUserFiltersRow from "./ShowSearchCurrentUserFiltersRow";
import Link from "next/link";
import { getServices } from "../ShowSearchService";
import { Suspense } from "react";
import ShowSearchFilterButtonSkeleton from "./ShowSearchFilterButtonSkeleton";

export type ShowSearchFiltersType = {
    service: Service[];
    length: ShowLength[];
    airDate: AirDate[];
    limitedSeries?: boolean;
    running?: boolean;
    currentlyAiring?: boolean;
}

export const defaultFilters: ShowSearchFiltersType = {
    service: [],
    length: [],
    airDate: [],
    limitedSeries: undefined,
    running: undefined,
    currentlyAiring: undefined
}

type ShowSearchHeaderProps = {
    filters: ShowSearchFiltersType;
    searchResults?: string;
    currentUserFilters: CurrentUserFilters;
    pathname: string;
}

export default async function ShowSearchHeader({ 
    filters, 
    searchResults = '', 
    currentUserFilters = defaultCurrentUserFilters, 
    pathname 
}: ShowSearchHeaderProps) {
    // Generate URLs for various filter changes
    const clearSearchURL = () => {
        const url = new URL(pathname, typeof window !== 'undefined' ? window.location.origin : '');
        
        // Add all current filter params except search
        if (filters.service.length > 0) url.searchParams.set('service', filters.service.map(s => s.id).join(','));
        if (filters.length.length > 0) url.searchParams.set('length', filters.length.join(','));
        if (filters.airDate.length > 0) url.searchParams.set('airDate', filters.airDate.join(','));
        if (filters.limitedSeries !== undefined) url.searchParams.set('limitedSeries', filters.limitedSeries.toString());
        if (filters.running !== undefined) url.searchParams.set('running', filters.running.toString());
        if (filters.currentlyAiring !== undefined) url.searchParams.set('currentlyAiring', filters.currentlyAiring.toString());
        
        return url.pathname + url.search;
    };

    const getServicesFunction = getServices();
    
    return (
        <div className="">
            <div className="text-white px-4 py-1">
                <div className="flex justify-between space-x-2 items-center mt-4">
                    <form action={pathname} method="get" className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                        <Input
                            className={`pl-10 bg-white/5 text-white`}
                            type="text"
                            name="search"
                            placeholder="Search through results" 
                            defaultValue={searchResults}
                        />
                        {searchResults && (
                            <Link
                                href={clearSearchURL()}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 flex items-center justify-center"
                            >
                                <X className="h-4 w-4" />
                            </Link>
                        )}
                    </form>
                    <div className="flex space-x-2">
                        <ShowSearchCurrentUserFilters 
                            filters={currentUserFilters} 
                            pathname={pathname}
                            currentFilters={filters}
                        />
                        <Suspense fallback={<ShowSearchFilterButtonSkeleton />}>
                            <ShowSearchFilterButton 
                                filters={filters} 
                                pathname={pathname}
                                getServicesFunction={getServicesFunction}
                            />
                        </Suspense>
                    </div>
                </div>

                <ShowSearchFiltersRow 
                    filters={filters} 
                    pathname={pathname}
                />
                <ShowSearchCurrentUserFiltersRow 
                    filters={currentUserFilters} 
                    pathname={pathname}
                    currentFilters={filters}
                />
                
            </div>
        </div>
    );
};