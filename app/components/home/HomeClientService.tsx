import { Show, ShowPropertiesWithService } from "@/app/models/show";
import { Status } from "@/app/models/status";
import { createClient } from "@/app/utils/supabase/client";

export async function getYourShows({userId, selectedStatuses}: {userId: string, selectedStatuses: Status[]}): Promise<Show[] | null> {
    'use client'
    if (!userId) return null;

    let statusesString = "(";
    for (const status of selectedStatuses) {
        statusesString += status.id.toString() + ",";
    }
    statusesString = statusesString.slice(0, -1);
    statusesString += ")";

    const supabase = createClient();
    let response = null;
    if (selectedStatuses.length === 0) response = await supabase.from("UserShowDetails").select(`show (${ShowPropertiesWithService})`).match({userId: userId}).order('updated', {ascending: false}).limit(15);
    else response = await supabase.from("UserShowDetails").select(`show (${ShowPropertiesWithService})`).match({userId: userId}).filter('status', 'in', statusesString).order('updated', {ascending: false}).limit(15);
    
    if (response.data == null) return null;
    const showData = response.data.map((item: any) => {
        const show = item.show;
        return {
            ...show,
            services: (show.ShowServiceRelationship && show.ShowServiceRelationship.length > 0) 
                ? show.ShowServiceRelationship.map((r: any) => r.service) 
                : (show.service ? [show.service] : [])
        } as Show;
    });

    if (!showData) {
        console.error(response.error);
        return null;   
    }
    
    return showData;
}

