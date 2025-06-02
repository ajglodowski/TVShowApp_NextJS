'use server';
import { Suspense } from 'react';
import { parseCurrentUserFilters, parseFiltersFromSearchParams, parseWatchlistOwnerFilters } from './ShowSearchFilterParsing';
import { defaultCurrentUserFilters } from './ShowSearchHeader/ShowSearchCurrentUserFilters';
import ShowSearchHeader from './ShowSearchHeader/ShowSearchHeader';
import ShowSearchHeaderLoading from './ShowSearchHeader/ShowSearchHeaderLoading';
import ShowSearchShows from './ShowSearchShows';
import ShowSearchShowsLoading from './ShowSearchShowsLoading';
import PaginationControls from './PaginationControls';
import { ShowSearchProps } from './types';
import { ShowSearchType } from '@/app/models/showSearchType';
import { fetchShows, fetchUsersWatchlist, filterWatchlist, getUserShowData } from './ShowSearchService';
import { ShowWithAnalytics } from '@/app/models/show';
import { UserShowDataWithUserInfo } from '@/app/models/userShowData';
import { backdropBackground } from '@/app/utils/stylingConstants';

// Number of items per page - should match ShowSearchShows
const ITEMS_PER_PAGE = 20;

export default async function ShowSearch(props: ShowSearchProps) {

    const {searchType, userId, currentUserId, pageTitle} = props;
    const searchParams = await props.searchParams || {};
    
    const pathname = props.pathname || '/';
    
    const filters = await parseFiltersFromSearchParams(searchParams);
    const currentUserFilters = parseCurrentUserFilters(searchParams);
    const watchlistOwnerFilters = parseWatchlistOwnerFilters(searchParams);
    const searchResults = searchParams.search || '';

    const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
    const createPageUrl = (pageNum: number) => {
        const params = new URLSearchParams();
        Object.entries(searchParams).forEach(([key, value]) => {
            if (key !== 'page' && value) {
                params.set(key, value);
            }
        });
        params.set('page', pageNum.toString());
        return `${pathname}?${params.toString()}`;
    };
    
    // Pre-generate URLs for the client component
    const previousPageUrl = createPageUrl(currentPage - 1);
    const nextPageUrl = createPageUrl(currentPage + 1);

    return (
        <div className='fixed top-14 left-0 right-0 bottom-0 flex flex-col overflow-hidden'>
            {/* Header with Pagination - Fixed height, no scroll */}
            <div className={`flex-shrink-0 ${backdropBackground}`}>
                <Suspense fallback={
                    <ShowSearchHeaderLoading 
                        filters={filters}
                        searchResults={searchResults}
                        currentUserFilters={currentUserFilters}
                        watchlistOwnerFilters={watchlistOwnerFilters}
                        pathname={pathname}
                        searchType={searchType}
                        userId={userId}
                        currentUserId={currentUserId}
                        pageTitle={pageTitle}
                    />
                }>
                    <ShowSearchHeaderWithResults 
                        filters={filters}
                        searchResults={searchResults}
                        currentUserFilters={currentUserFilters}
                        watchlistOwnerFilters={watchlistOwnerFilters}
                        pathname={pathname}
                        searchType={searchType}
                        userId={userId}
                        currentUserId={currentUserId}
                        pageTitle={pageTitle}
                    />
                </Suspense>
                
                {/* Pagination Controls with Results Count in Header */}
                <div className="px-4 pb-2">
                    <div className="pt-1 border-t border-border/20">
                        <Suspense fallback={<div className="flex justify-between items-center py-2">
                            <div className="animate-pulse bg-muted rounded h-4 w-24"></div>
                            <div className="animate-pulse bg-muted rounded h-6 w-20"></div>
                        </div>}>
                            <ShowSearchPaginationWrapper 
                                filters={filters}
                                searchType={searchType}
                                userId={userId}
                                currentUserId={currentUserId}
                                searchResults={searchResults}
                                currentUserFilters={currentUserFilters}
                                watchlistOwnerFilters={watchlistOwnerFilters}
                                currentPage={currentPage}
                                previousPageUrl={previousPageUrl}
                                nextPageUrl={nextPageUrl}
                            />
                        </Suspense>
                    </div>
                </div>
            </div>

            {/* Main Content - Flexible height, scrollable */}
            <div className='flex-1 overflow-y-auto overflow-x-hidden min-h-0'>
                <Suspense fallback={<ShowSearchShowsLoading />}>
                    <ShowSearchShows 
                        filters={filters}
                        searchType={searchType}
                        userId={userId}
                        currentUserId={currentUserId}
                        searchResults={searchResults}
                        currentUserFilters={currentUserFilters}
                        watchlistOwnerFilters={watchlistOwnerFilters}
                        currentPage={currentPage}
                        previousPageUrl={previousPageUrl}
                        nextPageUrl={nextPageUrl}
                    />
                </Suspense>
            </div>
        </div>       
    );
}

