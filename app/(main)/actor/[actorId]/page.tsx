import ShowRow from "@/app/components/show/ShowRow/ShowRow";
import { getActor, getShowsForActor } from "../ActorService";
import Link from "next/link";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

export default async function ActorPage({ params }: { params: Promise<{ actorId: string }> }) {
    
    const actorId = (await params).actorId;

    const actor = await getActor(actorId);
    const shows = await getShowsForActor(actorId);

    if (!actor) {
        return <div>Actor not found</div>
    }

    return (
        <div className="flex flex-col gap-4 w-full p-4 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold">{actor.name}</h1>
                <Link href={`/actor/${actorId}/editShows`}>
                    <button className="p-2 rounded-lg outline outline-white hover:bg-white hover:text-black transition-colors">
                        Edit Shows
                    </button>
                </Link>
            </div>
            
            <h2 className="text-2xl font-semibold mb-2">Shows</h2>
            <div className="flex flex-col gap-4 w-full">
                {shows && shows.length > 0 ? (
                    shows.map(show => (
                        <ShowRow key={show.id} show={show} fetchCurrentUsersInfo={true} fetchFriendsInfo={true} />
                    ))
                ) : (
                    <p className="text-white/60">No shows for this actor</p>
                )}
            </div>
        </div>
    )
}