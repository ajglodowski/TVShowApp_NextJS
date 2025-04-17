import { AirDate } from "@/app/models/airDate";
import { Service } from "@/app/models/service";
import { ShowLength } from "@/app/models/showLength";
import { ShowSearchType } from "@/app/models/showSearchType";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { getServices } from "../ShowSearchService";
import ShowSearchCurrentUserFilters, { CurrentUserFilters, defaultCurrentUserFilters } from "./ShowSearchCurrentUserFilters";
import ShowSearchCurrentUserFiltersRow from "./ShowSearchCurrentUserFiltersRow";
import ShowSearchFilterButton from "./ShowSearchFilterButton";
import ShowSearchFilterButtonSkeleton from "./ShowSearchFilterButtonSkeleton";
import ShowSearchFiltersRow from "./ShowSearchFiltersRow";
import ClearSearchButton from "./ShowSearchClearSearchButton";
import ShowSearchWatchlistOwnerFilters from "./ShowSearchWatchlistOwnerFilters";
import ShowSearchWatchlistOwnerFiltersRow from "./ShowSearchWatchlistOwnerFiltersRow";
import { getAllStatuses } from "@/app/show/[showId]/UserShowDataService";
import SortButton, { SortOption } from "./SortButton";

export type ShowSearchFiltersType = {
    service: Service[];
    length: ShowLength[];
    airDate: AirDate[];
    limitedSeries?: boolean;
    running?: boolean;
    currentlyAiring?: boolean;
    sortBy?: SortOption;
}

export const defaultFilters: ShowSearchFiltersType = {
    service: [],
    length: [],
    airDate: [],
    limitedSeries: undefined,
    running: undefined,
    currentlyAiring: undefined,
    sortBy: undefined
}

type ShowSearchHeaderProps = {
    filters: ShowSearchFiltersType;
    searchResults?: string;
    currentUserFilters: CurrentUserFilters;
    watchlistOwnerFilters?: CurrentUserFilters;
    pathname: string;
    searchType?: ShowSearchType;
    userId?: string;
    currentUserId?: string;
}

export default async function ShowSearchHeader({ 
    filters, 
    searchResults = '', 
    currentUserFilters = defaultCurrentUserFilters,
    watchlistOwnerFilters = defaultCurrentUserFilters,
    pathname,
    searchType = ShowSearchType.UNRESTRICTED,
    userId,
    currentUserId
}: ShowSearchHeaderProps) {
    // Determine if viewing other user's watchlist where current user != watchlist owner
    const isViewingOtherUserWatchlist = searchType === ShowSearchType.OTHER_USER_WATCHLIST && 
                                      currentUserId && userId && currentUserId !== userId;
    
    // Generate URLs for various filter changes
    const clearSearchURL = () => {
        let queryParams = [];
        
        // Add all current filter params except search
        if (filters.service.length > 0) queryParams.push(`service=${filters.service.map(s => s.id).join(',')}`);
        if (filters.length.length > 0) queryParams.push(`length=${filters.length.join(',')}`);
        if (filters.airDate.length > 0) queryParams.push(`airDate=${filters.airDate.join(',')}`);
        if (filters.limitedSeries !== undefined) queryParams.push(`limitedSeries=${filters.limitedSeries.toString()}`);
        if (filters.running !== undefined) queryParams.push(`running=${filters.running.toString()}`);
        if (filters.currentlyAiring !== undefined) queryParams.push(`currentlyAiring=${filters.currentlyAiring.toString()}`);
        if (filters.sortBy !== undefined) queryParams.push(`sortBy=${filters.sortBy}`);
        
        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        return pathname + queryString;
    };

    const getServicesFunction = getServices();
    const getStatusesFunction = getAllStatuses();
    
    const statuses = await getStatusesFunction;
    
    return (
        <div className="">
            <div className="text-white px-4 py-1 flex-wrap justify-between">
                <div className="flex flex-col md:flex-row justify-between space-x-0 md:space-x-2 items-center mt-4">
                    <form 
                        action={pathname} 
                        method="get" 
                        className="relative flex-1 w-full mb-4 md:mb-0"
                    >
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                        <Input
                            className={`pl-10 bg-white/5 text-white`}
                            type="text"
                            name="search"
                            placeholder="Search through results" 
                            defaultValue={searchResults}
                        />
                        {/* Preserve existing filter parameters */}
                        {filters.service.length > 0 && (
                            <input type="hidden" name="service" value={filters.service.map(s => s.id).join(',')} />
                        )}
                        {filters.length.length > 0 && (
                            <input type="hidden" name="length" value={filters.length.join(',')} />
                        )}
                        {filters.airDate.length > 0 && (
                            <input type="hidden" name="airDate" value={filters.airDate.join(',')} />
                        )}
                        {filters.limitedSeries !== undefined && (
                            <input type="hidden" name="limitedSeries" value={filters.limitedSeries.toString()} />
                        )}
                        {filters.running !== undefined && (
                            <input type="hidden" name="running" value={filters.running.toString()} />
                        )}
                        {filters.currentlyAiring !== undefined && (
                            <input type="hidden" name="currentlyAiring" value={filters.currentlyAiring.toString()} />
                        )}
                        {filters.sortBy !== undefined && (
                            <input type="hidden" name="sortBy" value={filters.sortBy} />
                        )}
                        {/* Do not include page parameter - intentionally omitted */}
                        
                        {searchResults && (
                            <ClearSearchButton href={clearSearchURL()} />
                        )}
                    </form>
                    <div className="flex-1 space-x-2 w-full flex flex-wrap gap-2 justify-end">
                        {/* Sort Button - Positioned first for visibility */}
                        <div className="min-w-32 block">
                            <SortButton
                                currentSort={filters.sortBy}
                                pathname={pathname}
                                currentFilters={filters}
                            />
                        </div>
                        
                        {/* Current User Filters Button */}
                        <ShowSearchCurrentUserFilters 
                            filters={currentUserFilters} 
                            pathname={pathname}
                            currentFilters={filters}
                            searchType={searchType}
                            userId={userId}
                            currentUserId={currentUserId}
                            getStatusesFunction={getStatusesFunction}
                        />
                        
                        {/* Show Watchlist Owner Filters Button when viewing other user's watchlist */}
                        {isViewingOtherUserWatchlist && (
                            <ShowSearchWatchlistOwnerFilters
                                filters={watchlistOwnerFilters}
                                pathname={pathname}
                                currentFilters={filters}
                                userId={userId}
                                getStatusesFunction={getStatusesFunction}
                            />
                        )}
                        
                        {/* Show Filters Button */}
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
                    searchType={searchType}
                    userId={userId}
                    currentUserId={currentUserId}
                    statuses={statuses || []}
                />
                
                {/* Show Watchlist Owner Filters Row when viewing other user's watchlist */}
                {isViewingOtherUserWatchlist && (
                    <ShowSearchWatchlistOwnerFiltersRow 
                        filters={watchlistOwnerFilters}
                        pathname={pathname}
                        currentFilters={filters}
                        userId={userId}
                        statuses={statuses || []}
                    />
                )}
            </div>
        </div>
    );
};