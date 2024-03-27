'use client'

import { Show } from "@/app/models/show"
import { useEffect, useState } from "react";
import { getShowImage } from "./ClientShowService";
import { Skeleton } from "@/components/ui/skeleton";
import { UserShowData } from "@/app/models/userShowData";
import { Rating, RatingColors } from "@/app/models/rating";
import Link from "next/dist/client/link";
import { LovedIcon } from "@/assets/icons/LovedIcon";
import { LikedIcon } from "@/assets/icons/LikedIcon";
import { MehIcon } from "@/assets/icons/MehIcon";
import { DislikedIcon } from "@/assets/icons/DislikedIcon";

export const ShowRow = ({ show, currentUserInfo }: { show: Show | undefined, currentUserInfo: UserShowData | undefined }) => {

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

    /*
    useEffect(() => {
        console.log(currentUserInfo);
    }, [currentUserInfo])
    
    console.log(currentUserInfo);
    */


    function getRatingIcon(rating: Rating) {
        switch (rating) {
            case Rating.LOVED:
                return <LovedIcon color="default" />
            case Rating.LIKED:
                return <LikedIcon color="default" />
            case Rating.MEH:
                return <MehIcon color="default" />
            case Rating.DISLIKED:
                return <DislikedIcon color="default" />
            default:
                return <></>
        }
    }
    

    if (!showData) return (<div>Loading Show</div>);
    return (
        <Link href={`/show/${showData.id}`}>
            <div className="flex flex-wrap md:flex-nowrap justify-between">
                <div className="flex space-x-2 md:w-3/4 w-full my-auto">
                    <div className="w-12 h-12">
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
                {currentUserInfo && <div className="md:w-1/4 w-full">
                    <h5>Your Info:</h5>
                    <span className="flex justify-between">
                        <div>
                            <p>Current Season: {currentUserInfo.currentSeason}</p>
                            <p>Status: {currentUserInfo.status.name}</p>
                        </div>
                        {currentUserInfo.rating && <div>
                            {getRatingIcon(currentUserInfo.rating)}
                        </div>}
                    </span>
                </div>}
            </div>
        </Link>
    );

}