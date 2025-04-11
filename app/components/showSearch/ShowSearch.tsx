'use server';
import { AirDate } from '@/app/models/airDate';
import { Rating } from '@/app/models/rating';
import { Show } from '@/app/models/show';
import { ShowLength } from '@/app/models/showLength';
import { ShowSearchType } from '@/app/models/showSearchType';
import { Suspense } from 'react';
import { CurrentUserFilters, defaultCurrentUserFilters } from './ShowSearchHeader/ShowSearchCurrentUserFilters';
import ShowSearchHeader, { ShowSearchFiltersType, defaultFilters } from './ShowSearchHeader/ShowSearchHeader';
import { getServices } from './ShowSearchService';
import ShowSearchShows from './ShowSearchShows';
import ShowSearchShowsLoading from './ShowSearchShowsLoading';

export type ShowSearchData = {
    shows: Show[]| undefined | null;
    filters: ShowSearchFiltersType;
    showCurrentUserInfo: boolean;
}

type ShowSearchProps = {
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

// Number of items per page
const ITEMS_PER_PAGE = 20;

async function parseFiltersFromSearchParams(searchParams: ShowSearchProps['searchParams'] = {}): Promise<ShowSearchFiltersType> {
    const { service, length, airDate, limitedSeries, running, currentlyAiring } = searchParams || {};
    const filters: ShowSearchFiltersType = {
        ...defaultFilters
    };

    // Parse services
    if (service) {
        const serviceIds = service.split(',').filter(Boolean); // Remove any empty strings
        if (serviceIds.length > 0) {
            const services = await getServices();
            if (services) {
                filters.service = services.filter(s => serviceIds.includes(s.id.toString()));
            }
        }
    }

    // Parse lengths
    if (length) {
        const lengths = length.split(',').filter(Boolean);
        if (lengths.length > 0) {
            filters.length = lengths.filter(l => Object.values(ShowLength).includes(l as ShowLength)) as ShowLength[];
        }
    }

    // Parse airDates
    if (airDate) {
        const airDates = airDate.split(',').filter(Boolean);
        if (airDates.length > 0) {
            filters.airDate = airDates.filter(a => Object.values(AirDate).includes(a as AirDate)) as AirDate[];
        }
    }

    // Parse boolean fields - handle "true"/"false" strings specifically
    if (limitedSeries === 'true') {
        filters.limitedSeries = true;
    } else if (limitedSeries === 'false') {
        filters.limitedSeries = false;
    }
    
    if (running === 'true') {
        filters.running = true;
    } else if (running === 'false') {
        filters.running = false;
    }
    
    if (currentlyAiring === 'true') {
        filters.currentlyAiring = true;
    } else if (currentlyAiring === 'false') {
        filters.currentlyAiring = false;
    }

    return filters;
}

function parseCurrentUserFilters(searchParams: ShowSearchProps['searchParams'] = {}): CurrentUserFilters {
    const { addedToWatchlist, ratings } = searchParams || {};
    const filters: CurrentUserFilters = {
        ...defaultCurrentUserFilters
    };

    // Parse addedToWatchlist
    if (addedToWatchlist) {
        filters.addedToWatchlist = addedToWatchlist === 'true';
    }

    // Parse ratings
    if (ratings) {
        const ratingStrings = ratings.split(',');
        const validRatings: Rating[] = [];
        
        for (const ratingStr of ratingStrings) {
            // Check if the string value matches any enum value
            const matchingRating = Object.values(Rating).find(r => r === ratingStr);
            if (matchingRating) {
                validRatings.push(matchingRating);
            }
        }
        
        filters.ratings = validRatings;
    }

    return filters;
}

function parseWatchlistOwnerFilters(searchParams: ShowSearchProps['searchParams'] = {}): CurrentUserFilters {
    const { ownerWatchlist, ownerRatings, ownerStatuses } = searchParams || {};
    const filters: CurrentUserFilters = {
        ...defaultCurrentUserFilters
    };

    // Parse owner's watchlist filter
    if (ownerWatchlist) {
        filters.addedToWatchlist = ownerWatchlist === 'true';
    }

    // Parse owner's ratings
    if (ownerRatings) {
        const ratingStrings = ownerRatings.split(',');
        const validRatings: Rating[] = [];
        
        for (const ratingStr of ratingStrings) {
            // Check if the string value matches any enum value
            const matchingRating = Object.values(Rating).find(r => r === ratingStr);
            if (matchingRating) {
                validRatings.push(matchingRating);
            }
        }
        
        filters.ratings = validRatings;
    }

    // Parse owner's statuses if needed
    if (ownerStatuses) {
        // Implement status parsing logic similar to ratings if needed
    }

    return filters;
}

export default async function ShowSearch(props: ShowSearchProps) {
    
    const {searchType, userId, currentUserId} = props;
    const searchParams = await props.searchParams || {};
    
    // Use a default pathname if not provided
    const pathname = props.pathname || '/';
    
    // Parse filters from URL parameters
    const filters = await parseFiltersFromSearchParams(searchParams);
    const currentUserFilters = parseCurrentUserFilters(searchParams);
    const watchlistOwnerFilters = parseWatchlistOwnerFilters(searchParams);
    const searchResults = searchParams.search || '';
    
    // Get current page from URL or default to 1
    const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
    
    // Generate URLs for pagination
    const createPageUrl = (pageNum: number) => {
        // Create a URLSearchParams object from the current search params
        const params = new URLSearchParams();
        
        // Add all current params except 'page'
        Object.entries(searchParams).forEach(([key, value]) => {
            if (key !== 'page' && value) {
                params.set(key, value);
            }
        });
        
        // Add the page parameter
        params.set('page', pageNum.toString());
        
        // Return the pathname with the query string
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