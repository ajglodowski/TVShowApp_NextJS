import ShowSearch from "../components/showSearch/ShowSearch";
import { ShowSearchType } from "../models/showSearchType";

export default async function CurrentUserWatchlist() {

    return (
        <div className="w-full">
            <h1 className="text-5xl font-bold">Your Watchlist</h1>
            <ShowSearch searchType={ShowSearchType.WATCHLIST}/>
        </div>
    );
}