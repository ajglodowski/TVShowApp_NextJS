import { Show, ShowPropertiesWithService } from "./show";

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
    show: Show;
    position: number;
    created_at: Date;
}

export const ShowListParams = 'id, name, description, ordered, private, creator, created_at, updated_at';
export const ShowListEntryParams = `id, listId, show (${ShowPropertiesWithService}), position, created_at`;