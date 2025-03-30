import { ChangedRatingUpdate, ChangedSeasonUpdate, UpdatedStatusUpdate, UserUpdate } from "@/app/models/userUpdate";
import { UserUpdateCategory } from "@/app/models/userUpdateType";

export function getUserUpdateMessage(update: UserUpdate): string {
    switch (update.updateType as UserUpdateCategory) {
        case UserUpdateCategory.ChangedSeason:
            const changeSeasonUpdate = update as ChangedSeasonUpdate;
            return `Changed season to ${changeSeasonUpdate.seasonChange}`;
        case UserUpdateCategory.AddedToWatchlist:
            return `Added to Watchlist`;
        case UserUpdateCategory.UpdatedStatus:
            const statusUpdate = update as UpdatedStatusUpdate;
            return `Updated status to ${statusUpdate.statusChange.name}`;
        case UserUpdateCategory.RemovedFromWatchlist:
            return `Removed from your watchlist`;
        case UserUpdateCategory.ChangedRating:
            const ratingUpdate = update as ChangedRatingUpdate;
            return `Rated ${ratingUpdate.ratingChange}`;
        case UserUpdateCategory.RemovedRating:
            return `Removed rating`;
        default:
            return `Update Type Error`;
    }
}