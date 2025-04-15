'use client'
import { Show } from "@/app/models/show";
import { ShowImage } from "@/app/models/showImage";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LoadingImageSkeleton } from "../../image/LoadingImageSkeleton";
import { getPresignedShowImageURL, getShow } from "../ClientShowService";

export default function ClientShowTile({ showId }: { showId: string }) {

    const [showData, setShowData] = useState<Show | null | undefined>(undefined);
    const [showImageInfo, setShowImageInfo] = useState<ShowImage | null>(null);
    const show = showData as Show;
    const showImageUrl = showImageInfo?.imageUrl;

    useEffect(() => {
        const fetchShowData = async () => {
            const showData = await getShow(showId);
            if (!showData) setShowData(null);
            else setShowData(showData as Show);
        };
        fetchShowData();
    },[]);

    useEffect(() => {
        const fetchImageUrl = async () => {
            if (!show) return;
            if (show.pictureUrl) {
                const imageUrl = await getPresignedShowImageURL(show.pictureUrl, true);
                setShowImageInfo({ imageUrl, averageColor: "rgb(0,0,0)" } as ShowImage);
            }
        };

        fetchImageUrl();
    }, [showData]);
    
    const ShowInfo = () => {

        if (showData === undefined) return <div>Loading show</div>

        if (showData === null){ console.log(showId); console.log(showData); return <div>Show not found</div> }

        return(
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3">
                <h3 className="font-medium text-sm line-clamp-1">{show.name}</h3>
                {(show.length || show.service.name) && (
                <div className="flex items-center gap-2 mt-1">
                    {show.length && (
                    <div className="flex items-center text-xs text-white/60">
                        <Clock className="mr-1 h-3 w-3" />
                        {show.length}m
                    </div>
                    )}
                    {show.service && <div className="text-xs text-white/60">{show.service.name}</div>}
                </div>
                )}
            </div>
        )
    }

    const ShowImage = () => {
            if (!showImageUrl) return <LoadingImageSkeleton />;
            return (
                <div className="relative w-full h-full">
                    <Image 
                        src={showImageUrl || "/placeholder.svg"} 
                        alt={show.name}
                        fill
                        sizes="128px"
                        className="object-cover rounded-lg shadow-md"
                        unoptimized={true}
                    />
                </div>
            );
        }


    return (
        <Link href={`/show/${showId}`}>
            {/* <div key={showId} className="inline-block rounded-lg w-32 h-42 shadow-xl" style={{ backgroundColor: backgroundColor }}> */}
            <div
                className="group w-48 h-48 overflow-hidden rounded-lg bg-white/5 transition-all hover:bg-white/10 cursor-pointer relative"
            >
                <div className="h-full w-full items-center text-center justify-center">
                    <div className="aspect-square overflow-hidden">
                        <ShowImage/>
                    </div>
                    <div className="text-ellipsis overflow-hidden text-left px-2">
                        <ShowInfo />
                    </div>
                </div>
            </div>
        </Link>
    );
};