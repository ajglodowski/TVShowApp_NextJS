import { ShowList, ShowListEntry, ShowListEntryParams, ShowListParams } from "@/app/models/showList";
import { createClient } from "@/utils/supabase/server";

export async function getList( listId: string ): Promise<ShowList | null> {
    
    const supabase = await createClient();
    const { data: listData } = await supabase.from("showList").select(ShowListParams).match({id: listId}).single();
    
    if (!listData) return null;   

    const list: ShowList = listData;
    
    return list;
}

export async function getShowsForList( listId: string ): Promise<ShowListEntry[] | null> {
    
    const supabase = await createClient();
    const { data: entryData } = await supabase.from("ShowListRelationship").select(ShowListEntryParams).match({listId: listId});
    if (!entryData) return null;   

    const output: ShowListEntry[] = entryData as unknown as ShowListEntry[];
    
    return output;
}