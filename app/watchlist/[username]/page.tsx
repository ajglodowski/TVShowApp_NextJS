import ShowSearch from "@/app/components/showSearch/ShowSearch";
import { ShowSearchType } from "@/app/models/showSearchType";
import { createClient } from "@/app/utils/supabase/server";
import { getUserByUsername } from "@/app/utils/userService";

export default async function WatchlistPage({
    searchParams,
    params
}: {
    searchParams: { [key: string]: string | string[] | undefined },
    params: { username: string }
}) {
    const username = (await params).username;
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
                searchParams={searchParams}
                pathname={`/watchlist/${username}`}
            />
        </div>
    );
}