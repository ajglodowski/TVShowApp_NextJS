import { getActor, getShowsForActor } from "@/app/actor/ActorService";
import ShowSearchClient from "./ShowSearchClient";
import ShowManagement from "./ShowManagement";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { backdropBackground } from "@/app/utils/stylingConstants";

export default async function EditActorShowsPage({ params }: { params: Promise<{ actorId: string }> }) {
    const actorId = (await params).actorId;
    let [fetchedActor, fetchedShows] = await Promise.all([getActor(actorId), getShowsForActor(actorId)]);
    const actor = fetchedActor || null;
    const shows = fetchedShows || [];

    
    if (!actor) {
        return <div>Actor not found</div>;
    }
    
    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="mb-6 flex items-center">
                <Link
                    href={`/actor/${actorId}`}
                    className="flex items-center text-white/70 hover:text-white transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 mr-1" />
                    Back to Actor
                </Link>
            </div>
            
            <Card className={`${backdropBackground} p-6 rounded-lg shadow-lg text-white text-left`}>
                <CardHeader className="text-left">
                    <CardTitle className="text-left">Edit Shows for {actor.name}</CardTitle>
                    <CardDescription className="text-left">
                        Add or remove shows from {actor.name}'s profile.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-left">
                    <div className="text-left">
                        {/* Client component for search */}
                        <ShowSearchClient actorId={parseInt(actorId)} currentShows={shows} />
                        
                        {/* Server component for displaying shows */}
                        <div className="mt-8">
                            <ShowManagement actorId={parseInt(actorId)} shows={shows} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 