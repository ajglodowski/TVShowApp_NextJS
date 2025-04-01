import { getActor } from "../ActorService";

export default async function ActorPage({ params }: { params: Promise<{ actorId: string }> }) {
    const actorId = (await params).actorId;

    const actor = await getActor(actorId);

    if (!actor) {
        return <div>Actor not found</div>
    }

    return (
        <div>
            <h1>{actor.name}</h1>
            <div>
                
            </div>

        </div>
    )
}