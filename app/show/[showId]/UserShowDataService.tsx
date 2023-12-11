import { cookies } from "next/headers";
import { createClient } from '@/utils/supabase/server';
import { Status } from "@/app/models/status";
import { UserShowData } from "@/app/models/userShowData";
import { Rating } from "@/app/models/rating";
import { UserUpdate } from "@/app/models/userUpdate";

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
    const { data: updateData } = await supabase.from("UserUpdate").select().match({userId: userId, showId: showId});
    
    if (!updateData) return null;   
  
    const ouput: UserUpdate[] = updateData as unknown as UserUpdate[];
    
    return ouput;
}