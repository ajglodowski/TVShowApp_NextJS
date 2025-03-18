import ShowSearch from "../components/showSearch/ShowSearch";
import { ShowSearchType } from "../models/showSearchType";

export default async function CurrentUserWatchlist() {

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mx-4 mt-2">Your Watchlist</h1>
            <ShowSearch searchType={ShowSearchType.WATCHLIST}/>
        </div>
    );
}