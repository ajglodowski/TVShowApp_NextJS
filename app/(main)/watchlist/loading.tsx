import { LoadingShowSearch } from "@/app/components/showSearch/ShowSearch";

export default async function LoadingCurrentUserWatchlist() {

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mx-4 mt-2">Your Watchlist</h1>
            <LoadingShowSearch />
        </div>
    );
}