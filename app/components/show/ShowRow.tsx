'use client'

import { Show } from "@/app/models/show"
import { useEffect, useState } from "react";
import { getShowImage } from "./ClientShowService";
import { Skeleton } from "@/components/ui/skeleton";

export const ShowRow = ({ show }: { show: Show | undefined }) => {

    const [showData, setShowData] = useState<Show | undefined>(show as Show | undefined);
    const [showImageUrl, setShowImageUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (showData) return;
        setShowData(show);
    }, []);

    useEffect(() => {
        if (!showData) return;
        getShowImage(showData.name, true).then((res) => {
            if (res) setShowImageUrl(res.imageUrl);
        });
    }, [showData]);
    

    if (!showData) return (<div>Loading Show</div>);
    return (
        <div className="flex space-x-2">
            <div className="">
                {showImageUrl &&
                    <img src={showImageUrl} alt={showData.name} className="w-12 h-12 rounded-md" />
                }
                {!showImageUrl && <Skeleton className="w-12 h-12 rounded-md" />}
            </div>
            <div>
                <h2 className=" font-bold text-xl">{showData.name}</h2>
                <span className="flex space-x-2 items-center">
                    <p>{showData.length}m</p>
                    {showData.limitedSeries && <p className="">Limited</p>}
                    <p className="">{showData.totalSeasons} Seasons</p>
                </span>
            </div>
        </div>
    );

}