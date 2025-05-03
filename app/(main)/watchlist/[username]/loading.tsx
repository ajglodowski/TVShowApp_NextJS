import { LoadingShowSearch } from "@/app/components/showSearch/ShowSearch";
import { Skeleton } from "@/components/ui/skeleton";

export default async function LoadingOtherUserWatchlist() {

    return (
        <div className="w-full">
            <span className="flex items-center space-x-2 text-2xl font-bold mx-4 mt-2"><Skeleton className="w-24 h-6" />'s Watchlist</span>
            <LoadingShowSearch />
        </div>
    );
}