import { Rating, RatingPoints } from '@/app/models/rating';
import { ShowWithAnalytics } from '@/app/models/show';
import { ShowSearchType } from '@/app/models/showSearchType';
import { UserShowDataWithUserInfo } from '@/app/models/userShowData';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Suspense } from 'react';
import Divider from '../Divider';
import ShowRow from '../show/ShowRow/ShowRow';
import ShowRowSkeleton from '../show/ShowRow/ShowRowSkeleton';
import PaginationControls from './PaginationControls';
import { CurrentUserFilters, defaultCurrentUserFilters } from './ShowSearchHeader/ShowSearchCurrentUserFilters';
import { ShowSearchFiltersType } from './ShowSearchHeader/ShowSearchHeader';
import { fetchShows, fetchUsersWatchlist, filterWatchlist, getUserShowData } from './ShowSearchService';

// Number of items per page
const ITEMS_PER_PAGE = 20;

type ShowSearchShowsProps = {
    filters: ShowSearchFiltersType;
    searchType: ShowSearchType;
    userId?: string;
    currentUserId?: string;
    searchResults: string;
    currentUserFilters: CurrentUserFilters;
    watchlistOwnerFilters?: CurrentUserFilters;
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
    watchlistOwnerFilters = defaultCurrentUserFilters,
    currentPage,
    setTotalPages,
    previousPageUrl,
    nextPageUrl
}: ShowSearchShowsProps) {
    // Fetch shows based on filters
    let shows: ShowWithAnalytics[] | undefined = undefined;
    let displayUserInfo: UserShowDataWithUserInfo[] | undefined | null = undefined;
    let currentUserInfo: UserShowDataWithUserInfo[] | undefined | null = undefined;
    const displayUserInfoMap: Map<number, UserShowDataWithUserInfo> = new Map();
    const otherUsersInfoMap: Map<number, UserShowDataWithUserInfo[]> = new Map();

    const isViewingOtherUserWatchlist = searchType === ShowSearchType.OTHER_USER_WATCHLIST && 
                                      currentUserId && userId && currentUserId !== userId;

    if (searchType === ShowSearchType.WATCHLIST && currentUserId) {
        // User is viewing their own watchlist
        const userData = await fetchUsersWatchlist(currentUserId);
        const filteredUserData = await filterWatchlist(userData, filters);
        shows = filteredUserData?.map((userShowData) => userShowData.show) as ShowWithAnalytics[];
        displayUserInfo = filteredUserData?.map((userShowData) => userShowData.userShowData);
        displayUserInfo?.forEach((info) => {
            displayUserInfoMap.set(Number(info.showId), info);
        });
    } else if (searchType === ShowSearchType.OTHER_USER_WATCHLIST && userId) {
        // User is viewing another user's watchlist
        
        // 1. Fetch and process profile user's watchlist
        const profileUserData = await fetchUsersWatchlist(userId);
        const filteredProfileUserData = await filterWatchlist(profileUserData, filters);
        shows = filteredProfileUserData?.map((userShowData) => userShowData.show) as ShowWithAnalytics[];
        displayUserInfo = filteredProfileUserData?.map((userShowData) => userShowData.userShowData);
        displayUserInfo?.forEach((info) => {
            displayUserInfoMap.set(Number(info.showId), info);
        });
        
        // 2. If we have a current user, fetch their data for these shows too and place in otherUsersInfo
        if (currentUserId && shows) {
            const showIds = shows.map((show) => String(show.id));
            currentUserInfo = await getUserShowData({showIds, userId: currentUserId});
            currentUserInfo?.forEach((info) => {
                // Store current user's info in otherUsersInfoMap
                otherUsersInfoMap.set(Number(info.showId), [info]);
            });
        }
    } else {
        // Any other search type
        shows = await fetchShows(filters, searchType, userId, currentUserId) as ShowWithAnalytics[] || undefined;
        if (currentUserId && shows) {
            const showIds = shows.map((show) => String(show.id));
            displayUserInfo = await getUserShowData({showIds, userId: currentUserId});
            displayUserInfo?.forEach((info) => {
                displayUserInfoMap.set(Number(info.showId), info);
            });
        }
    }
    
    // Filter shows based on search and user filters if necessary
    let filteredShows = shows;
    
    if (searchResults.length > 0 || 
        JSON.stringify(currentUserFilters) !== JSON.stringify(defaultCurrentUserFilters) ||
        (isViewingOtherUserWatchlist && JSON.stringify(watchlistOwnerFilters) !== JSON.stringify(defaultCurrentUserFilters))) {
        if (shows) {
            filteredShows = [...shows];
            
            // Apply current user's watchlist filter
            if (currentUserFilters.addedToWatchlist !== undefined) {
                if (isViewingOtherUserWatchlist) {
                    // For other user's watchlist, filter based on current user's watchlist status
                    filteredShows = filteredShows.filter((show) => {
                        const inCurrentUserInfo = currentUserInfo?.some((info) => Number(info.showId) === show.id);
                        return currentUserFilters.addedToWatchlist === inCurrentUserInfo;
                    });
                } else {
                    // For own watchlist or other search types, filter based on display user info
                    filteredShows = filteredShows.filter((show) => {
                        const inUserInfo = displayUserInfo?.some((info) => Number(info.showId) === show.id);
                        return currentUserFilters.addedToWatchlist === inUserInfo;
                    });
                }
            }
            
            // Apply current user's ratings filter
            if (currentUserFilters.ratings && currentUserFilters.ratings.length > 0) {
                if (isViewingOtherUserWatchlist) {
                    // For other user's watchlist, filter based on current user's ratings
                    filteredShows = filteredShows.filter((show) => {
                        const userInfo = currentUserInfo?.find((info) => Number(info.showId) === show.id);
                        return userInfo && currentUserFilters.ratings.includes(userInfo.rating);
                    });
                } else {
                    // For own watchlist or other search types, filter based on display user info
                    filteredShows = filteredShows.filter((show) => {
                        const userInfo = displayUserInfo?.find((info) => Number(info.showId) === show.id);
                        return userInfo && currentUserFilters.ratings.includes(userInfo.rating);
                    });
                }
            }
            
            // Apply current user's statuses filter
            if (currentUserFilters.statuses && currentUserFilters.statuses.length > 0) {
                if (isViewingOtherUserWatchlist) {
                    // For other user's watchlist, filter based on current user's statuses
                    filteredShows = filteredShows.filter((show) => {
                        const userInfo = currentUserInfo?.find((info) => Number(info.showId) === show.id);
                        
                        if (!userInfo || !userInfo.status) return false;
                        
                        // Handle status that might be just an ID (number) or a full Status object
                        const statusId = typeof userInfo.status === 'number' 
                            ? userInfo.status 
                            : userInfo.status.id;
                            
                        // Compare by ID directly
                        return currentUserFilters.statuses.some(filterStatus => 
                            filterStatus.id === statusId
                        );
                    });
                } else {
                    // For own watchlist or other search types, filter based on display user info
                    filteredShows = filteredShows.filter((show) => {
                        const userInfo = displayUserInfo?.find((info) => Number(info.showId) === show.id);
                        
                        if (!userInfo || !userInfo.status) return false;
                        
                        // Handle status that might be just an ID (number) or a full Status object
                        const statusId = typeof userInfo.status === 'number' 
                            ? userInfo.status 
                            : userInfo.status.id;
                            
                        // Compare by ID directly
                        return currentUserFilters.statuses.some(filterStatus => 
                            filterStatus.id === statusId
                        );
                    });
                }
            }
            
            // Apply watchlist owner filters when viewing another user's watchlist
            if (isViewingOtherUserWatchlist) {
                // Filter by watchlist owner's ratings if specified
                if (watchlistOwnerFilters.ratings && watchlistOwnerFilters.ratings.length > 0) {
                    filteredShows = filteredShows.filter((show) => {
                        const ownerInfo = displayUserInfo?.find((info) => Number(info.showId) === show.id);
                        return ownerInfo && watchlistOwnerFilters.ratings.includes(ownerInfo.rating);
                    });
                }
                
                // Filter by watchlist owner's statuses if specified
                if (watchlistOwnerFilters.statuses && watchlistOwnerFilters.statuses.length > 0) {
                    filteredShows = filteredShows.filter((show) => {
                        const ownerInfo = displayUserInfo?.find((info) => Number(info.showId) === show.id);
                        
                        if (!ownerInfo || !ownerInfo.status) return false;
                        
                        // Handle status that might be just an ID (number) or a full Status object
                        const statusId = typeof ownerInfo.status === 'number' 
                            ? ownerInfo.status 
                            : ownerInfo.status.id;
                            
                        // Compare by ID directly
                        return watchlistOwnerFilters.statuses.some(filterStatus => 
                            filterStatus.id === statusId
                        );
                    });
                }
                
                // Filter by watchlist status if specified - this is unnecessary since these are all on their watchlist
                // but including for completeness
                if (watchlistOwnerFilters.addedToWatchlist !== undefined) {
                    filteredShows = filteredShows.filter((show) => {
                        const inOwnerWatchlist = displayUserInfo?.some((info) => Number(info.showId) === show.id);
                        return watchlistOwnerFilters.addedToWatchlist === inOwnerWatchlist;
                    });
                }
            }
            
            // Apply search filter
            if (searchResults.length > 0) {
                filteredShows = filteredShows.filter((show) => 
                    show.name.toLowerCase().includes(searchResults.toLowerCase()));
            }
            
            // Apply sorting
            if (filteredShows) {
                const sortField = filters.sortBy?.split('-')[0] || 'alphabetical';
                const sortDirection = filters.sortBy?.split('-')[1] || 'asc';
                
                if (sortField === "alphabetical") {
                    filteredShows = filteredShows.sort((a, b) => {
                        const comparison = a.name.localeCompare(b.name);
                        return sortDirection === 'asc' ? comparison : -comparison;
                    });
                } else if (sortField === "weekly_popularity") {
                    // Sort by weekly updates
                    filteredShows = filteredShows.sort((a, b) => {
                        const aPopularity = a.weekly_updates || 0;
                        const bPopularity = b.weekly_updates || 0;
                        
                        // If popularity is equal, fall back to alphabetical
                        if (aPopularity === bPopularity) return a.name.localeCompare(b.name);
                        
                        // By default, higher popularity first
                        return sortDirection === 'desc' ? bPopularity - aPopularity : aPopularity - bPopularity;
                    });
                } else if (sortField === "monthly_popularity") {
                    // Sort by monthly updates
                    filteredShows = filteredShows.sort((a, b) => {
                        const aPopularity = a.monthly_updates || 0;
                        const bPopularity = b.monthly_updates || 0;
                        
                        // If popularity is equal, fall back to alphabetical
                        if (aPopularity === bPopularity) return a.name.localeCompare(b.name);
                        
                        // By default, higher popularity first
                        return sortDirection === 'desc' ? bPopularity - aPopularity : aPopularity - bPopularity;
                    });
                } else if (sortField === "yearly_popularity") {
                    // Sort by yearly updates
                    filteredShows = filteredShows.sort((a, b) => {
                        const aPopularity = a.yearly_updates || 0;
                        const bPopularity = b.yearly_updates || 0;
                        
                        // If popularity is equal, fall back to alphabetical
                        if (aPopularity === bPopularity) return a.name.localeCompare(b.name);
                        
                        // By default, higher popularity first
                        return sortDirection === 'desc' ? bPopularity - aPopularity : aPopularity - bPopularity;
                    });
                } else if (sortField === "rating") {
                    // Sort by user rating (if available)
                    filteredShows = filteredShows.sort((a, b) => {
                        const aRating = displayUserInfoMap.get(a.id)?.rating;
                        const bRating = displayUserInfoMap.get(b.id)?.rating;
                        
                        // If ratings are equal or not available, fall back to alphabetical
                        if (!aRating && !bRating) return a.name.localeCompare(b.name);
                        if (!aRating) return 1; // Shows without ratings go to the end
                        if (!bRating) return -1; // Shows without ratings go to the end
                        
                        // Get numerical values from RatingPoints
                        const aValue = RatingPoints[aRating as Rating] || 0;
                        const bValue = RatingPoints[bRating as Rating] || 0;
                        
                        // Compare numerical values (default: higher values first)
                        const ratingComparison = bValue - aValue;
                        return sortDirection === 'desc' ? ratingComparison : -ratingComparison;
                    });
                }
            }
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
        <div className='px-2 flex flex-col h-full'>
            <div className="flex-shrink-0">
                <span className='flex my-auto space-x-2'>
                    <h3 className='text-2xl font-bold'>Results:</h3>
                    <h5 className='my-auto'>{totalShowsCount} shows</h5>
                </span>
            </div>
            <ScrollArea className='flex-grow min-h-0 rounded-md bg-white/20 overflow-y-auto'>
                <div className='py-2'>
                    {paginatedData.map((show: ShowWithAnalytics) => (
                        <div className='px-4' key={show.id}>
                            <Suspense fallback={<ShowRowSkeleton />}>
                                <ShowRow 
                                    show={show} 
                                    currentUserInfo={displayUserInfoMap.get(show.id)}
                                    otherUsersInfo={otherUsersInfoMap.get(show.id)}
                                    fetchCurrentUsersInfo={(searchType !== ShowSearchType.OTHER_USER_WATCHLIST)}
                                    fetchFriendsInfo={true} 
                                />
                            </Suspense>
                            <Divider />
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <div className="flex-shrink-0">
                <PaginationControls 
                    currentPage={currentPage} 
                    previousPageUrl={previousPageUrl}
                    nextPageUrl={nextPageUrl}
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
}