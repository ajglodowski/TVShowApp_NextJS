import Link from "next/link";
import { UserUpdateTileDTO, getUserUpdate } from "../UserUpdateService";
import UserUpdateTileWithImage from "./UserUpdateTileWithImage";
import { Skeleton } from "@/components/ui/skeleton";
type UserUpdateTileProps =
    { updateId: number; } | 
    { updateDto: UserUpdateTileDTO; };

export default async function UserUpdateTile(props: UserUpdateTileProps) {

    let updateData;
    if ('updateDto' in props) updateData = props.updateDto;
    else updateData = await getUserUpdate(props.updateId);
    if (!updateData) {
        return <div>Error Loading update</div>
    }
    const update = updateData.userUpdate;
    return (
        <Link key={update.showId} href={`/show/${update.showId}`}>
            <UserUpdateTileWithImage updateDto={updateData}/>
        </Link>
    );
};

export async function LoadingUserUpdateTile() {
    return (
        <Skeleton className="relative flex-shrink-0 w-48 h-48 overflow-hidden rounded-xl" />
    )
}