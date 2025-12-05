'use client'
import { getShowImageUrlAction } from "@/app/(main)/show/[showId]/ShowImageService";
import { Show } from "@/app/models/show";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getShow } from "../ClientShowService";
import ShowTileContent, { ShowTileBadgeProps } from "./ShowTileContent";
import ShowTileSkeleton from "./ShowTileSkeleton";

type ClientShowTileProps = 
    | { showId: string; badges?: ShowTileBadgeProps[] }
    | { showDto: Show; badges?: ShowTileBadgeProps[] };

export default function ClientShowTile(props: ClientShowTileProps) {

    const [showData, setShowData] = useState<Show | null>(('showDto' in props) ? props.showDto : null);
    // const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
    const presignedUrl = showData?.pictureUrl ? getShowImageUrlAction(showData.pictureUrl) : null;

    const showId = ('showDto' in props) ? props.showDto.id.toString() : props.showId;
    const badges = props.badges;

    useEffect(() => {
        const currentShowId = ('showDto' in props) ? props.showDto.id.toString() : props.showId;
        const initialShowData = ('showDto' in props) ? props.showDto : null;

        let isCancelled = false;

        const fetchData = async () => {
            let fetchedShowData: Show | null = initialShowData;
            const _fetchedUrl: string | null = null;

            try {
                if (!initialShowData) {
                    fetchedShowData = await getShow(currentShowId);
                    if (isCancelled) return;
                    if (fetchedShowData) {
                        setShowData(fetchedShowData);
                    } else {
                        console.error("Show not found for ID:", currentShowId);
                    }
                }
                /*
                if (fetchedShowData?.pictureUrl) {
                    fetchedUrl = await getPresignedShowImageURL(fetchedShowData.pictureUrl, true);
                    if (isCancelled) return;
                    setPresignedUrl(fetchedUrl);
                }
                    */

            } catch (err: unknown) {
                if (isCancelled) return;
                console.error("Error loading show tile data:", err);
                setShowData(null);
                //setPresignedUrl(null);
            } 
        };

        fetchData();

        return () => {
            isCancelled = true;
        };
    }, [('showDto' in props) ? props.showDto : props.showId]); 


    if (!showData) {
        return <ShowTileSkeleton />;
    }

    return (
        <Link href={`/show/${showId}`}>
            <ShowTileContent 
                showData={showData} 
                presignedUrl={presignedUrl} 
                badges={badges}
            />
        </Link>
    );
};