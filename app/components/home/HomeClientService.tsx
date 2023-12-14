import { Rating } from "@/app/models/rating";
import { Status } from "@/app/models/status";
import { UserShowData } from "@/app/models/userShowData";
import { createClient } from "@/utils/supabase/client";

export async function getYourShows({userId, selectedStatuses}: {userId: string, selectedStatuses: Status[]}): Promise<UserShowData[] | null> {
    'use client'
    if (!userId) return null;

    var statusesString = "(";
    for (const status of selectedStatuses) {
        statusesString += status.id.toString() + ",";
    }
    statusesString = statusesString.slice(0, -1);
    statusesString += ")";
    console.log(statusesString);

    const supabase = createClient();
    var response = null;
    if (selectedStatuses.length === 0) response = await supabase.from("UserShowDetails").select('userId, showId, created_at, updated, currentSeason, rating, status (id, name)').match({userId: userId}).limit(15);
    else response = await supabase.from("UserShowDetails").select('userId, showId, created_at, updated, currentSeason, rating, status (id, name)').match({userId: userId}).filter('status', 'in', statusesString).limit(15);
    
    if (!response) return null;
    const showData = response.data as unknown as UserShowData[];

    if (!showData) {
        console.error(response.error);
        return null;   
    }
    console.log(showData);

    const output: UserShowData[] = [];
    for (const show of showData) {
        const converted: UserShowData = {
            ...show,
            status: show.status as unknown as Status,
            rating: show.rating as unknown as Rating
        };
        output.push(converted);
    }
    console.log(output);
    
    return output;
}

export async function getAllStatuses(): Promise<Status[]|null> {
    'use client';
    const supabase = createClient();
    const { data } = await supabase.from("status").select();
    const statuses = data as unknown as Status[];
    console.log(statuses);
    return statuses;
}