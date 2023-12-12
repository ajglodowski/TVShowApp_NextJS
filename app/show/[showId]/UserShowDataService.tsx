import { cookies } from "next/headers";
import { createClient } from '@/utils/supabase/server';
import { Status } from "@/app/models/status";
import { UserShowData } from "@/app/models/userShowData";
import { Rating } from "@/app/models/rating";
import { ChangedRatingUpdate, UserUpdate } from "@/app/models/userUpdate";
import { UserUpdateCategory } from "@/app/models/userUpdateType";

export async function getUserShowData({showId, userId}: {showId: string, userId: string | undefined}): Promise<UserShowData | null> {

    if (!userId) return null;
  
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const { data: showData } = await supabase.from("UserShowDetails").select('userId, showId, created_at, updated, currentSeason, rating, status (id, name)').match({userId: userId, showId: showId}).single();
    
    if (!showData) return null;   
  
    const ouput: UserShowData = {
        ...showData,
        status: showData.status as unknown as Status,
        rating: showData.rating as unknown as Rating
    };
    
    return ouput;
}

export async function updateCurrentSeason({userId, showId, newSeason}: {showId: string, userId: string, newSeason: number}): Promise<boolean> {
    "use server";    
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const { error} = await supabase.from("UserShowDetails").update({currentSeason: newSeason}).match({userId: userId, showId: showId});
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

export async function updateStatus({userId, showId, newStatus}: {showId: string, userId: string, newStatus: Status}): Promise<boolean> {
    "use server";    
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const { error} = await supabase.from("UserShowDetails").update({status: newStatus.id}).match({userId: userId, showId: showId});
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

export async function getAllStatuses(): Promise<Status[]|null> {
    "use server";    
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const { data } = await supabase.from("status").select();
    const statuses = data as unknown as Status[];
    return statuses;
}

export async function getUserUpdates({showId, userId}: {showId: string, userId: string | undefined}): Promise<UserUpdate[]|null> {
    if (!userId) return null;
  
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const { data: updateData } = await supabase.from("UserUpdate").select('id, userId, showId, status:statusChange(id, name), seasonChange, ratingChange, updateDate, updateType').match({userId: userId, showId: showId});

    if (!updateData) return null;

    const updates = [];
    for (const update of updateData) {
        let formatted = {
            ...update,
            statusChange: update.status as unknown as Status,
            status: undefined,
        }
        updates.push(formatted);
    }
   
    return updates as unknown as UserUpdate[];
}

export async function updateRating({userId, showId, newRating}: {showId: string, userId: string, newRating: Rating | null}): Promise<boolean> {
    "use server";    
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    var error = null;
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

export async function updateUserShowData({updateType, userId, showId, newValue }: {updateType: UserUpdateCategory, userId: string, showId: string, newValue: number | Rating | Status | undefined }): Promise<boolean> {
    "use server";
    var response = true;
    var update: UserUpdate | null = null;
    switch (updateType) {
        case UserUpdateCategory.AddedToWatchlist:
            // TODO
        case UserUpdateCategory.ChangedRating:
            response = await updateRating({userId: userId, showId: showId, newRating: newValue as Rating});
            if (response) update = {
                id: -1, userId: userId, showId: Number(showId), ratingChange: newValue as Rating, updateType: UserUpdateCategory.ChangedRating,updateDate: new Date()
            };
            break;
        case UserUpdateCategory.ChangedSeason:
            response = await updateCurrentSeason({userId: userId, showId: showId, newSeason: newValue as number});
            if (response) update = {
                id: -1, userId: userId, showId: Number(showId), seasonChange: newValue as number, updateType: UserUpdateCategory.ChangedSeason,updateDate: new Date()
            };
            break;
        case UserUpdateCategory.RemovedFromWatchlist:
            // TODO
            break;
        case UserUpdateCategory.RemovedRating:
            response = await updateRating({userId: userId, showId: showId, newRating: newValue as Rating});
            if (response) update ={ 
                id: -1, userId: userId, showId: Number(showId), ratingChange: newValue as Rating, updateType: UserUpdateCategory.ChangedRating,updateDate: new Date()
            };
            break;
        case UserUpdateCategory.UpdatedStatus:
            console.log("Updating status")
            response = await updateStatus({userId: userId, showId: showId, newStatus: newValue as Status});
            if (response) update = {
                id: -1, userId: userId, showId: Number(showId), statusChange: newValue as Status, updateType: UserUpdateCategory.UpdatedStatus,updateDate: new Date()
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
    "use server";    
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    var updateData = update as unknown as any;
    updateData.id = undefined;
    if (updateData.updateType === UserUpdateCategory.UpdatedStatus) updateData.statusChange = updateData.statusChange.id;

    const { error } = await supabase.from("UserUpdate").insert(updateData);
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}