// Component that calculates and displays results count in header
async function ShowSearchHeaderWithResults({ 
    filters,
    searchResults,
    currentUserFilters,
    watchlistOwnerFilters,
    pathname,
    searchType,
    userId,
    currentUserId,
    pageTitle
}: {
    filters: any;
    searchResults: string;
    currentUserFilters: any;
    watchlistOwnerFilters?: any;
    pathname: string;
    searchType?: ShowSearchType;
    userId?: string;
    currentUserId?: string;
    pageTitle?: string;
}) {
    // Calculate results count using the same logic as ShowSearchShows
    const resultsCount = await calculateResultsCount({
        filters,
        searchType: searchType || ShowSearchType.UNRESTRICTED,
        userId,
        currentUserId,
        searchResults,
        currentUserFilters,
        watchlistOwnerFilters,
    });

    return (
        <ShowSearchHeader 
            filters={filters}
            searchResults={searchResults}
            currentUserFilters={currentUserFilters}
            watchlistOwnerFilters={watchlistOwnerFilters}
            pathname={pathname}
            searchType={searchType}
            userId={userId}
            currentUserId={currentUserId}
            pageTitle={pageTitle}
        />
    );
}

// Function to calculate total results count
async function calculateResultsCount({
    filters,
    searchType,
    userId,
    currentUserId,
    searchResults,
    currentUserFilters,
    watchlistOwnerFilters = defaultCurrentUserFilters,
}: {
    filters: any;
    searchType: ShowSearchType;
    userId?: string;
    currentUserId?: string;
    searchResults: string;
    currentUserFilters: any;
    watchlistOwnerFilters?: any;
}): Promise<number> {
    try {
        // Fetch shows based on filters (same logic as ShowSearchShows)
        let shows: ShowWithAnalytics[] | undefined = undefined;
        let displayUserInfo: UserShowDataWithUserInfo[] | undefined | null = undefined;
        let currentUserInfo: UserShowDataWithUserInfo[] | undefined | null = undefined;

        const isViewingOtherUserWatchlist = searchType === ShowSearchType.OTHER_USER_WATCHLIST && 
                                          currentUserId && userId && currentUserId !== userId;

        if (searchType === ShowSearchType.WATCHLIST && currentUserId) {
            const userData = await fetchUsersWatchlist(currentUserId);
            const filteredUserData = await filterWatchlist(userData, filters);
            shows = filteredUserData?.map((userShowData) => userShowData.show) as ShowWithAnalytics[];
            displayUserInfo = filteredUserData?.map((userShowData) => userShowData.userShowData);
        } else if (searchType === ShowSearchType.OTHER_USER_WATCHLIST && userId) {
            const profileUserData = await fetchUsersWatchlist(userId);
            const filteredProfileUserData = await filterWatchlist(profileUserData, filters);
            shows = filteredProfileUserData?.map((userShowData) => userShowData.show) as ShowWithAnalytics[];
            displayUserInfo = filteredProfileUserData?.map((userShowData) => userShowData.userShowData);
            
            if (currentUserId && shows) {
                const showIds = shows.map((show) => String(show.id));
                currentUserInfo = await getUserShowData({showIds, userId: currentUserId});
            }
        } else {
            shows = await fetchShows(filters, searchType, userId, currentUserId) as ShowWithAnalytics[] || undefined;
            if (currentUserId && shows) {
                const showIds = shows.map((show) => String(show.id));
                displayUserInfo = await getUserShowData({showIds, userId: currentUserId});
            }
        }

        // Apply the same filtering logic as ShowSearchShows
        let filteredShows = shows;
        
        if (searchResults.length > 0 || 
            JSON.stringify(currentUserFilters) !== JSON.stringify(defaultCurrentUserFilters) ||
            (isViewingOtherUserWatchlist && JSON.stringify(watchlistOwnerFilters) !== JSON.stringify(defaultCurrentUserFilters))) {
            if (shows) {
                filteredShows = [...shows];
                
                // Apply search filter
                if (searchResults.length > 0) {
                    filteredShows = filteredShows.filter((show) => 
                        show.name.toLowerCase().includes(searchResults.toLowerCase()));
                }
                
                // Apply user filters (simplified version - would need full implementation)
                // For now, just applying search filter for basic functionality
            }
        }

        return (filteredShows || []).length;
    } catch (error) {
        console.error('Error calculating results count:', error);
        return 0; // Return 0 as fallback
    }
}

