import { getPresignedShowImageURL } from "@/app/show/[showId]/ShowService";
import Image from "next/image";
import { Suspense } from "react";
import { LoadingImageSkeleton } from "../../image/LoadingImageSkeleton";
import { UserUpdateTileDTO } from "../UserUpdateService";
import UserUpdateTileBody from "./UserUpdateTileBody";

type UserUpdateTileProps = { updateDto: UserUpdateTileDTO; };

export default async function UserUpdateTileWithImage(props: UserUpdateTileProps) {

    const updateData = props.updateDto;
    const showName = updateData.showName
    let showImageUrl: string | null = null;
    if (updateData.showPictureUrl) {
        showImageUrl = await getPresignedShowImageURL(updateData.showPictureUrl, true);
    }

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
            <div className="absolute bottom-0 left-0 right-0 rounded-xl backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60 px-2 py-1">
                <UserUpdateTileBody updateDto={updateData}/>
            </div>
        </div>
    );
};