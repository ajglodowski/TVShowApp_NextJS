'use client'
import { Show } from '@/app/models/show';
import ShowSearchHeader, { ShowSearchFilters, defaultFilters } from './ShowSearchHeader';
import { useEffect, useState } from 'react';
import ShowSearchShows from './ShowSearchShows';
import { fetchShows } from './ShowSearchService';

const shows = [
    { id: 1, name: 'Show 1', genre: 'Comedy' },
    { id: 2, name: 'Show 2', genre: 'Drama' },
    { id: 3, name: 'Show 3', genre: 'Action' },
    // Add more shows here
];



export default function ShowSearch({userId}: {userId?: string}) {

    const [filters, setFilters] = useState<ShowSearchFilters>(defaultFilters);
    const [shows, setShows] = useState<Show[]| undefined | null>(undefined);

    useEffect(() => {
        fetchShows(filters).then((shows) => setShows(shows));
    }, [filters]);


    return (
        <div className='w-full'>
            <ShowSearchHeader filters={filters} setFilters={setFilters}/>
            <div className=''>
                <ShowSearchShows shows={shows} />
            </div>
        </div>       
    );

};