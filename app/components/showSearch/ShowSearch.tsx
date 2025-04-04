'use server';
import { Show } from '@/app/models/show';
import ShowSearchHeader, { ShowSearchFiltersType, defaultFilters } from './ShowSearchHeader/ShowSearchHeader';
import ShowSearchShows from './ShowSearchShows';
import { fetchShows, getUserShowData, getServices } from './ShowSearchService';
import { UserShowDataWithUserInfo } from '@/app/models/userShowData';
import { ShowSearchType } from '@/app/models/showSearchType';
import { CurrentUserFilters, defaultCurrentUserFilters } from './ShowSearchHeader/ShowSearchCurrentUserFilters';
import { Rating } from '@/app/models/rating';
import { AirDate } from '@/app/models/airDate';
import { Service } from '@/app/models/service';
import { ShowLength } from '@/app/models/showLength';
import Link from 'next/link';
import { Suspense } from 'react';
import PaginationControls from './PaginationControls';
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

export default async function ShowSearch(props: ShowSearchProps) {
    
    const {searchType, userId, currentUserId} = props;
    const searchParams = await props.searchParams || {};
    
    // Use a default pathname if not provided
    const pathname = props.pathname || '/';
    
    // Parse filters from URL parameters
    const filters = await parseFiltersFromSearchParams(searchParams);
    const currentUserFilters = parseCurrentUserFilters(searchParams);
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
                pathname={pathname}
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
                        currentPage={currentPage}
                        previousPageUrl={previousPageUrl}
                        nextPageUrl={nextPageUrl}
                    />
                </Suspense>
            </div>
        </div>       
    );
}