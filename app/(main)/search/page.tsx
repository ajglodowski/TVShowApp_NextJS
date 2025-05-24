import ShowSearch from "@/app/components/showSearch/ShowSearch";
import { ShowSearchType } from "@/app/models/showSearchType";
import { createClient } from "@/app/utils/supabase/server";

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

    // Get current user ID
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="w-full">
            <h1 className="text-5xl font-bold">Search</h1>
            <ShowSearch 
                searchType={ShowSearchType.UNRESTRICTED} 
                searchParams={await searchParams}
                currentUserId={user?.id}
                pathname="/search"
            />
        </div>
    );
}