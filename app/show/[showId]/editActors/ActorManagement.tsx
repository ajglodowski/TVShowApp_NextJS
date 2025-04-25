import { Actor } from "@/app/models/actor";
import Link from "next/link";
import { X } from "lucide-react";
import { handleRemoveActor } from "./actions";

interface ActorManagementProps {
  showId: number;
  actors: Actor[];
}

export default function ActorManagement({ showId, actors }: ActorManagementProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Current Actors</h2>
      {actors.length > 0 ? (
        <ul className="space-y-2">
          {actors.map((actor) => (
            <li key={actor.id} className="flex justify-between items-center p-2 bg-white/10 rounded-lg">
              <Link href={`/actor/${actor.id}`} className="hover:underline">
                {actor.name}
              </Link>
              <form action={handleRemoveActor}>
                <input type="hidden" name="actorId" value={actor.id} />
                <input type="hidden" name="showId" value={showId} />
                <button
                  type="submit"
                  className="p-1 text-red-500 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Remove actor"
                >
                  <X size={18} />
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white/60">No actors for this show</p>
      )}
    </div>
  );
} 