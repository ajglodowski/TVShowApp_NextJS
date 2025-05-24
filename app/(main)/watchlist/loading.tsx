import { LoadingShowSearch } from "@/app/components/showSearch/ShowSearch";

export default async function LoadingCurrentUserWatchlist() {

    return (
        <div className="w-full">
            <LoadingShowSearch pageTitle="Your Watchlist" />
        </div>
    );
}