// Separate component to handle pagination data fetching
async function ShowSearchPaginationWrapper({ 
    filters, 
    searchType, 
    userId, 
    currentUserId, 
    searchResults, 
    currentUserFilters,
    watchlistOwnerFilters,
    currentPage,
    previousPageUrl,
    nextPageUrl
}: {
    filters: any;
    searchType: ShowSearchType;
    userId?: string;
    currentUserId?: string;
    searchResults: string;
    currentUserFilters: any;
    watchlistOwnerFilters?: any;
    currentPage: number;
    previousPageUrl?: string;
    nextPageUrl?: string;
}) {
    // Calculate results count and total pages
    const resultsCount = await calculateResultsCount({
        filters,
        searchType,
        userId,
        currentUserId,
        searchResults,
        currentUserFilters,
        watchlistOwnerFilters,
    });
    
    const totalPages = Math.ceil(resultsCount / ITEMS_PER_PAGE);
    
    return (
        <PaginationControls 
            currentPage={currentPage} 
            previousPageUrl={previousPageUrl}
            nextPageUrl={nextPageUrl}
            totalPages={totalPages}
            resultsCount={resultsCount}
        />
    );
}

export async function LoadingShowSearch({ pageTitle }: { pageTitle?: string } = {}) {
    const searchParams = {};
    
    const pathname = '/';

    
    const filters = await parseFiltersFromSearchParams(searchParams);
    return (
        <div className='fixed top-14 left-0 right-0 bottom-0 flex flex-col overflow-hidden'>
            <div className={`flex-shrink-0 ${backdropBackground}`}>
                <ShowSearchHeaderLoading 
                    filters={filters}
                    searchResults={''}
                    currentUserFilters={defaultCurrentUserFilters}
                    watchlistOwnerFilters={defaultCurrentUserFilters}
                    pathname={pathname}
                    pageTitle={pageTitle}
                />
                
                {/* Pagination Loading Skeleton */}
                <div className="px-4 pb-2">
                    <div className="pt-1 border-t border-border/20">
                        <div className="flex justify-between items-center py-2">
                            <div className="animate-pulse bg-muted rounded h-4 w-24"></div>
                            <div className="animate-pulse bg-muted rounded h-6 w-20"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex-1 overflow-y-auto overflow-x-hidden min-h-0'>
                <ShowSearchShowsLoading />
            </div>
        </div>      
    );
}