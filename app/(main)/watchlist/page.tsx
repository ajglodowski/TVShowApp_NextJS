import ShowSearch from "@/app/components/showSearch/ShowSearch";
import { ShowSearchType } from "@/app/models/showSearchType";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoadingCurrentUserWatchlist from "./loading";


export default async function CurrentUserWatchlist({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // Get current user ID
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        redirect('/login');
    }

    return (
        <div className="w-full h-full">
            <ShowSearch 
                searchType={ShowSearchType.WATCHLIST} 
                currentUserId={user.id}
                searchParams={await searchParams}
                pathname="/watchlist"
                pageTitle="Your Watchlist"
            />
        </div>
    );
}