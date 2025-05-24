import { LoadingShowSearch } from "@/app/components/showSearch/ShowSearch";
import { Skeleton } from "@/components/ui/skeleton";

export default async function LoadingOtherUserWatchlist() {

    return (
        <div className="w-full">
            <LoadingShowSearch pageTitle="Loading Watchlist..." />
        </div>
    );
}