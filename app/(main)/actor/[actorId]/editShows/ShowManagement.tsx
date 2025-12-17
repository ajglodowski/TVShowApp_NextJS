'use client'

import { Show } from "@/app/models/show";
import { Button } from "@/components/ui/button";
import { ExternalLink, Film, Trash2, Tv } from "lucide-react";
import Link from "next/link";
import { handleRemoveShowFromActor } from "./actions";

interface ShowManagementProps {
  actorId: number;
  shows: Show[];
}

export default function ShowManagement({ actorId, shows }: ShowManagementProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
          <Film className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Current Shows</h2>
          <p className="text-white/50 text-sm">{shows.length} {shows.length === 1 ? 'show' : 'shows'} added</p>
        </div>
      </div>
      
      {shows.length > 0 ? (
        <ul className="space-y-2">
          {shows.map((show) => (
            <li 
              key={show.id} 
              className="group flex justify-between items-center p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Tv className="w-4 h-4 text-white/60" />
                </div>
                <Link 
                  href={`/show/${show.id}`} 
                  className="text-white hover:text-primary transition-colors font-medium truncate flex items-center gap-2"
                >
                  {show.name}
                  <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-primary/60 transition-colors flex-shrink-0" />
                </Link>
              </div>
              <form action={handleRemoveShowFromActor}>
                <input type="hidden" name="actorId" value={actorId} />
                <input type="hidden" name="showId" value={show.id} />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-2"
                  aria-label="Remove show"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-10">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Film className="w-7 h-7 text-white/30" />
          </div>
          <p className="text-white/50 font-medium mb-1">No shows added</p>
          <p className="text-white/40 text-sm">Search above to add shows to this actor</p>
        </div>
      )}
    </div>
  );
} 
