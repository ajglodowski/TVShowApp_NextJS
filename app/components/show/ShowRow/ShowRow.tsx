'use client'

import { Show } from "@/app/models/show"
import { useEffect, useState } from "react";
import { getShowImageURL } from "../ClientShowService";
import { Skeleton } from "@/components/ui/skeleton";
import { UserShowDataWithUserInfo } from "@/app/models/userShowData";
import Link from "next/dist/client/link";
import Image from "next/image";
import { UserDetailsDropdown } from "./UserDetailsDropdown";

export const ShowRow = ({ show, currentUserInfo }: { show: Show | undefined, currentUserInfo: UserShowDataWithUserInfo | undefined }) => {

    //const [showData, setShowData] = useState<Show | undefined>(show as Show | undefined);
    const showData = show;
    const showImageUrl = showData ? getShowImageURL(showData?.name as string, true) : undefined;

    
    // useEffect(() => {
    //     if (showData) return;
    //     setShowData(show);
    // }, []);

    /*
    useEffect(() => {
        console.log(currentUserInfo);
    }, [currentUserInfo])
    
    console.log(currentUserInfo);
    */

    if (!showData) return (<div>Loading Show</div>);
    return (
        <Link href={`/show/${showData.id}`}>
            <div className="flex flex-wrap md:flex-nowrap justify-between">
                <div className="flex space-x-2 md:w-3/4 w-full my-auto justify-center md:justify-start">
                    <div className="w-12 h-12">
                        {showImageUrl &&
                            <Image src={showImageUrl} alt={showData.name} width="0"
                            height="0" sizes="100vw" className="w-12 h-12 rounded-md" />
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
                {currentUserInfo && <UserDetailsDropdown currentUserInfo={currentUserInfo} otherUsersInfo={[currentUserInfo, currentUserInfo]}/>}
            </div>
        </Link>
    );

}