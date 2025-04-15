'use server';
import { Show } from '@/app/models/show';
import { ShowSearchType } from '@/app/models/showSearchType';
import { Suspense } from 'react';
import { parseCurrentUserFilters, parseFiltersFromSearchParams, parseWatchlistOwnerFilters } from './ShowSearchFilterParsing';
import ShowSearchHeader, { ShowSearchFiltersType } from './ShowSearchHeader/ShowSearchHeader';
import ShowSearchShows from './ShowSearchShows';
import ShowSearchShowsLoading from './ShowSearchShowsLoading';

export type ShowSearchData = {
    shows: Show[]| undefined | null;
    filters: ShowSearchFiltersType;
    showCurrentUserInfo: boolean;
}

export type ShowSearchProps = {
    searchType: ShowSearchType;
    userId?: string;
    currentUserId?: string;
    searchParams?: {
        page?: string;
        search?: string;
        service?: string;
        length?: string;
        airDate?: string;
        limitedSeries?: string;
        running?: string;
        currentlyAiring?: string;
        addedToWatchlist?: string;
        ratings?: string;
        ownerWatchlist?: string;
        ownerRatings?: string;
        ownerStatuses?: string;
    };
    pathname?: string;
}

export default async function ShowSearch(props: ShowSearchProps) {
    
    const {searchType, userId, currentUserId} = props;
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
        <div className='w-full overflow-x-hidden'>
            <ShowSearchHeader 
                filters={filters}
                searchResults={searchResults}
                currentUserFilters={currentUserFilters}
                watchlistOwnerFilters={watchlistOwnerFilters}
                pathname={pathname}
                searchType={searchType}
                userId={userId}
                currentUserId={currentUserId}
            />
            <div className='w-full overflow-x-hidden'>
                
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