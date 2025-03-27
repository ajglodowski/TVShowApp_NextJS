'use client'
import { Show } from '@/app/models/show';
import ShowSearchHeader, { ShowSearchFiltersType, defaultFilters } from './ShowSearchHeader/ShowSearchHeader';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ShowSearchShows from './ShowSearchShows';
import { fetchShows, getUserShowData } from './ShowSearchService';
import { UserShowDataWithUserInfo } from '@/app/models/userShowData';
import { createClient } from '@/utils/supabase/client';
import { ShowSearchType } from '@/app/models/showSearchType';
import { CurrentUserFilters, defaultCurrentUserFilters } from './ShowSearchHeader/ShowSearchCurrentUserFilters';
import { Rating } from '@/app/models/rating';

export type ShowSearchData = {
    shows: Show[]| undefined | null;
    filters: ShowSearchFiltersType;
    setFilters: Function;
    showCurrentUserInfo: boolean;
    setShowCurrentUserInfo: Function;
}

type ShowSearchProps = {
    searchType: ShowSearchType;
    userId?: string;
}

// Number of items per page
const ITEMS_PER_PAGE = 20;

export default function ShowSearch(props: ShowSearchProps) {
    const {searchType, userId} = props;
    const [filters, setFilters] = useState<ShowSearchFiltersType>(defaultFilters);
    const [shows, setShows] = useState<Show[]| undefined | null>(undefined);
    const [showingCurrentUserInfo, setShowCurrentUserInfo] = useState<boolean>(true);
    const [currentUserInfo, setCurrentUserInfo] = useState<UserShowDataWithUserInfo[]| undefined | null>(undefined);
    const [resultsSearch, setResultsSearch] = useState<string>("");
    const [currentUserFilters, setCurrentUserFilters] = useState<CurrentUserFilters>(defaultCurrentUserFilters);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Memoize maps to prevent recreation on every render
    const showMap = useMemo(() => new Map(shows?.map(obj => [obj.id, obj]) ?? []), [shows]);
    const currentUserInfoMap = useMemo(() => 
        new Map(currentUserInfo?.map(obj => [Number(obj.showId), obj]) ?? []), 
        [currentUserInfo]
    );

    // Fetch shows with useCallback to avoid recreation
    const doFetch = useCallback(async () => {
        const fetchedShows = await fetchShows(filters, searchType);
        setShows(fetchedShows);
        setCurrentPage(1); // Reset to first page when fetching new data
    }, [filters, searchType]);

    // Initial fetch
    useEffect(() => {
        doFetch();
    }, [doFetch]);

    const inUserInfo = useCallback((showId: string) => {
        if (!currentUserInfo) return false;
        return currentUserInfoMap.has(Number(showId));
    }, [currentUserInfo, currentUserInfoMap]);

    const currentUserRating = useCallback((showId: string): Rating|undefined => {
        if (!currentUserInfo) return undefined;
        return currentUserInfoMap.get(Number(showId))?.rating;
    }, [currentUserInfo, currentUserInfoMap]);

    const ratingInFilters = useCallback((rating: Rating|undefined) => {
        if (!rating) return false;
        return currentUserFilters.ratings.includes(rating);
    }, [currentUserFilters.ratings]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!shows || shows.length === 0) return;
            
            const { data: { user } } = await createClient().auth.getUser();
            const currentUserId = user?.id;
            if (!currentUserId) return;
            
            const showIds = shows.map((show) => String(show.id));
            const showData = await getUserShowData({showIds, userId: currentUserId});
            if (showData) setCurrentUserInfo(showData);
        };

        fetchUserData();
    }, [shows]);

    // Filter shows based on search and user filters
    const filteredShows = useMemo(() => {
        if ((resultsSearch.length === 0) && 
            JSON.stringify(currentUserFilters) === JSON.stringify(defaultCurrentUserFilters)) {
            return undefined;
        }
        
        let filtered = shows ? [...shows] : [];
        
        if (currentUserInfo) {
            if (currentUserFilters.addedToWatchlist !== undefined) {
                filtered = filtered.filter((show) => 
                    currentUserFilters.addedToWatchlist === inUserInfo(String(show.id)));
            }
            
            if (currentUserFilters.ratings.length > 0) {
                filtered = filtered.filter((s) => 
                    ratingInFilters(currentUserRating(String(s.id))));
            }
        }
        
        if (resultsSearch.length > 0) {
            filtered = filtered.filter((show) => 
                show.name.toLowerCase().includes(resultsSearch.toLowerCase()));
        }
        
        return filtered.sort((a, b) => 
            a.name.localeCompare(b.name));
    }, [shows, resultsSearch, currentUserInfo, currentUserFilters, inUserInfo, currentUserRating, ratingInFilters]);

    // Calculate total shows
    const totalShows = useMemo(() => {
        return (filteredShows || shows || []).length;
    }, [filteredShows, shows]);

    // Get the shows for the current page
    const paginatedData = useMemo(() => {
        const allShows = filteredShows || shows || [];
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return allShows.slice(startIndex, endIndex);
    }, [filteredShows, shows, currentPage]);

    // Calculate total number of pages
    const totalPages = useMemo(() => {
        return Math.ceil(totalShows / ITEMS_PER_PAGE);
    }, [totalShows]);

    // Handle page change
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const currentUserInfoDetails = showingCurrentUserInfo ? currentUserInfo : undefined;

    return (
        <div className='w-full overflow-x-hidden'>
            <ShowSearchHeader 
                filters={filters} 
                setFilters={setFilters} 
                showingCurrentUserInfo={showingCurrentUserInfo} 
                setShowCurrentUserInfo={setShowCurrentUserInfo}
                searchResults={resultsSearch} 
                setSearchResults={setResultsSearch}
                currentUserFilters={currentUserFilters} 
                setCurrentUserFilters={setCurrentUserFilters}
            />
            <div className='w-full overflow-x-hidden'>
                
                <ShowSearchShows 
                    shows={paginatedData}
                    totalShowsCount={totalShows} 
                    currentUserInfo={currentUserInfoDetails}
                />
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6 mb-8">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 mr-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        
                        <div className="mx-4">
                            Page {currentPage} of {totalPages}
                        </div>
                        
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 ml-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>       
    );
}