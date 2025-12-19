import ShowSearch from "@/app/components/showSearch/ShowSearch";
import { ShowSearchType } from "@/app/models/showSearchType";
import { createClient } from "@/app/utils/supabase/server";
import { JwtPayload } from "@supabase/supabase-js";


export default async function CurrentUserWatchlist({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // Get current user ID
    const supabase = await createClient();
    const { data: { claims } } = await supabase.auth.getClaims() as { data: { claims: JwtPayload } };
    const userId = claims?.sub;
    return (
        <div className="w-full h-full">
            <ShowSearch 
                searchType={ShowSearchType.WATCHLIST} 
                currentUserId={userId}
                searchParams={await searchParams}
                pathname="/watchlist"
                pageTitle="Your Watchlist"
            />
        </div>
    );
}