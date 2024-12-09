import { UserUpdateTileDTO } from "../UserUpdateService";
import { dateToString } from "@/utils/timeUtils";
import { UserUpdateCategory } from "@/app/models/userUpdateType";

type UserUpdateTileBodyProps = { updateDto: UserUpdateTileDTO; };

export default async function UserUpdateTileBody(props: UserUpdateTileBodyProps) {
    const updateData = props.updateDto;
    const update = updateData.userUpdate;
    const showName = updateData.showName

    const updateMessage = ():string => {
        switch (update.updateType) {
            case UserUpdateCategory.AddedToWatchlist:
                return `Added to watchlist`;
            case UserUpdateCategory.ChangedRating:
                return `Changed rating to ${update.ratingChange}`;
            case UserUpdateCategory.ChangedSeason:
                return `Changed season to ${update.seasonChange}`;
            case UserUpdateCategory.RemovedFromWatchlist:
                return `Removed from watchlist`;
            case UserUpdateCategory.RemovedRating:
                return `Removed rating`;
            case UserUpdateCategory.UpdatedStatus:
                return `Updated status to ${update.statusChange.name}`;
            default:
                return `Unknown update type`;
        }
    }

    return (
        <div className="p-1 w-48 whitespace-normal mx-auto my-auto">
            <h2 className="text-xl font-bold truncate">{showName}</h2>
            <h2 className="text-sm text-pretty">{updateMessage()}</h2>
            <h2 className="text-sm">{dateToString(update.updateDate)}</h2>
        </div>
    );
};