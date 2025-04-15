import ShowSearch from "../components/showSearch/ShowSearch";
import { ShowSearchType } from "../models/showSearchType";
import { createClient } from "../utils/supabase/server";

export default async function DiscoverNewShows({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

    // Get current user ID
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="w-full">
            <h1 className="text-5xl font-bold">Discover New Shows</h1>
            <ShowSearch 
                searchType={ShowSearchType.DISCOVER_NEW} 
                searchParams={await searchParams}
                currentUserId={user?.id}
                pathname="/discoverShows"
            />
        </div>
    );
}