import { Skeleton } from "@/components/ui/skeleton";

export default async function ProfilePageCardSkeleton({ cardTitle }: { cardTitle: string }) {

    return (
        <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden animate-pulse">
            <div className="px-5 py-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Skeleton className="w-5 h-5 rounded bg-white/10" />
                    <span className="font-semibold text-white/80">{cardTitle}</span>
                </div>
            </div>
            <div className="px-5 py-3 space-y-4">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-6 h-6 rounded-md bg-white/10" />
                                <Skeleton className="h-4 w-24 bg-white/10" />
                            </div>
                            <Skeleton className="h-3 w-16 bg-white/10" />
                        </div>
                        <Skeleton className="h-1.5 w-full rounded-full bg-white/10" />
                    </div>
                ))}
            </div>
        </div>
    );
}