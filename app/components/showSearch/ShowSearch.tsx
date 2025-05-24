'use server';
import { Suspense } from 'react';
import { parseCurrentUserFilters, parseFiltersFromSearchParams, parseWatchlistOwnerFilters } from './ShowSearchFilterParsing';
import { defaultCurrentUserFilters } from './ShowSearchHeader/ShowSearchCurrentUserFilters';
import ShowSearchHeader from './ShowSearchHeader/ShowSearchHeader';
import ShowSearchHeaderLoading from './ShowSearchHeader/ShowSearchHeaderLoading';
import ShowSearchShows from './ShowSearchShows';
import ShowSearchShowsLoading from './ShowSearchShowsLoading';
import { ShowSearchProps } from './types';



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
        <div className='w-full flex flex-col h-[calc(100vh)] overflow-hidden'>
            <div className="flex-shrink-0">
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
            </div>
            <div className='w-full flex flex-col flex-grow min-h-0 overflow-hidden'>
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

export async function LoadingShowSearch() {
    const searchParams = {};
    
    const pathname = '/';

    
    const filters = await parseFiltersFromSearchParams(searchParams);
    return (
        <div className='w-full overflow-x-hidden'>
            <ShowSearchHeaderLoading 
                filters={filters}
                searchResults={''}
                currentUserFilters={defaultCurrentUserFilters}
                watchlistOwnerFilters={defaultCurrentUserFilters}
                pathname={pathname}
            />
            <div className='w-full overflow-x-hidden'>
                <ShowSearchShowsLoading />
            </div>
        </div>      
    );
}