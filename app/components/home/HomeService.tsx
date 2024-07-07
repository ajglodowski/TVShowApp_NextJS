import { Show, ShowPropertiesWithService } from "@/app/models/show";
import { Status } from "@/app/models/status";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { ComingSoonDTO } from "./ComingSoonRow";
import { UserUpdateTileDTO } from "../userUpdate/UserUpdateService";
import { UserUpdate, UserUpdatePropertiesWithShowName } from "@/app/models/userUpdate";
import { CurrentlyAiringDTO } from "@/app/models/airDate";

export async function getWatchList({userId}: {userId: string}): Promise<Show[] | null> {
    if (!userId) return null;
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const { data: showData } = await supabase.from("UserShowDetails").select(`show (${ShowPropertiesWithService})`).match({userId: userId, status: 3});
    if (!showData) return null;   
    const output = showData.map((obj) => obj.show) as unknown as Show[];
    return output;
}

export async function getCurrentlyAiring({userId}: {userId: string}): Promise<CurrentlyAiringDTO[] | null> {

    if (!userId) return null;
  
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const { data: showData } = await supabase.from("UserShowDetails").select('show: showId (name, airdate, id)').match({userId: userId, status: 5});
    if (!showData) return null;
    const output = showData.map((obj) => obj.show) as unknown as CurrentlyAiringDTO[];
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
    let output = [];
    for (const showObj of showData) {
        const show = showObj.show as unknown as Show;
        if (show.releaseDate) output.push({showId: show.id.toString(), releaseDate: show.releaseDate} as ComingSoonDTO);
    }
    output = output.sort((a, b) => { return a.releaseDate > b.releaseDate ? 1 : -1});
    return output;
}

function formatUpdate(updateData: any): UserUpdateTileDTO {
    const showInfo = updateData.show as unknown as {id: number, name: string};
    const formatted = {
        ...updateData,
        showId: showInfo.id as unknown as string,
        statusChange: updateData.status as unknown as Status,
        updateDate: new Date(updateData.updateDate),
        status: undefined,
    } as unknown as UserUpdate;

    const update = {userUpdate: formatted, showName: showInfo.name} as unknown as UserUpdateTileDTO;
    return update;
}

export async function getUserUpdates({userId, updateLimit}: {userId: string, updateLimit: number}): Promise<UserUpdateTileDTO[]|null> {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const { data: updateData } = await supabase.from("UserUpdate").select(UserUpdatePropertiesWithShowName).match({userId: userId}).order('updateDate', {ascending: false}).limit(updateLimit);
    if (!updateData) return null;
    const updates = [];
    for (const update of updateData) {
        updates.push(formatUpdate(update));
    }
    return updates;
}

