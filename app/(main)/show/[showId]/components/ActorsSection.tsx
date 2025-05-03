import Link from "next/link";
import { getActorsForShow } from "../ShowService";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function ActorsSection ({ showId }: { showId: number }) {
    return (
        <Suspense fallback={<LoadingActorsSection />}>
            <ActorsSectionContent showId={showId} />
        </Suspense>
    );
};

const ActorsSectionContent = async ({showId}: {showId: number}) => {
    const actors = await getActorsForShow(showId);

    if (actors == null) return (<></>);

    if (actors.length === 0) return (<div>No Actors</div>);

    return (
        <ul className="flex flex-col space-y-2">
            {actors.map((actor, index) => (
                <li key={index}>
                    <Link href={`/actor/${actor.id}`}>
                        <div className="p-2 border border-white rounded-full">
                            <span>
                                {actor.name}
                            </span>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
    
}

const LoadingActorsSection = () => {
    return (
        <div className="flex flex-col space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="">
                    <Skeleton className="w-full h-8" />
                </div>
            ))}
        </div>
    );
}