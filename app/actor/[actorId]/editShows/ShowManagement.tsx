import { Show } from "@/app/models/show";
import Link from "next/link";
import { X } from "lucide-react";
import { handleRemoveShowFromActor } from "./actions";

interface ShowManagementProps {
  actorId: number;
  shows: Show[];
}

export default function ShowManagement({ actorId, shows }: ShowManagementProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Current Shows</h2>
      {shows.length > 0 ? (
        <ul className="space-y-2">
          {shows.map((show) => (
            <li key={show.id} className="flex justify-between items-center p-2 bg-white/10 rounded-lg">
              <Link href={`/show/${show.id}`} className="hover:underline">
                {show.name}
              </Link>
              <form action={handleRemoveShowFromActor}>
                <input type="hidden" name="actorId" value={actorId} />
                <input type="hidden" name="showId" value={show.id} />
                <button
                  type="submit"
                  className="p-1 text-red-500 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Remove show"
                >
                  <X size={18} />
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white/60">No shows for this actor</p>
      )}
    </div>
  );
} 