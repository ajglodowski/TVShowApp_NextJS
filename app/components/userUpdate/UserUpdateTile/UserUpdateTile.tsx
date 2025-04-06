import Link from "next/link";
import { UserUpdateTileDTO, getUserUpdate } from "../UserUpdateService";
import UserUpdateTileWithImage from "./UserUpdateTileWithImage";

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
        <Link key={update.showId} href={`show/${update.showId}`}>
            {/*
            
            <Suspense fallback={<UserUpdateTileWithoutImage updateDto={updateData}/>}>
                <UserUpdateTileWithImage updateDto={updateData}/>
            </Suspense>
            */}
            <UserUpdateTileWithImage updateDto={updateData}/>
        </Link>
    );
};