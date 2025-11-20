"use server";

import { createClient } from '@/app/utils/supabase/server';
import { Status } from "@/app/models/status";
import { UserShowData, UserShowDataParams } from "@/app/models/userShowData";
import { Rating } from "@/app/models/rating";
import { UserUpdate } from "@/app/models/userUpdate";
import { UserUpdateCategory } from "@/app/models/userUpdateType";
import { revalidateTag } from 'next/cache';

export async function getUserShowData({showId, userId}: {showId: string, userId: string | undefined}): Promise<UserShowData | null> {

    if (!userId) return null;
  
    
    const supabase = await createClient();
    const { data: showData } = await supabase.from("UserShowDetails").select(UserShowDataParams).match({userId: userId, showId: showId}).single();
    
    if (!showData) return null;   
  
    const ouput: UserShowData = {
        ...showData,
        status: showData.status as unknown as Status,
        rating: showData.rating as unknown as Rating
    };
    
    return ouput;
}

export async function updateCurrentSeason({userId, showId, newSeason}: {showId: string, userId: string, newSeason: number}): Promise<boolean> {
    
    const supabase = await createClient();
    const { error} = await supabase.from("UserShowDetails").update({currentSeason: newSeason}).match({userId: userId, showId: showId});
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

export async function updateStatus({userId, showId, newStatus}: {showId: string, userId: string, newStatus: Status}): Promise<boolean> {
    
    const supabase = await createClient();
    const { error} = await supabase.from("UserShowDetails").update({status: newStatus.id}).match({userId: userId, showId: showId});
    if (error) {
        console.error(error);
        return false;
    }
    revalidateTag('currentUserShowData', 'max');
    return true;
}

export async function getAllStatuses(): Promise<Status[]|null> {
    
    const supabase = await createClient();
    const { data } = await supabase.from("status").select();
    const statuses = data as unknown as Status[];
    return statuses;
}

export async function getUserUpdates({showId, userId}: {showId: number, userId: string | undefined}): Promise<UserUpdate[]|null> {
    if (!userId) return null;
  
    
    const supabase = await createClient();
    const { data: updateData } = await supabase.from("UserUpdate").select('id, userId, showId, status:statusChange(id, name), seasonChange, ratingChange, updateDate, updateType, hidden').match({userId: userId, showId: showId});

    if (!updateData) return null;

    const updates = [];
    for (const update of updateData) {
        const formatted = {
            ...update,
            statusChange: update.status as unknown as Status,
            updateDate: new Date(update.updateDate),
            status: undefined,
        }
        updates.push(formatted);
    }
    updates.sort((a, b) => {return b.updateDate.getTime() - a.updateDate.getTime()});
   
    return updates as unknown as UserUpdate[];
}

export async function updateRating({userId, showId, newRating}: {showId: string, userId: string, newRating: Rating | null}): Promise<boolean> {
    
    const supabase = await createClient();
    let error = null;
    if (newRating) {
        error = (await supabase.from("UserShowDetails").update({rating: newRating}).match({userId: userId, showId: showId})).error;
    } else {
        error = (await supabase.from("UserShowDetails").update({rating: null}).match({userId: userId, showId: showId})).error;
    }
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

export async function addToWatchList({userId, showId}: {showId: string, userId: string}): Promise<boolean> {
    
    const supabase = await createClient();
    const error = (await supabase.from("UserShowDetails").insert({userId: userId, showId: showId, currentSeason: 1, status: 3})).error;
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

export async function updateUserShowData({updateType, userId, showId, newValue }: {updateType: UserUpdateCategory, userId: string, showId: string, newValue: number | Rating | Status | undefined }): Promise<boolean> {
    let response = true;
    let update: UserUpdate | null = null;
    switch (updateType) {
        case UserUpdateCategory.AddedToWatchlist:
            response = await addToWatchList({userId: userId, showId: showId});
            if (response) update = {
                id: -1, userId: userId, showId: Number(showId), updateType: UserUpdateCategory.AddedToWatchlist, updateDate: new Date(), hidden: false
            };
            break;
        case UserUpdateCategory.ChangedRating:
            response = await updateRating({userId: userId, showId: showId, newRating: newValue as Rating});
            if (response) update = {
                id: -1, userId: userId, showId: Number(showId), ratingChange: newValue as Rating, updateType: UserUpdateCategory.ChangedRating,updateDate: new Date(), hidden: false
            };
            break;
        case UserUpdateCategory.ChangedSeason:
            response = await updateCurrentSeason({userId: userId, showId: showId, newSeason: newValue as number});
            if (response) update = {
                id: -1, userId: userId, showId: Number(showId), seasonChange: newValue as number, updateType: UserUpdateCategory.ChangedSeason,updateDate: new Date(), hidden: false
            };
            break;
        case UserUpdateCategory.RemovedFromWatchlist:
            // TODO
            break;
        case UserUpdateCategory.RemovedRating:
            response = await updateRating({userId: userId, showId: showId, newRating: newValue as Rating});
            if (response) update ={ 
                id: -1, userId: userId, showId: Number(showId), updateType: UserUpdateCategory.RemovedRating,updateDate: new Date(), hidden: false
            };
            break;
        case UserUpdateCategory.UpdatedStatus:
            response = await updateStatus({userId: userId, showId: showId, newStatus: newValue as Status});
            if (response) update = {
                id: -1, userId: userId, showId: Number(showId), statusChange: newValue as Status, updateType: UserUpdateCategory.UpdatedStatus,updateDate: new Date(), hidden: false
            };
            break;
        default:
            response = false;
            break;
    }
    if (update && response) {
        response = await insertUpdate({update: update});
    }
    return response

}

export async function insertUpdate({update}: {update: UserUpdate}): Promise<boolean> {

    type UserUpdateInsert = {
        id: number | undefined;
        userId: string;
        showId: number;
        statusChange?: number;
        seasonChange?: number;
        ratingChange?: Rating;
        updateDate: Date;
        updateType: UserUpdateCategory;
    }
    
    const supabase = await createClient();
    const updateData = update as unknown as UserUpdateInsert;
    updateData.id = undefined;
    if (update.updateType === UserUpdateCategory.UpdatedStatus) updateData.statusChange = update.statusChange!.id;

    const { error } = await supabase.from("UserUpdate").insert(updateData);
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

export async function toggleUpdateHiddenStatus({updateId}: {updateId: number}): Promise<boolean> {
    
    const supabase = await createClient();
    
    // First get the current hidden status
    const { data: currentData, error: fetchError } = await supabase
        .from("UserUpdate")
        .select("hidden")
        .match({id: updateId})
        .single();
    
    if (fetchError) {
        console.error(fetchError);
        return false;
    }
    
    // Toggle the hidden status
    const newHiddenStatus = !(currentData?.hidden || false);
    
    const { error: updateError } = await supabase
        .from("UserUpdate")
        .update({hidden: newHiddenStatus})
        .match({id: updateId});
    
    if (updateError) {
        console.error(updateError);
        return false;
    }
    
    return true;
}