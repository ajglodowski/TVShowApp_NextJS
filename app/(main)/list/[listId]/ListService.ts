import { convertRawShowAnalyticsToShowWithAnalytics } from "@/app/models/show";
import { ShowList, ShowListEntry, ShowListEntryParams, ShowListParams } from "@/app/models/showList";
import { createClient, publicClient } from "@/app/utils/supabase/server";

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

    const mappedEntryData: ShowListEntry[] = entryData.map((entry) => {
        return {
            ...entry,
            show: convertRawShowAnalyticsToShowWithAnalytics(entry.show_analytics)
        }
    });
    return mappedEntryData;
}

export async function getListData(listId: number): Promise<ShowList | null> {
    const supabase = await publicClient();
    const { data: listData } = await supabase.from("showList").select().match({id: listId}).single();
    if (!listData) return null;
    const showList = listData as unknown as ShowList;
    return showList;
}

export async function getListEntries(listId: number, limit: number| null): Promise<ShowListEntry[] | null> {
    const supabase = await publicClient();
    let baseQuery = supabase.from("ShowListRelationship").select('id, show: showId (name, releaseDate, id, pictureUrl), created_at, listId, position').match({listId: listId});
    if (limit) baseQuery = baseQuery.limit(limit);
    baseQuery = baseQuery.order('position', {ascending: true});
    const { data: showData } = await baseQuery;
    if (!showData) return null;
    const showList = showData.map((obj) => obj as unknown as ShowListEntry);
    return showList;
}

// export async function fetchShowListData(listId: string): Promise<{ listData: OriginalShowList | null, entries: TypedShowListEntry[] | null }> {
//     console.log(`Fetching list data for ID: ${listId}`);
//     const supabase = await createClient();

//     const { data: listData, error: listError } = await supabase
//         .from('showList')
//         .select('id, name, description, ordered, private, creator, created_at, updated_at')
//         .match({ id: listId }) // Match based on the string UUID
//         .single();

//     if (listError) {
//         console.error('Error fetching list data:', listError);
//         throw new Error(`Failed to fetch list details: ${listError.message}`);
//     }
//     if (!listData) {
//         return { listData: null, entries: null }; // List not found
//     }

//     const { data: entryData, error: entryError } = await supabase
//         .from('ShowListRelationship')
//         // Select the nested show data explicitly
//         .select('id, listId, show:showId(id, name, pictureUrl), position, created_at')
//         .match({ listId: listId }) // Match based on the string UUID
//         .order('position', { ascending: true });

//     if (entryError) {
//         console.error('Error fetching list entries:', entryError);
//         console.warn('Failed to fetch list entries, proceeding with list details only.')
//         // Return listData but indicate entry fetch failure
//         return { listData: listData as OriginalShowList, entries: null };
//     }

//     // Cast the fetched entries to our more specific type
//     const entries = (entryData as unknown as TypedShowListEntry[]) || [];

//     return { listData: listData as OriginalShowList, entries };
// }