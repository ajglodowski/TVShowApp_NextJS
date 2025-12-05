import { LoadingShowSearch } from "@/app/components/showSearch/ShowSearch";

export default async function LoadingOtherUserWatchlist() {

    return (
        <div className="w-full">
            <LoadingShowSearch pageTitle="Loading Watchlist..." />
        </div>
    );
}