import { AirDate } from "./airDate";
import { OtherService, Service } from "./service";
import { ShowLength } from "./showLength";

export type Show = {
    id: number;
    name: string;
    created_at: Date;
    lastUpdated: Date;
    length: ShowLength;
    limitedSeries: boolean;
    currentlyAiring: boolean;
    running: boolean;
    service: Service;
    totalSeasons: number;
    airdate: AirDate | undefined;
    releaseDate: Date | undefined;
}

export const NewShow: Show = {
    id: 0,
    name: "",
    created_at: new Date(),
    lastUpdated: new Date(),
    length: ShowLength.NONE,
    limitedSeries: false,
    currentlyAiring: false,
    running: false,
    service: OtherService,
    totalSeasons: 1,
    airdate: undefined,
    releaseDate: undefined
}