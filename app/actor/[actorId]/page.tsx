import ShowRow from "@/app/components/show/ShowRow/ShowRow";
import { getActor, getShowsForActor } from "../ActorService";

export default async function ActorPage({ params }: { params: Promise<{ actorId: string }> }) {
    const actorId = (await params).actorId;

    const actor = await getActor(actorId);
    const shows = await getShowsForActor(actorId);

    if (!actor) {
        return <div>Actor not found</div>
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <h1>{actor.name}</h1>
            <div className="flex flex-col gap-4 w-full">
                {shows && shows.map(show => (
                    <ShowRow key={show.id} show={show} />
                ))}
            </div>

        </div>
    )
}