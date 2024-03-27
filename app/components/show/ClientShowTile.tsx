'use client'
import { Show } from "@/app/models/show";
import { ShowImage } from "@/app/models/showImage";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getShow, getShowImage } from "./ClientShowService";
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
        getShowImage(show.name, true).then((showImageInfo) => {
            if (!showImageInfo) setShowImageInfo(null);
            else setShowImageInfo(showImageInfo as ShowImage);
        });
    },[showData]);
    
    const ShowInfo = () => {

        if (showData === undefined) return <div>Loading show</div>

        if (showData === null){ console.log(showId); console.log(showData); return <div>Show not found</div> }

        return(
            <>
                <h2 className="text-xl font-bold">{show.name}</h2>
                <span className="flex justify-evenly text-lg">
                    <p>{show.length}m</p>
                    <p>{show.service.name}</p>
                </span>
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
                    <div className="text-ellipsis overflow-hidden">
                        <ShowInfo />
                    </div>
                </div>
            </div>
        </Link>
    );
};