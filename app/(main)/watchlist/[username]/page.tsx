import ShowSearch from "@/app/components/showSearch/ShowSearch";
import { ShowSearchType } from "@/app/models/showSearchType";
import { createClient } from "@/app/utils/supabase/server";
import { getUserByUsername } from "@/app/utils/userService";
import { Suspense } from "react";
import LoadingOtherUserWatchlist from "./loading";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    params: Promise<{ username: string }>;
}

export default async function WatchlistPage({ searchParams, params }: PageProps) {
    
    const awaitedParams = await params;
    const username = awaitedParams.username;
    const awaitedSearchParams = await searchParams;
    const user = await getUserByUsername(username);
    if (!user) {
        return (
            <div className='text-center my-auto mx-auto'>
                <h1 className='text-4xl font-bold'>Uh oh</h1>
                <h2 className='text-2xl'>User not found</h2>
                <h2 className='text-5xl'>😞</h2>
            </div>
        )
    }
    const userId = user.id;

    // Check if the current user is logged in
    const supabase = await createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mx-4 mt-2">{username}'s Watchlist</h1>
            <ShowSearch 
                searchType={ShowSearchType.OTHER_USER_WATCHLIST} 
                userId={userId}
                currentUserId={currentUser?.id}
                searchParams={awaitedSearchParams}
                pathname={`/watchlist/${username}`}
            />
        </div>
    );
}