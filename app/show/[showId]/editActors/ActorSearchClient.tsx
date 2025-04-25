'use client'

import { Actor } from "@/app/models/actor";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { searchActors } from "@/app/actor/ActorServiceClient";
import { handleAddActorToShow } from "./actions";

interface ActorSearchClientProps {
  showId: number;
  currentActors: Actor[];
}

export default function ActorSearchClient({ showId, currentActors }: ActorSearchClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Actor[] | null>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const results = await searchActors(query);
      if (results) {
        // Filter out actors that are already added to the show
        const filteredResults = results.filter(
          actor => !currentActors.some(a => a.id === actor.id)
        );
        setSearchResults(filteredResults);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching actors:", error);
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
  }, [searchQuery, currentActors]);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for actors..."
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
              {searchResults.map((actor) => (
                <li key={actor.id} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                  <span>{actor.name}</span>
                  <form action={handleAddActorToShow}>
                    <input type="hidden" name="actorId" value={actor.id} />
                    <input type="hidden" name="showId" value={showId} />
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
            <p className="text-white/60">No actors found</p>
          )}
        </div>
      )}
    </div>
  );
} 