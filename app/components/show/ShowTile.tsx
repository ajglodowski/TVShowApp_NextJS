import { Show } from "@/app/models/show";
import { getShow, getShowImage } from "@/app/show/[showId]/ShowService";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

type ShowTileProps =
    { showId: string; } | 
    { showDto: Show; };

export default async function ShowTile(props: ShowTileProps) {

    let showData;
    if ('showDto' in props) showData = props.showDto;
    else showData = await getShow(props.showId) as Show;
    const showId = showData.id;

    const show = showData as Show;
    const showImageInfo = await getShowImage(show.name, true);
    const showImageUrl = showImageInfo?.imageUrl;
    const backgroundColor = showImageInfo?.averageColor;

    if (!showData) {
        return <div key={showId}>Show not found</div>
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
                            <Image src={showImageUrl} alt={show.name} width="0"
                                height="0"
                                sizes="100vw"
                                className="w-full h-full rounded-lg shadow-md"
                            />
                        </div>
            );
        } else {
            return <LoadingImageSkeleton />;
        }
    }

    return (
        <Link key={showId} href={`show/${showId}`}>
            <div key={showId} className="inline-block rounded-lg w-42 h-42 shadow-xl" style={{ backgroundColor: backgroundColor }}>
                <div className="h-full w-full items-center text-center justify-center">
                    <div className="w-32 h-32 mx-auto items-center">
                        <Suspense fallback={<LoadingImageSkeleton />}>
                            <ShowImage/>
                        </Suspense>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{show.name}</h2>
                        <span className="flex justify-evenly text-lg">
                            <p>{show.length}m</p>
                            <p>{show.service.name}</p>
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};