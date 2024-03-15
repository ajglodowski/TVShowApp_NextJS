import ShowSearch from "../components/showSearch/ShowSearch";
import { ShowSearchType } from "../models/showSearchType";

export default async function DiscoverNewShows() {

    return (
        <div className="w-full">
            <h1 className="text-5xl font-bold">Discover New Shows</h1>
            <ShowSearch searchType={ShowSearchType.DISCOVER_NEW}/>
        </div>
    );
}