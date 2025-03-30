import { createClient } from "@/app/utils/supabase/server";

export async function getUpdatesCreated( userId: string ): Promise<number | null> {
    const supabase = await createClient();
    const { count: count } = await supabase.from("UserUpdate").select('*', { count: 'exact', head: true }).match({userId: userId});
    
    if (!count) return null;   
    
    return count as number;
}

export async function getListsCreated( userId: string ): Promise<number | null> {
    const supabase = await createClient();
    const { count: count } = await supabase.from("showList").select('*', { count: 'exact', head: true }).match({creator: userId});
    
    if (!count) return null;   
    
    return count as number;
}
