import { Show } from '@/app/models/show';
import { Skeleton } from '@/components/ui/skeleton';
import Divider from '../Divider';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { UserShowDataWithUserInfo } from '@/app/models/userShowData';
import ShowRow from '../show/ShowRow/ShowRow';
import { ShowSearchFiltersType } from './ShowSearchHeader/ShowSearchHeader';
import { ShowSearchType } from '@/app/models/showSearchType';
import { CurrentUserFilters, defaultCurrentUserFilters } from './ShowSearchHeader/ShowSearchCurrentUserFilters';
import { fetchShows, fetchUsersWatchlist, filterWatchlist, getUserShowData } from './ShowSearchService';
import ShowRowSkeleton from '../show/ShowRow/ShowRowSkeleton';
import { Suspense } from 'react';
import PaginationControls from './PaginationControls';

// Number of items per page
const ITEMS_PER_PAGE = 20;

type ShowSearchShowsProps = {
    filters: ShowSearchFiltersType;
    searchType: ShowSearchType;
    userId?: string;
    currentUserId?: string;
    searchResults: string;
    currentUserFilters: CurrentUserFilters;
    currentPage: number;
    setTotalPages?: (totalPages: number) => void;
    previousPageUrl?: string;
    nextPageUrl?: string;
};

export default async function ShowSearchShows({ 
    filters, 
    searchType, 
    userId, 
    currentUserId, 
    searchResults, 
    currentUserFilters,
    currentPage,
    setTotalPages,
    previousPageUrl,
    nextPageUrl
}: ShowSearchShowsProps) {
    // Fetch shows based on filters
    let shows: Show[] | undefined = undefined;
    // If the search type is WATCHLIST, fetch the user's watchlist
    // and set the current user info
    // If the search type is OTHER_USER_WATCHLIST, fetch the other user's watchlist
    let currentUserInfo: UserShowDataWithUserInfo[] | undefined | null = undefined;
    const currenUserInfoMap: Map<number, UserShowDataWithUserInfo> = new Map();
    if (searchType === ShowSearchType.WATCHLIST && currentUserId) {
        const userData = await fetchUsersWatchlist(currentUserId);
        const filteredUserData = filterWatchlist(userData, filters);
        shows = filteredUserData?.map((userShowData) => userShowData.show);
        currentUserInfo = filteredUserData?.map((userShowData) => userShowData.userShowData);
        currentUserInfo?.forEach((info) => {
            currenUserInfoMap.set(Number(info.showId), info);
        });
    } else {
        const shows = await fetchShows(filters, searchType, userId, currentUserId);
        if (currentUserId && shows) {
            const showIds = shows.map((show) => String(show.id));
            currentUserInfo = await getUserShowData({showIds, userId: currentUserId});
            currentUserInfo?.forEach((info) => {
                currenUserInfoMap.set(Number(info.showId), info);
            });
        }
    }
    
    // Filter shows based on search and user filters if necessary
    let filteredShows = shows;
    
    if (searchResults.length > 0 || JSON.stringify(currentUserFilters) !== JSON.stringify(defaultCurrentUserFilters)) {
        if (shows) {
            filteredShows = [...shows];
            
            // Apply watchlist filter
            if (currentUserInfo && currentUserFilters.addedToWatchlist !== undefined) {
                filteredShows = filteredShows.filter((show) => {
                    const inUserInfo = currentUserInfo?.some((info) => Number(info.showId) === show.id);
                    return currentUserFilters.addedToWatchlist === inUserInfo;
                });
            }
            
            // Apply ratings filter
            if (currentUserInfo && currentUserFilters.ratings && currentUserFilters.ratings.length > 0) {
                filteredShows = filteredShows.filter((show) => {
                    const userInfo = currentUserInfo?.find((info) => Number(info.showId) === show.id);
                    return userInfo && currentUserFilters.ratings.includes(userInfo.rating);
                });
            }
            
            // Apply search filter
            if (searchResults.length > 0) {
                filteredShows = filteredShows.filter((show) => 
                    show.name.toLowerCase().includes(searchResults.toLowerCase()));
            }
            
            // Sort by name
            filteredShows = filteredShows.sort((a, b) => a.name.localeCompare(b.name));
        }
    }
    
    // Calculate total shows and pages
    const totalShowsCount = (filteredShows || []).length;
    const totalPages = Math.ceil(totalShowsCount / ITEMS_PER_PAGE);
    
    // Get the shows for the current page
    const paginatedData = filteredShows ? 
        filteredShows.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE) 
        : [];

    if (shows === null) {
        return (
            <h4>Error Loading Shows</h4>
        );
    }

    if (shows === undefined) {
        return (
            <Skeleton className='h-12 w-full' />
        );
    }

    return (
        <div className='px-2'>
            <div>
                <span className='flex my-auto space-x-2'>
                    <h3 className='text-2xl font-bold'>Results:</h3>
                    <h5 className='my-auto'>{totalShowsCount} shows</h5>
                </span>
            </div>
            <ScrollArea className='rounded-md border-2 h-96 overflow-auto'>
                <div className='py-2'>
                    {paginatedData.map((show: Show) => (
                        <div className='px-4' key={show.id}>
                            <Suspense fallback={<ShowRowSkeleton />}>
                                <ShowRow show={show} currentUserInfo={currenUserInfoMap.get(show.id)}/>
                            </Suspense>
                            <Divider />
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <PaginationControls 
                currentPage={currentPage} 
                previousPageUrl={previousPageUrl}
                nextPageUrl={nextPageUrl}
                totalPages={totalPages}
            />
        </div>
    );
}