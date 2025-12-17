import { getActor, getShowsForActor } from "@/app/(main)/actor/ActorService";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Frown, Settings2 } from "lucide-react";
import Link from "next/link";
import ShowManagement from "./ShowManagement";
import ShowSearchClient from "./ShowSearchClient";

export default async function EditActorShowsPage({ params }: { params: Promise<{ actorId: string }> }) {
    
    const actorId = (await params).actorId;
    const [fetchedActor, fetchedShows] = await Promise.all([getActor(actorId), getShowsForActor(actorId)]);
    const actor = fetchedActor || null;
    const shows = fetchedShows || [];

    
    if (!actor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                {/* Background gradient */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(80,40,15)_0%,rgb(25,12,5)_40%,rgb(5,5,5)_100%)]" />
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center space-y-4 p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                        <Frown className="w-8 h-8 text-white/60" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Actor Not Found</h1>
                    <p className="text-white/60 text-center max-w-sm">The actor you are looking for does not exist or has been removed.</p>
                    <Link href="/">
                        <Button variant="outline" className="mt-4 border-white/20 hover:bg-white/10">
                            Go Home
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Get initials for avatar
    const initials = actor.name
        ? actor.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';
    
    return (
        <div className="min-h-screen">
            {/* Background gradient */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(80,40,15)_0%,rgb(25,12,5)_40%,rgb(5,5,5)_100%)]" />
            </div>

            {/* Main content */}
            <div className="relative z-10 container mx-auto py-6 px-4 md:px-6 max-w-4xl">
                {/* Back Navigation */}
                <div className="mb-6 animate-in">
                    <Link
                        href={`/actor/${actorId}`}
                        className="inline-flex items-center text-white/60 hover:text-white transition-colors text-sm"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1.5" />
                        Back to {actor.name}
                    </Link>
                </div>

                {/* Header Card */}
                <div className="animate-in mb-8">
                    <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
                        {/* Top decorative gradient bar */}
                        <div className="h-16 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
                        
                        <div className="relative px-5 pb-5 -mt-8 md:px-6">
                            <div className="flex items-end gap-4">
                                {/* Avatar Section */}
                                <div className="flex-shrink-0">
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/50 to-primary/20 blur-lg scale-110" />
                                        <div className="relative h-16 w-16 rounded-full border-3 border-white/20 shadow-xl ring-2 ring-primary/30 bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                                            <span className="text-primary-foreground text-lg font-bold">{initials}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actor Info */}
                                <div className="flex-1 min-w-0 pb-0.5">
                                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                        <h1 className="text-xl md:text-2xl font-bold text-white">Edit Shows</h1>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                                            <Settings2 className="w-3 h-3" />
                                            Edit Mode
                                        </div>
                                    </div>
                                    <p className="text-white/60 text-sm">
                                        Add or remove shows from <span className="text-white font-medium">{actor.name}</span>&apos;s filmography
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="animate-in mb-6" style={{ animationDelay: '0.1s' }}>
                    <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-5">
                        <ShowSearchClient actorId={parseInt(actorId)} currentShows={shows} />
                    </div>
                </div>

                {/* Current Shows Section */}
                <div className="animate-in" style={{ animationDelay: '0.15s' }}>
                    <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-5">
                        <ShowManagement actorId={parseInt(actorId)} shows={shows} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function EditActorShowsSkeleton() {
    return (
        <div className="min-h-screen">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(80,40,15)_0%,rgb(25,12,5)_40%,rgb(5,5,5)_100%)]" />
            </div>
            
            <div className="relative z-10 container mx-auto py-6 px-4 md:px-6 max-w-4xl">
                <Skeleton className="h-5 w-32 bg-white/10 mb-6" />
                
                <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden mb-8">
                    <div className="h-16 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
                    <div className="relative px-5 pb-5 -mt-8 md:px-6">
                        <div className="flex items-end gap-4">
                            <Skeleton className="h-16 w-16 rounded-full bg-white/10" />
                            <div className="flex-1 pb-0.5">
                                <Skeleton className="h-7 w-40 bg-white/10 mb-1" />
                                <Skeleton className="h-4 w-64 bg-white/10" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-5 mb-6">
                    <Skeleton className="h-11 w-full bg-white/10 rounded-lg" />
                </div>

                <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-5">
                    <Skeleton className="h-7 w-36 bg-white/10 mb-4" />
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-12 w-full bg-white/10 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
