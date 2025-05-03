import { Skeleton } from "@/components/ui/skeleton";
import ShowSearchInput from "./ShowSearchInput";
import { ShowSearchHeaderProps } from "./ShowSearchHeader";
import { ShowSearchType } from "@/app/models/showSearchType";
import ShowSearchCurrentUserFilters, { defaultCurrentUserFilters } from "./ShowSearchCurrentUserFilters";
import SortButton from "./SortButton";
import ShowSearchWatchlistOwnerFilters from "./ShowSearchWatchlistOwnerFilters";
import ShowSearchFilterButtonSkeleton from "./ShowSearchFilterButtonSkeleton";
import ShowSearchFiltersRow from "./ShowSearchFiltersRow";
import ShowSearchTagsRow from "./ShowSearchTagsRow";
import ShowSearchCurrentUserFiltersRow from "./ShowSearchCurrentUserFiltersRow";
import ShowSearchWatchlistOwnerFiltersRow from "./ShowSearchWatchlistOwnerFiltersRow";
import ShowSearchTagsButtonSkeleton from "./ShowSearchFilterButtonSkeleton copy";

export default function ShowSearchHeaderLoading({ 
    filters, 
    searchResults = '', 
    currentUserFilters = defaultCurrentUserFilters,
    watchlistOwnerFilters = defaultCurrentUserFilters,
    pathname,
    searchType = ShowSearchType.UNRESTRICTED,
    userId,
    currentUserId
}: ShowSearchHeaderProps) {

    const isViewingOtherUserWatchlist = searchType === ShowSearchType.OTHER_USER_WATCHLIST && 
                                      currentUserId && userId && currentUserId !== userId;

    return (
        <div className="">
            <div className="text-white px-4 py-1 flex-wrap justify-between">
                <div className="flex flex-col md:flex-row justify-between space-x-0 md:space-x-2 items-center mt-4">
                    <ShowSearchInput 
                        searchResults={searchResults}
                        pathname={pathname} 
                    />
                    
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
                            statuses={[]}
                        />
                        
                        {/* Show Watchlist Owner Filters Button when viewing other user's watchlist */}
                        {isViewingOtherUserWatchlist && (
                            <ShowSearchWatchlistOwnerFilters
                                filters={watchlistOwnerFilters}
                                pathname={pathname}
                                currentFilters={filters}
                                userId={userId}
                                statuses={[]}
                            />
                        )}
                        
                        {/* Show Tag Filter Button */}
                        <ShowSearchTagsButtonSkeleton />
                        
                        {/* Show Filters Button */}
                        <ShowSearchFilterButtonSkeleton />
                    </div>
                </div>

                <ShowSearchFiltersRow 
                    filters={filters} 
                    pathname={pathname}
                />
                
                {/* Show Tags Row (will only display if there are selected tags) */}
                <ShowSearchTagsRow 
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
                    statuses={[]}
                />
                
                {/* Show Watchlist Owner Filters Row when viewing other user's watchlist */}
                {isViewingOtherUserWatchlist && (
                    <ShowSearchWatchlistOwnerFiltersRow 
                        filters={watchlistOwnerFilters}
                        pathname={pathname}
                        currentFilters={filters}
                        userId={userId}
                        statuses={[]}
                    />
                )}
            </div>
        </div>
    );
}