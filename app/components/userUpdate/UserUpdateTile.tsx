import { Show } from "@/app/models/show";
import { getShow, getShowImage } from "@/app/show/[showId]/ShowService";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getUserUpdate } from "./UserUpdateService";
import { dateToString } from "@/utils/timeUtils";
import { UserUpdateCategory } from "@/app/models/userUpdateType";

export default async function UserUpdateTile({ updateId }: { updateId: number }) {

    const updateData = await getUserUpdate(updateId);
    if (!updateData) {
        return <div key={updateId}>Error Loading update</div>
    }
    const update = updateData.userUpdate;
    const showName = updateData.showName
    const showImageInfo = await getShowImage(showName, true);
    const showImageUrl = showImageInfo?.imageUrl;
    const backgroundColor = showImageInfo?.averageColor;

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

    const LoadingImageSkeleton = () => {
        return (
            <div className="w-full h-full">
                <Skeleton className="h-full w-full rounded-md" />
            </div>
        );
    }

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
        <Link key={update.showId} href={`show/${update.showId}`}>
            <div className="flex rounded-lg h-24 w-72" style={{ backgroundColor: backgroundColor }}>
                <div className="w-24 h-24 mx-auto ">
                    <Suspense fallback={<LoadingImageSkeleton />}>
                        <ShowImage/>
                    </Suspense>
                </div>
                <div className="p-1 w-48 whitespace-normal mx-auto my-auto">
                    <h2 className="text-xl font-bold">{showName}</h2>
                    <h2 className="text-sm text-pretty">{updateMessage()}</h2>
                    <h2 className="text-sm">{dateToString(update.updateDate)}</h2>

                </div>
            </div>
        </Link>
    );
};