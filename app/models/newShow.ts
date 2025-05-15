import { Show } from "./show";

import { OtherService } from "./service";
import { ShowLength } from "./showLength";

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
    releaseDate: undefined,
    pictureUrl: null
}