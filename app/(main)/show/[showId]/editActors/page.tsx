import { getActorsForShow } from "../ShowService";
import ActorSearchClient from "./ActorSearchClient";
import ActorManagement from "./ActorManagement";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { backdropBackground } from "@/app/utils/stylingConstants";
import { Suspense } from "react";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
export default async function EditActorsPage({ params }: { params: Promise<{ showId: string }> }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditActorsPageContent params={params} />
        </Suspense>
    );
}

async function EditActorsPageContent({ params }: { params: Promise<{ showId: string }> }) {
    const showId = parseInt((await params).showId);
    const actors = await getActorsForShow(showId) || [];
    
    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="mb-6 flex items-center">
                <Link
                    href={`/show/${showId}`}
                    className="flex items-center text-white/70 hover:text-white transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 mr-1" />
                    Back to Show
                </Link>
            </div>
            
            <Card className={`${backdropBackground} p-6 rounded-lg shadow-lg text-white text-left`}>
                <CardHeader className="text-left">
                    <CardTitle className="text-left">Edit Actors</CardTitle>
                    <CardDescription className="text-left">
                        Add or remove actors from this show.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-left">
                    <div className="text-left">
                        <ActorSearchClient showId={showId} currentActors={actors} />
                        
                        <div className="mt-8">
                            <ActorManagement showId={showId} actors={actors} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}