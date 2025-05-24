import { AirDate } from "@/app/models/airDate";
import { Service } from "@/app/models/service";
import { ShowLength } from "@/app/models/showLength";
import { ShowSearchType } from "@/app/models/showSearchType";
import { Status } from "@/app/models/status";
import { Suspense } from "react";
import { getServices } from "../ShowSearchService";
import ShowSearchCurrentUserFilters, { CurrentUserFilters, defaultCurrentUserFilters } from "./ShowSearchCurrentUserFilters";
import ShowSearchCurrentUserFiltersRow from "./ShowSearchCurrentUserFiltersRow";
import ShowSearchFilterButton from "./ShowSearchFilterButton";
import ShowSearchFilterButtonSkeleton from "./ShowSearchFilterButtonSkeleton";
import ShowSearchFiltersRow from "./ShowSearchFiltersRow";
import ShowSearchInput from "./ShowSearchInput";
import ShowSearchWatchlistOwnerFilters from "./ShowSearchWatchlistOwnerFilters";
import ShowSearchWatchlistOwnerFiltersRow from "./ShowSearchWatchlistOwnerFiltersRow";
import SortButton, { SortOption } from "./SortButton";
import { ShowTag } from "@/app/models/showTag";
import TagFilterButton from "./TagFilterButton";
import ShowSearchTagsRow from "./ShowSearchTagsRow";
import { getAllTags } from "@/app/(main)/show/[showId]/ShowService";
import { getAllStatuses } from "@/app/(main)/show/[showId]/UserShowDataService";

export type ShowSearchFiltersType = {
    service: Service[];
    length: ShowLength[];
    airDate: AirDate[];
    limitedSeries: boolean | null;
    running: boolean | null;
    currentlyAiring: boolean | null;
    sortBy: SortOption | undefined;
    tags: ShowTag[];
}

export const defaultFilters: ShowSearchFiltersType = {
    service: [],
    length: [],
    airDate: [],
    limitedSeries: null,
    running: null,
    currentlyAiring: null,
    sortBy: undefined,
    tags: [],
}

export type ShowSearchHeaderProps = {
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
    
    // Fetch data directly in the Server Component
    const services: Service[] | null = await getServices(); 
    const statuses: Status[] | null = await getAllStatuses();
    const tags: ShowTag[] | null = await getAllTags(); // Fetch all tags
    
    return (
        <div className="">
            <div className="">
                {/* Main Header Section */}
                <div className="space-y-4">
                    {/* Top Row: Search and Primary Actions */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 md:px-4">
                        {/* Search Input - Takes priority on mobile */}
                        <div className="flex-1 max-w-lg">
                            <ShowSearchInput 
                                searchResults={searchResults}
                                pathname={pathname} 
                            />
                        </div>
                        
                        {/* Filter Actions - Organized in groups */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Primary Action: Sort */}
                            <div className="order-1">
                                <SortButton
                                    currentSort={filters.sortBy}
                                    pathname={pathname}
                                    currentFilters={filters}
                                />
                            </div>
                            
                            {/* User Filters Group */}
                            <div className="flex items-center gap-2 order-2">
                                <ShowSearchCurrentUserFilters 
                                    filters={currentUserFilters} 
                                    pathname={pathname}
                                    currentFilters={filters}
                                    searchType={searchType}
                                    userId={userId}
                                    currentUserId={currentUserId}
                                    statuses={statuses}
                                />
                                
                                {/* Show Watchlist Owner Filters Button when viewing other user's watchlist */}
                                {isViewingOtherUserWatchlist && (
                                    <ShowSearchWatchlistOwnerFilters
                                        filters={watchlistOwnerFilters}
                                        pathname={pathname}
                                        currentFilters={filters}
                                        userId={userId}
                                        statuses={statuses}
                                    />
                                )}
                            </div>
                            
                            {/* Content Filters Group */}
                            <div className="flex items-center gap-2 order-3">
                                <Suspense fallback={<ShowSearchFilterButtonSkeleton />}>
                                    <TagFilterButton
                                        filters={filters}
                                        pathname={pathname}
                                        tags={tags}
                                    />
                                </Suspense>
                                
                                <Suspense fallback={<ShowSearchFilterButtonSkeleton />}>
                                    <ShowSearchFilterButton 
                                        filters={filters} 
                                        pathname={pathname}
                                        services={services}
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Filters Display Section */}
                <div className="mt-6 space-y-3">
                    {/* Main Show Filters */}
                    <ShowSearchFiltersRow 
                        filters={filters} 
                        pathname={pathname}
                    />
                    
                    {/* Tag Filters Row */}
                    <ShowSearchTagsRow 
                        filters={filters} 
                        pathname={pathname}
                    />
                    
                    {/* Current User Filters Row */}
                    <ShowSearchCurrentUserFiltersRow 
                        filters={currentUserFilters} 
                        pathname={pathname}
                        currentFilters={filters}
                        searchType={searchType}
                        userId={userId}
                        currentUserId={currentUserId}
                        statuses={statuses || []}
                    />
                    
                    {/* Watchlist Owner Filters Row */}
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
        </div>
    );
};