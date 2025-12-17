import ShowRow from "@/app/components/show/ShowRow/ShowRow";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Edit2, Film, Frown, Tv } from "lucide-react";
import Link from "next/link";
import { getActor, getShowsForActor } from "../ActorService";

export default async function ActorPage({ params }: { params: Promise<{ actorId: string }> }) {
    
    const actorId = (await params).actorId;

    const actor = await getActor(actorId);
    const shows = await getShowsForActor(actorId);

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
            <div className="relative z-10 container mx-auto py-6 px-4 md:px-6 max-w-6xl">
                {/* Back Navigation */}
                <div className="mb-6 animate-in">
                    <Link
                        href="/"
                        className="inline-flex items-center text-white/60 hover:text-white transition-colors text-sm"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1.5" />
                        Back to Home
                    </Link>
                </div>

                {/* Header Card */}
                <div className="animate-in mb-8">
                    <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
                        {/* Top decorative gradient bar */}
                        <div className="h-20 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
                        
                        <div className="relative px-5 pb-6 -mt-10 md:px-8">
                            <div className="flex flex-col md:flex-row md:items-end gap-5">
                                {/* Avatar Section */}
                                <div className="flex-shrink-0">
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/50 to-primary/20 blur-xl scale-110" />
                                        <div className="relative h-24 w-24 md:h-28 md:w-28 rounded-full border-4 border-white/20 shadow-2xl ring-2 ring-primary/30 ring-offset-2 ring-offset-transparent bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                                            <span className="text-primary-foreground text-2xl md:text-3xl font-bold">{initials}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actor Info */}
                                <div className="flex-1 min-w-0 pb-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <h1 className="text-2xl md:text-3xl font-bold text-white">{actor.name}</h1>
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs">
                                            <Film className="w-3 h-3" />
                                            Actor
                                        </div>
                                    </div>
                                    
                                    {shows && shows.length > 0 && (
                                        <p className="text-white/60 text-sm">
                                            {shows.length} {shows.length === 1 ? 'show' : 'shows'} in database
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 md:pb-1">
                                    <Link href={`/actor/${actorId}/editShows`}>
                                        <Button 
                                            variant="outline" 
                                            className="border-white/20 bg-white/5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                                        >
                                            <Edit2 className="mr-2 h-4 w-4" />
                                            Edit Shows
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shows Section */}
                <div className="animate-in" style={{ animationDelay: '0.1s' }}>
                    <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-5">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Tv className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Filmography</h2>
                                <p className="text-white/50 text-sm">Shows featuring {actor.name}</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-4 w-full">
                            {shows && shows.length > 0 ? (
                                shows.map(show => (
                                    <ShowRow key={show.id} show={show} fetchCurrentUsersInfo={true} fetchFriendsInfo={true} />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                        <Tv className="w-8 h-8 text-white/30" />
                                    </div>
                                    <p className="text-white/50 text-lg font-medium mb-2">No shows yet</p>
                                    <p className="text-white/40 text-sm mb-4">Add shows to this actor&apos;s filmography</p>
                                    <Link href={`/actor/${actorId}/editShows`}>
                                        <Button 
                                            variant="outline"
                                            size="sm"
                                            className="border-white/20 bg-white/5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                                        >
                                            <Edit2 className="mr-2 h-3 w-3" />
                                            Add Shows
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ActorPageSkeleton() {
    return (
        <div className="min-h-screen">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(80,40,15)_0%,rgb(25,12,5)_40%,rgb(5,5,5)_100%)]" />
            </div>
            
            <div className="relative z-10 container mx-auto py-6 px-4 md:px-6 max-w-6xl">
                <Skeleton className="h-5 w-32 bg-white/10 mb-6" />
                
                <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden mb-8">
                    <div className="h-20 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
                    <div className="relative px-5 pb-6 -mt-10 md:px-8">
                        <div className="flex flex-col md:flex-row md:items-end gap-5">
                            <Skeleton className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-white/10" />
                            <div className="flex-1 pb-1">
                                <Skeleton className="h-8 w-48 bg-white/10 mb-2" />
                                <Skeleton className="h-5 w-32 bg-white/10" />
                            </div>
                            <Skeleton className="h-10 w-32 bg-white/10 rounded-lg" />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-5">
                    <div className="flex items-center gap-3 mb-5">
                        <Skeleton className="h-9 w-9 rounded-lg bg-white/10" />
                        <div>
                            <Skeleton className="h-6 w-32 bg-white/10 mb-1" />
                            <Skeleton className="h-4 w-48 bg-white/10" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-24 w-full bg-white/10 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
