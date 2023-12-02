import { Service } from "./service";
import { ShowLength } from "./showLength";

export type Show = {
    id: number;
    name: string;
    created_at: Date;
    length: ShowLength;
    limitedSeries: boolean;
    currentlyAiring: boolean;
    running: boolean;
    service: Service;
    totalSeasons: number;
}