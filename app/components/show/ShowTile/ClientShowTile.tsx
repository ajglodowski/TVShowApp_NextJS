'use client'
import { Show } from "@/app/models/show";
import { ShowImage } from "@/app/models/showImage";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchAverageColor, getShow, getShowImage, getShowImageURL } from "../ClientShowService";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientShowTile({ showId }: { showId: string }) {

    const [showData, setShowData] = useState<Show | null | undefined>(undefined);
    const [showImageInfo, setShowImageInfo] = useState<ShowImage | null>(null);
    const show = showData as Show;
    const showImageUrl = showImageInfo?.imageUrl;
    const backgroundColor = showImageInfo?.averageColor;

    useEffect(() => {
        getShow(showId).then((show) => {
            if (!show) setShowData(null);
            else setShowData(show as Show);
        });
    },[]);

    useEffect(() => {
        if (!show) return;
        const imageUrl = getShowImageURL(show.name, true);
        fetchAverageColor(imageUrl).then((averageColor) => {
            if (!averageColor) setShowImageInfo(null);
            else setShowImageInfo({imageUrl,averageColor} as ShowImage);
        });
    },[showData]);
    
    const ShowInfo = () => {

        if (showData === undefined) return <div>Loading show</div>

        if (showData === null){ console.log(showId); console.log(showData); return <div>Show not found</div> }

        return(
            <>
                <h2 className="text-lg font-semibold truncate">{show.name}</h2>
                <p className="text-sm truncate">{show.length}m · {show.service.name}</p>
            </>
        )

    }


    return (
        <Link href={`show/${showId}`}>
            <div key={showId} className="inline-block rounded-lg w-32 h-42 shadow-xl" style={{ backgroundColor: backgroundColor }}>
                <div className="h-full w-full items-center text-center justify-center">
                    <div className="w-32 h-32 mx-auto items-center">
                        {showImageUrl && <div className="relative">
                            <Image src={showImageUrl} alt={show.name} width="0"
                                height="0"
                                sizes="100vw"
                                className="w-full h-full rounded-lg shadow-md"
                            />
                        </div>}
                        { !showImageUrl && <div className="w-full h-full">
                            <Skeleton className="h-full w-full rounded-md" />
                        </div>}
                    </div>
                    <div className="text-ellipsis overflow-hidden text-left px-2">
                        <ShowInfo />
                    </div>
                </div>
            </div>
        </Link>
    );
};