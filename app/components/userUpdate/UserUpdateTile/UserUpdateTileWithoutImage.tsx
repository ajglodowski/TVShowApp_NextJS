import { UserUpdateTileDTO } from "../UserUpdateService";
import { LoadingImageSkeleton } from "../../image/LoadingImageSkeleton";
import UserUpdateTileBody from "./UserUpdateTileBody";

type UserUpdateTileProps = { updateDto: UserUpdateTileDTO; };

export default async function UserUpdateTileWithoutImage(props: UserUpdateTileProps) {
    const updateData = props.updateDto;
    return (
        <div className="flex rounded-lg h-24 w-72">
            <div className="w-24 h-24 mx-auto ">
                <LoadingImageSkeleton />;
            </div>
            <UserUpdateTileBody updateDto={updateData}/>
        </div>
    );
};