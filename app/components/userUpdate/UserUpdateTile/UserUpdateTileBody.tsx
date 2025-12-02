import { UserUpdateTileDTO } from "../UserUpdateService";
import { LocalizedDate } from "@/app/components/LocalizedDate";
import { UserUpdateCategory } from "@/app/models/userUpdateType";
import ProfileBubble from "../../user/ProfileBubble";

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
        <div className="">
            <h2 className="font-medium text-sm truncate">{showName}</h2>
            <h2 className="text-xs text-white/70 truncate">{updateMessage()}</h2>
            <h2 className="text-xs text-white/60"><LocalizedDate date={update.updateDate} /></h2>
            <ProfileBubble userId={update.userId}/>
        </div>
    );
};