import { getUserUpdates } from "@/app/components/home/HomeService";
import UserUpdateTile from "@/app/components/userUpdate/UserUpdateTile/UserUpdateTile";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, MessageSquare } from "lucide-react";
import { Suspense } from "react";

export default async function UserUpdatesRow ({userId}: {userId: string}) {

    return (
        <Suspense fallback={<UserUpdatesRowSkeleton />}>
            <UserUpdatesRowContent userId={userId} />
        </Suspense>
    );
};

async function UserUpdatesRowContent({userId}: {userId: string}) {
    const updates = await getUserUpdates({userId: userId, updateLimit: 10, fetchHidden: false});

    if (updates === null) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-white/50">
                <MessageSquare className="w-10 h-10 mb-3 opacity-50" />
                <p className="text-sm">Error loading updates</p>
            </div>
        );
    }
    
    if (updates.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-white/50">
                <Clock className="w-10 h-10 mb-3 opacity-50" />
                <p className="text-sm">No activity yet</p>
                <p className="text-xs mt-1 text-white/30">Updates will appear here when you interact with shows</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {updates.map((update) => (
                <div key={update.userUpdate.id} className="animate-in" style={{ animationDelay: `${updates.indexOf(update) * 0.05}s` }}>
                    <UserUpdateTile key={update.showName} updateDto={update}/>
                </div>
            ))}
        </div>
    )
}

function UserUpdatesRowSkeleton() {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl bg-white/5 border border-white/5 p-4 animate-pulse">
                    <div className="flex items-start gap-3">
                        <Skeleton className="w-12 h-16 rounded-lg bg-white/10" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4 bg-white/10" />
                            <Skeleton className="h-3 w-1/2 bg-white/10" />
                            <Skeleton className="h-3 w-1/3 bg-white/10" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}