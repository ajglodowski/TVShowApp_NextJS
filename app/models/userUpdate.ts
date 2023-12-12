import { Rating } from "./rating";
import { Status } from "./status";
import { UserUpdateCategory } from "./userUpdateType";

export type UserUpdate = AddedToWatchlistUpdate | UpdatedStatusUpdate | RemovedFromWatchlistUpdate | ChangedRatingUpdate | ChangedSeasonUpdate | RemovedRatingUpdate;

export type UserUpdateBase = {
    id: number;
    userId: string;
    showId: number;
    updateType: UserUpdateCategory;
    updateDate: Date;
}

export interface AddedToWatchlistUpdate extends UserUpdateBase {
    updateType: UserUpdateCategory.AddedToWatchlist;
}

export interface UpdatedStatusUpdate extends UserUpdateBase {
    updateType: UserUpdateCategory.UpdatedStatus;
    statusChange: Status;
}

export interface RemovedFromWatchlistUpdate extends UserUpdateBase {
    updateType: UserUpdateCategory.RemovedFromWatchlist;
}

export interface ChangedRatingUpdate extends UserUpdateBase {
    updateType: UserUpdateCategory.ChangedRating;
    ratingChange: Rating;
}

export interface ChangedSeasonUpdate extends UserUpdateBase {
    updateType: UserUpdateCategory.ChangedSeason;
    seasonChange: number;
}

export interface RemovedRatingUpdate extends UserUpdateBase {
    updateType: UserUpdateCategory.RemovedRating;
}