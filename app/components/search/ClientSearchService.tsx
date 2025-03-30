import { createClient } from "@/app/utils/supabase/client";

export async function searchShows({searchQuery}: {searchQuery: string}): Promise<string[] | null> {
    'use client'
    const supabase = createClient();

    const { data } = await supabase.from('show').select('id').ilike('name', `%${searchQuery}%`).limit(5);
    
    if (!data) return null;
    const showIds = data.map((obj) => obj.id);
    
    return showIds;
}