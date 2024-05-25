'use client'
import { Show } from '@/app/models/show';
import ShowSearchHeader, { ShowSearchFilters, defaultFilters } from './ShowSearchHeader/ShowSearchHeader';
import { useEffect, useState } from 'react';
import ShowSearchShows from './ShowSearchShows';
import { fetchShows, getUserShowData } from './ShowSearchService';
import { UserShowData, UserShowDataWithUserInfo } from '@/app/models/userShowData';
import { createClient } from '@/utils/supabase/client';
import { ShowSearchType } from '@/app/models/showSearchType';
import { CurrentUserFilters, defaultCurrentUserFilters } from './ShowSearchHeader/ShowSearchCurrentUserFilters';
import { set } from 'date-fns';
import { Rating } from '@/app/models/rating';

export type ShowSearchData = { // Not used yet
    shows: Show[]| undefined | null;
    filters: ShowSearchFilters;
    setFilters: Function;
    showCurrentUserInfo: boolean;
    setShowCurrentUserInfo: Function;
}

type ShowSearchProps = {
    searchType: ShowSearchType;
    userId?: string;
}

export default function ShowSearch(props: ShowSearchProps) {
    const {searchType, userId} = props;
    const [filters, setFilters] = useState<ShowSearchFilters>(defaultFilters);
    const [shows, setShows] = useState<Show[]| undefined | null>(undefined);
    const showMap = new Map(shows?.map(obj => [obj.id, obj]) ?? []);
    const [showingCurrentUserInfo, setShowCurrentUserInfo] = useState<boolean>(false);
    const [currentUserInfo, setCurrentUserInfo] = useState<UserShowDataWithUserInfo[]| undefined | null>(undefined);
    const currnetUserInfoMap = new Map(currentUserInfo?.map(obj => [Number(obj.showId), obj]) ?? []);
    const [resultsSearch, setResultsSearch] = useState<string | undefined>(undefined);
    const [filteredShows, setFilteredShows] = useState<Show[]| undefined | null>(undefined);
    const [currentUserFilters, setCurrentUserFilters] = useState<CurrentUserFilters>(defaultCurrentUserFilters);

    useEffect(() => {
        fetchShows(filters, searchType).then((shows) => setShows(shows));
    }, [filters]);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user }, } = await createClient().auth.getUser();
            const currentUserId = user?.id;
            if (!currentUserId) return;
            const showIds = shows?.map((show) => String(show.id));
            if (!showIds) return;
            getUserShowData({showIds: showIds, userId: currentUserId}).then((showData) => {
                if (showData) setCurrentUserInfo(showData);
            });
        };

        if (showingCurrentUserInfo) {
            if (!shows) return;
            fetchUserData();
        }
    }, [shows, showingCurrentUserInfo]);

    const inUserInfo = (showId: string) => {
        if (!currentUserInfo) return false;
        return currnetUserInfoMap.get(Number(showId)) ? true : false;
    }

    const currentUserRating = (showId: string): Rating|undefined => {
        if (!currentUserInfo) return undefined;
        return currnetUserInfoMap.get(Number(showId))?.rating
    }

    const ratingInFilters = (rating: Rating|undefined) => {
        if (!rating) return false;
        return currentUserFilters.ratings.includes(rating);
    }

    useEffect(() => {
        if ((!!!resultsSearch || resultsSearch?.length === 0) && JSON.stringify(currentUserFilters) === JSON.stringify(defaultCurrentUserFilters)) {
            setFilteredShows(undefined);
            return;
        }
        let filt: Show[] = shows ? [...shows] : [];
        if (resultsSearch && resultsSearch?.length > 0) {
            filt = filt?.filter((show) => show.name.toLowerCase().includes(resultsSearch.toLowerCase()));
        }
        if (currentUserInfo) {
            if (currentUserFilters.addedToWatchlist !== undefined) {
                filt = filt.filter((show) => currentUserFilters.addedToWatchlist === inUserInfo(String(show.id)));
            }
            if (currentUserFilters.ratings.length > 0) {
                filt = filt.filter((s) => ratingInFilters(currentUserRating(String(s.id))));
            }
        }
        filt = filt.sort((a, b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
        setFilteredShows(filt);
    }, [resultsSearch, shows, currentUserInfo, currentUserFilters]);

    const results = filteredShows ? filteredShows : shows;
    const currentUserInfoDetails = showingCurrentUserInfo ? currentUserInfo : undefined;

    return (
        <div className='w-full'>
            <ShowSearchHeader 
                filters={filters} setFilters={setFilters} 
                showingCurrentUserInfo={showingCurrentUserInfo} setShowCurrentUserInfo={setShowCurrentUserInfo}
                searchResults={resultsSearch} setSearchResults={setResultsSearch}
                currentUserFilters={currentUserFilters} setCurrentUserFilters={setCurrentUserFilters}
            />
            <div className=''>
                <ShowSearchShows shows={results} currentUserInfo={currentUserInfoDetails}/>
            </div>
        </div>       
    );

};