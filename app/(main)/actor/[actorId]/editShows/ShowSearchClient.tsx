'use client'

import { useEffect, useState } from "react";
import { Plus, Search, Sparkles, Tv } from "lucide-react";
import { searchShows } from "@/app/components/show/ClientShowService";
import { handleAddShowToActor } from "./actions";
import { Show } from "@/app/models/show";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col gap-5">
      {/* Search Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Add Shows</h2>
          <p className="text-white/50 text-sm">Search and add shows to this actor</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for shows..."
          className="pl-10 h-11 bg-white/5 text-white border-white/10 placeholder:text-white/40 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
        />
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="animate-in">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wide font-medium mb-3">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </p>
              <ul className="space-y-2">
                {searchResults.map((show) => (
                  <li 
                    key={show.id} 
                    className="group flex justify-between items-center p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 hover:border-primary/20 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Tv className="w-4 h-4 text-white/60" />
                      </div>
                      <span className="text-white font-medium truncate">{show.name}</span>
                    </div>
                    <form action={handleAddShowToActor}>
                      <input type="hidden" name="actorId" value={actorId} />
                      <input type="hidden" name="showId" value={show.id} />
                      <Button
                        type="submit"
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all ml-2"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </form>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                <Search className="w-5 h-5 text-white/30" />
              </div>
              <p className="text-white/50 font-medium mb-1">No shows found</p>
              <p className="text-white/40 text-sm">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 
