import { getShowImage } from "@/app/show/[showId]/ShowService";
import Image from "next/image";
import { Suspense } from "react";
import { UserUpdateTileDTO } from "../UserUpdateService";
import { LoadingImageSkeleton } from "../../image/LoadingImageSkeleton";
import UserUpdateTileBody from "./UserUpdateTileBody";

type UserUpdateTileProps = { updateDto: UserUpdateTileDTO; };

export default async function UserUpdateTileWithImage(props: UserUpdateTileProps) {

    const updateData = props.updateDto;
    const showName = updateData.showName
    const showImageInfo = await getShowImage(showName, true);
    const showImageUrl = showImageInfo?.imageUrl;
    const backgroundColor = showImageInfo?.averageColor;

    const ShowImage = () => {
        if (showImageUrl) {
            return (
                <div className="relative">
                    <Image src={showImageUrl} alt={showName} width="0"
                        height="0"
                        sizes="100vw"
                        className="w-full h-full rounded-lg shadow-[rgba(0,0,0,0.2)_10px_0px_5px_0px]"
                    />
                </div>
            );
        } else {
            return <LoadingImageSkeleton />;
        }
    }

    return (
        <div className="flex rounded-lg h-24 w-72" style={{ backgroundColor: backgroundColor }}>
            <div className="w-24 h-24 mx-auto ">
                <Suspense fallback={<LoadingImageSkeleton />}>
                    <ShowImage/>
                </Suspense>
            </div>
            <UserUpdateTileBody updateDto={updateData}/>
        </div>
    );
};