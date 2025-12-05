'use client'

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { searchShows } from "@/app/components/show/ClientShowService";
import { handleAddShowToActor } from "./actions";
import { Show } from "@/app/models/show";

interface ShowSearchClientProps {
  actorId: number;
  currentShows: Show[];
}

export default function ShowSearchClient({ actorId, currentShows }: ShowSearchClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Pick<Show, 'id' | 'name'>[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const results = await searchShows(query);
      if (results) {
        // Filter out shows that are already added to the actor
        const filteredResults = results.filter(
          show => !currentShows.some(s => s.id === show.id)
        );
        setSearchResults(filteredResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching shows:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Add debounce for search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, currentShows]);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for shows..."
          className="pl-10 w-full p-2 bg-white/5 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
        />
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="mt-2">
          <h2 className="text-xl font-semibold mb-2">Search Results</h2>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-white/5 rounded-lg"></div>
              ))}
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <ul className="space-y-2">
              {searchResults.map((show) => (
                <li key={show.id} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                  <span>{show.name}</span>
                  <form action={handleAddShowToActor}>
                    <input type="hidden" name="actorId" value={actorId} />
                    <input type="hidden" name="showId" value={show.id} />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white/60">No shows found</p>
          )}
        </div>
      )}
    </div>
  );
} 