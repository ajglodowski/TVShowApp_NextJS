import { Rating } from "./rating";
import { Show } from "./show";
import { Status } from "./status";

export type UserShowDataExpanded = {
    userId: string;
    show: Show;
    status: Status;
    updated: Date;
    currentSeason: number;
    rating: Rating;
    created_at: Date;
}