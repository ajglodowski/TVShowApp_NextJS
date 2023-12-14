import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function getWatchList({userId}: {userId: string}): Promise<number[] | null> {

    if (!userId) return null;
  
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const { data: showData } = await supabase.from("UserShowDetails").select('showId').match({userId: userId, status: 3});
    
    if (!showData) return null;   

    const ids = showData.map((obj) => obj.showId);
    const output = ids as unknown as number[];
    
    return output;
}

export async function getTop10(): Promise<number[] | null> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const { data: showData } = await supabase.from("top10shows").select('showId');
    
    if (!showData) return null;   

    const ids = showData.map((obj) => obj.showId);
    const output = ids as unknown as number[];
    
    return output;
}
