import { Skeleton } from "@/components/ui/skeleton";
import { backdropBackground } from "@/app/utils/stylingConstants";

export default function LoadingUpdatesPage() {
    return (
        <div className="fixed top-14 left-0 right-0 bottom-0 flex flex-col overflow-hidden">
            {/* Header - Fixed height, no scroll */}
            <div className={`flex-shrink-0 ${backdropBackground}`}>
                <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                    {/* Back button + Title skeleton */}
                    <div className="py-4">
                        <div className="flex items-center gap-3 mb-3">
                            <Skeleton className="h-8 w-20 bg-white/10 rounded" />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <Skeleton className="h-7 w-48 bg-white/10" />
                            <Skeleton className="h-10 w-36 bg-white/10 rounded-lg" />
                        </div>
                    </div>

                    {/* Pagination skeleton in header */}
                    <div className="pb-2">
                        <div className="pt-1 border-t border-border/20">
                            <div className="flex justify-between items-center py-2">
                                <Skeleton className="h-4 w-24 bg-white/10" />
                                <Skeleton className="h-6 w-20 bg-white/10" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Flexible height, scrollable */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl py-4">
                    <div className="space-y-3">
                        {[...Array(10)].map((_, i) => (
                            <div 
                                key={i} 
                                className="rounded-xl bg-white/5 border border-white/10 p-4 animate-pulse"
                            >
                                <div className="flex items-center gap-4">
                                    <Skeleton className="w-14 h-[72px] rounded-lg bg-white/10 flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-5 w-3/4 bg-white/10" />
                                        <Skeleton className="h-4 w-1/2 bg-white/10" />
                                        <Skeleton className="h-3 w-1/4 bg-white/10" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
