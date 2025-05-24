import ShowSearch from "@/app/components/showSearch/ShowSearch";
import { ShowSearchType } from "@/app/models/showSearchType";
import { createClient } from "@/app/utils/supabase/server";

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
            <ShowSearch 
                searchType={ShowSearchType.DISCOVER_NEW} 
                searchParams={await searchParams}
                currentUserId={user?.id}
                pathname="/discoverShows"
                pageTitle="Discover New Shows"
            />
        </div>
    );
}