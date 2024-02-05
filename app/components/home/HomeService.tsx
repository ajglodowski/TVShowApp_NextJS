import { Show } from "@/app/models/show";
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

export async function getCurrentlyAiring({userId}: {userId: string}): Promise<any[] | null> {

    if (!userId) return null;
  
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const { data: showData } = await supabase.from("UserShowDetails").select('show: showId (name, airdate, id)').match({userId: userId, status: 5});
    if (!showData) return null;
    const output = showData.map((obj) => obj.show) as unknown as any[];
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
