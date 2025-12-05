import { ShowAnalyticsProperties, ShowWithAnalytics } from "./show";

export type ShowList = {    
    id: string;
    name: string;
    description: string;
    //shows: string[];
    ordered: boolean;
    private: boolean;
    creator: string;
    created_at: Date;
    updated_at: Date | undefined;
}

export type ShowListEntry = {
    id: string;
    listId: string;
    show: ShowWithAnalytics;
    position: number;
    created_at: Date;
}

export const ShowListParams = 'id, name, description, ordered, private, creator, created_at, updated_at';
export const ShowListEntryParams = `id, listId, show_analytics (${ShowAnalyticsProperties}), position, created_at`;