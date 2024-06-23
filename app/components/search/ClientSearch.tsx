'use client'

import { useEffect, useState } from 'react';
import { searchShows } from './ClientSearchService';
import ClientShowTile from '../show/ShowTile/ClientShowTile';

export const ClientSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<string[]| null | undefined>([]);

    const handleSearch = async (searchQuery: string) => {
        const results = await searchShows({searchQuery: searchQuery});
        setSearchResults(results);
    };

    useEffect(() => {
        if (searchQuery.length === 0) {
            setSearchResults([]);
            return;
        }
        handleSearch(searchQuery);
    }, [searchQuery]);

    return (
        <div>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className='w-full h-10 px-3 bg-black placeholder-gray-600 border rounded-lg focus:shadow-outline'
            />
            <div>
                {searchResults?.map((showId) => (
                    <div key={showId} className="m-2">
                        <ClientShowTile showId={showId} />
                    </div>
                ))}
            </div>
        </div>
    );
};
