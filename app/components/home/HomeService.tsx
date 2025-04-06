import { Show, ShowPropertiesWithService } from "@/app/models/show";
import { Status } from "@/app/models/status";
import { createClient, publicClient } from "@/app/utils/supabase/server";
import { ComingSoonDTO } from "./ComingSoonRow";
import { UserUpdateTileDTO } from "../userUpdate/UserUpdateService";
import { UserUpdate, UserUpdatePropertiesWithShowName } from "@/app/models/userUpdate";
import { CurrentlyAiringDTO } from "@/app/models/airDate";
import { cache } from "react";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

export async function getWatchList({userId}: {userId: string}): Promise<Show[] | null> {
    if (!userId) return null;
    
    const supabase = await createClient();
    const { data: showData } = await supabase.from("UserShowDetails").select(`show (${ShowPropertiesWithService})`).match({userId: userId, status: 3}).limit(10);
    if (!showData) return null;   
    const output = showData.map((obj) => obj.show) as unknown as Show[];
    return output;
}

export async function getTop10(): Promise<{showId: number, updates: number}[] | null> {

    'use cache'
    cacheLife('hours');
    const supabase = await publicClient();
    const { data: showData } = await supabase.from("top10shows").select('showId, updates');
    
    if (!showData) return null;   
    const output = showData as unknown as {showId: number, updates: number}[];

    return output;
}

export const getAllStatuses = cache(async function (): Promise<Status[] | null> {
    'use cache'
    cacheLife('days');
    const supabase = await publicClient();
    const { data } = await supabase.from("status").select();
    const statuses = data as unknown as Status[];
    return statuses;
});

export async function getComingSoon({userId}: {userId: string}): Promise<ComingSoonDTO[] | null> {

    if (!userId) return null;
    
    
    const supabase = await createClient();
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

type UserUpdateDTO = {
    id: number,
    userId: string,
    showId: string,
    status: Status,
    updateDate: Date,
    show: {
        id: number,
        name: string,
        pictureUrl: string
    }
}

function formatUpdate(updateData: UserUpdateDTO): UserUpdateTileDTO {
    const showInfo = updateData.show as unknown as {id: number, name: string, pictureUrl: string};
    const formatted = {
        ...updateData,
        showId: showInfo.id as unknown as string,
        statusChange: updateData.status as unknown as Status,
        updateDate: new Date(updateData.updateDate),
        status: undefined,
    } as unknown as UserUpdate;

    const update = {userUpdate: formatted, showName: showInfo.name, showPictureUrl: showInfo.pictureUrl} as unknown as UserUpdateTileDTO;
    return update;
}

export async function getUserUpdates({userId, updateLimit, fetchHidden}: {userId: string, updateLimit: number, fetchHidden: boolean}): Promise<UserUpdateTileDTO[]|null> {
    
    const supabase = await createClient();
    const { data: updateData } = await supabase.from("UserUpdate").select(UserUpdatePropertiesWithShowName).match({userId: userId}).order('updateDate', {ascending: false}).limit(updateLimit);
    if (!updateData) return null;
    const updates = [];
    for (const update of updateData) {
        updates.push(formatUpdate(update as unknown as UserUpdateDTO));
    }
    return updates;
}

export async function getCurrentlyAiring({userId}: {userId: string}): Promise<CurrentlyAiringDTO[] | null> {

    if (!userId) return null;
    const supabase = await createClient();
    const { data: showData } = await supabase.from("UserShowDetails").select('show: showId (name, airdate, id)').match({userId: userId, status: 5});
    if (!showData) return null;
    const output = showData.map((obj) => obj.show) as unknown as CurrentlyAiringDTO[];
    return output;
}
