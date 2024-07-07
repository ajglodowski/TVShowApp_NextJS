import { createClient } from "@/utils/supabase/client";

export async function searchShows({searchQuery}: {searchQuery: string}): Promise<string[] | null> {
    'use client'
    const supabase = createClient();

    const { data } = await supabase.from('show').select('id').textSearch('name', `'${searchQuery}'`);
    
    if (!data) return null;
    const showIds = data.map((obj) => obj.id);
    
    return showIds;
}