'use client';
import { Show } from "@/app/models/show";
import { ShowImage } from "@/app/models/showImage";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getShowImage } from "./ClientShowService";

type ShowTileContentProps = 
    { showData: Show; };

export default function ShowTileContent({showData}: ShowTileContentProps) {
    const showId = showData.id;
    const show = showData as Show;
    const [showImageInfo, setShowImageInfo] = useState<ShowImage | null>(null);
    const showImageUrl = showImageInfo?.imageUrl;
    const backgroundColor = showImageInfo?.averageColor;

    useEffect(() => {
        getShowImage(show.name, true).then((showImageInfo) => {
            if (!showImageInfo) setShowImageInfo(null);
            else setShowImageInfo(showImageInfo);
        });
    },[show]);


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
        <div key={showId} className="inline-block rounded-lg w-42 h-42 shadow-xl" style={{ backgroundColor: backgroundColor }}>
            <div className="h-full w-full items-center text-center justify-center">
                <div className="w-32 h-32 mx-auto items-center">
                    <ShowImage/>
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
    );
};