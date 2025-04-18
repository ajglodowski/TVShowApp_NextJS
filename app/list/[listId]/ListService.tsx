import { ShowList, ShowListEntry, ShowListEntryParams, ShowListParams } from "@/app/models/showList";
import { createClient } from "@/app/utils/supabase/server";

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

export async function getListData(listId: number): Promise<ShowList | null> {
    const supabase = await createClient();
    const { data: listData } = await supabase.from("showList").select().match({id: listId}).single();
    if (!listData) return null;
    const showList = listData as unknown as ShowList;
    return showList;
}

export async function getListEntries(listId: number, limit: number| null): Promise<ShowListEntry[] | null> {
    const supabase = await createClient();
    let baseQuery = supabase.from("ShowListRelationship").select('id, show: showId (name, releaseDate, id, pictureUrl), created_at, listId, position').match({listId: listId});
    if (limit) baseQuery = baseQuery.limit(limit);
    baseQuery = baseQuery.order('position', {ascending: true});
    const { data: showData } = await baseQuery;
    if (!showData) return null;
    const showList = showData.map((obj) => obj as unknown as ShowListEntry);
    return showList;
}