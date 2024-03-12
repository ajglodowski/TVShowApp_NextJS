'use client'
import { Show } from '@/app/models/show';
import ShowSearchHeader, { ShowSearchFilters, defaultFilters } from './ShowSearchHeader/ShowSearchHeader';
import { useEffect, useState } from 'react';
import ShowSearchShows from './ShowSearchShows';
import { fetchShows, getUserShowData } from './ShowSearchService';
import { cookies } from 'next/headers';
import { UserShowData } from '@/app/models/userShowData';
import { createClient } from '@/utils/supabase/client';

export type ShowSearchData = { // Not used yet
    shows: Show[]| undefined | null;
    filters: ShowSearchFilters;
    setFilters: Function;
    showCurrentUserInfo: boolean;
    setShowCurrentUserInfo: Function;
}

export default function ShowSearch({userId}: {userId?: string}) {

    const [filters, setFilters] = useState<ShowSearchFilters>(defaultFilters);
    const [shows, setShows] = useState<Show[]| undefined | null>(undefined);
    const [showingCurrentUserInfo, setShowCurrentUserInfo] = useState<boolean>(false);
    const [currentUserInfo, setCurrentUserInfo] = useState<UserShowData[]| undefined | null>(undefined);

    useEffect(() => {
        fetchShows(filters).then((shows) => setShows(shows));
    }, [filters]);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user }, } = await createClient().auth.getUser();
            const currentUserId = user?.id;
            if (!currentUserId) return;
            const showIds = shows?.map((show) => String(show.id));
            if (!showIds) return;
            getUserShowData({showIds: showIds, userId: currentUserId}).then((showData) => {
                if (showData) { 
                    setCurrentUserInfo(showData);
                    console.log(showData);
                }
            });
        };

        if (showingCurrentUserInfo) {
            if (!shows) return;
            fetchUserData();
        }
    }, [shows, showingCurrentUserInfo]);


    return (
        <div className='w-full'>
            <ShowSearchHeader 
                filters={filters} setFilters={setFilters} 
                showingCurrentUserInfo={showingCurrentUserInfo} setShowCurrentUserInfo={setShowCurrentUserInfo}/>
            <div className=''>
                <ShowSearchShows shows={shows} currentUserInfo={currentUserInfo}/>
            </div>
        </div>       
    );

};