import ShowSearch from "@/app/components/showSearch/ShowSearch";
import { ShowSearchType } from "@/app/models/showSearchType";

export default async function WatchlistPage({ params }: { params: Promise<{ userId: string }> }) {

    const userId = (await params).userId;

    return (
        <div className="w-full">
            <h1>Watchlist Page {userId}</h1>
            <ShowSearch searchType={ShowSearchType.OTHER_USER_WATCHLIST}/>
        </div>
    );
}