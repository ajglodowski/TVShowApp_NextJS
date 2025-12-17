'use client'

import { Actor } from "@/app/models/actor";
import { useActionState, useEffect, useState, useRef } from "react";
import { Search, Plus, AlertCircle, CheckCircle2 } from "lucide-react";
import { searchActors } from "@/app/(main)/actor/ActorServiceClient";
import { handleAddActorToShow, handleCreateActorAndAddToShow, ActionResult } from "./actions";

interface ActorSearchClientProps {
  showId: number;
  currentActors: Actor[];
}

export default function ActorSearchClient({ showId, currentActors }: ActorSearchClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Actor[] | null>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newActorName, setNewActorName] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const [createState, createAction, isCreating] = useActionState<ActionResult | null, FormData>(
    handleCreateActorAndAddToShow,
    null
  );

  // Clear form and show success message when actor is created
  useEffect(() => {
    if (createState?.ok) {
      setNewActorName('');
      formRef.current?.reset();
    }
  }, [createState]);

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

  // Quick create with search query when no results found
  const handleQuickCreate = () => {
    setNewActorName(searchQuery.trim());
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Create Actor Section */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Actor
        </h2>
        <form ref={formRef} action={createAction} className="flex flex-col gap-3">
          <input type="hidden" name="showId" value={showId} />
          <div className="flex gap-2">
            <input
              type="text"
              name="actorName"
              value={newActorName}
              onChange={(e) => setNewActorName(e.target.value)}
              placeholder="Enter actor name..."
              className="flex-1 p-2 bg-white/5 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30"
              disabled={isCreating}
            />
            <button
              type="submit"
              disabled={isCreating || !newActorName.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create & Add'}
            </button>
          </div>
          
          {/* Success/Error Messages */}
          {createState?.ok && (
            <div className="flex items-center gap-2 p-2 bg-green-600/20 border border-green-500/50 rounded-lg text-green-300">
              <CheckCircle2 className="h-4 w-4" />
              <span>{createState.message}</span>
            </div>
          )}
          {createState?.error && (
            <div className="flex items-center gap-2 p-2 bg-red-600/20 border border-red-500/50 rounded-lg text-red-300">
              <AlertCircle className="h-4 w-4" />
              <span>{createState.error}</span>
            </div>
          )}
        </form>
      </div>

      {/* Search Existing Actors Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Search Existing Actors</h2>
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
            <div className="text-white/60">
              <p>No actors found matching &ldquo;{searchQuery}&rdquo;</p>
              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={handleQuickCreate}
                  className="mt-2 text-sm text-blue-400 hover:text-blue-300 underline"
                >
                  Create &ldquo;{searchQuery.trim()}&rdquo; as a new actor
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}