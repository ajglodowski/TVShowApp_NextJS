import { fetchAverageColor, getShowImage, getShowImageURL } from "@/app/show/[showId]/ShowService";
import Image from "next/image";
import { Suspense } from "react";
import { UserUpdateTileDTO } from "../UserUpdateService";
import { LoadingImageSkeleton } from "../../image/LoadingImageSkeleton";
import UserUpdateTileBody from "./UserUpdateTileBody";

type UserUpdateTileProps = { updateDto: UserUpdateTileDTO; };

export default async function UserUpdateTileWithImage(props: UserUpdateTileProps) {

    const updateData = props.updateDto;
    const showName = updateData.showName
    const showImageUrl = getShowImageURL(showName, true);

    const ShowImage = () => {
        if (!showImageUrl) return <LoadingImageSkeleton />;
        return (
            <div className="relative w-full h-full">
                <Image 
                    src={showImageUrl || "/placeholder.svg"} 
                    alt={updateData.showName}
                    fill
                    //sizes="128px"
                    className="w-full aspect-square rounded-xl object-cover"
                />
            </div>
        );
    }

    return (
        <div className="relative flex-shrink-0 w-48 h-48 overflow-hidden rounded-xl">
            <Suspense fallback={<LoadingImageSkeleton />}>
                <ShowImage/>
            </Suspense>
            <div className="absolute bottom-0 left-0 right-0 rounded-xl backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60 p-2">
                <UserUpdateTileBody updateDto={updateData}/>
            </div>
        </div>
    );
};