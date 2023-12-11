import { Rating } from "./rating";
import { Status } from "./status";

export type UserShowData = {
    userId: string;
    showId: string;
    status: Status;
    updated: Date;
    currentSeason: number;
    rating: Rating;
    created_at: Date;
}