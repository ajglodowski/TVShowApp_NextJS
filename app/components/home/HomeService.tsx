import { Show } from "@/app/models/show";
import { Status } from "@/app/models/status";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { ComingSoonDTO } from "./ComingSoonRow";

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

export async function getTop10(): Promise<{showId: number, updates: number}[] | null> {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const { data: showData } = await supabase.from("top10shows").select('showId, updates');
    
    if (!showData) return null;   
    const output = showData as unknown as {showId: number, updates: number}[];

    return output;
}

export async function getAllStatuses(): Promise<Status[]|null> {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const { data } = await supabase.from("status").select();
    const statuses = data as unknown as Status[];
    return statuses;
}

export async function getComingSoon({userId}: {userId: string}): Promise<ComingSoonDTO[] | null> {

    if (!userId) return null;
    
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const { data: showData } = await supabase.from("UserShowDetails").select('show: showId (name, releaseDate, id)').match({userId: userId, status: 9});
    if (!showData) return null;
    var output = [];
    for (const showObj of showData) {
        const show = showObj.show as unknown as Show;
        if (show.releaseDate) output.push({showId: show.id.toString(), releaseDate: show.releaseDate} as ComingSoonDTO);
    }
    output = output.sort((a, b) => { return a.releaseDate > b.releaseDate ? 1 : -1});
    return output;
}

export async function getUserUpdates({userId, updateLimit}: {userId: string, updateLimit: number}): Promise<number[]|null> {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const { data: updateData } = await supabase.from("UserUpdate").select('id').match({userId: userId}).order('updateDate', {ascending: false}).limit(updateLimit);
    if (!updateData) return null;
    const updates = updateData.map((obj) => obj.id) 
    return updates as unknown as number[];;
}