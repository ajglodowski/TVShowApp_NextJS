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

    const showData = show;
    const showImageUrl = showData ? getShowImageURL(showData?.name as string, true) : undefined;

    if (!showData) return (<div>Loading Show</div>);
    return (
        <Link href={`/show/${showData.id}`}>
            <div className="flex flex-nowrap justify-between">
                <div className="relative overflow-hidden flex space-x-2 md:w-3/4 w-full my-auto justify-start">
                    <div className="relative w-16 h-16 my-auto">
                        <div className="absolute inset-0">
                            {showImageUrl &&
                                <Image src={showImageUrl} 
                                alt={showData.name} 
                                fill 
                                className="rounded-md object-cover" />
                            }
                            {!showImageUrl && <Skeleton className="w-12 h-12 rounded-md" />}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="font-bold text-md">{showData.name}</h2>
                        <span className="flex md:flex-row flex-col md:space-x-2 md:items-center items-start text-xs text-white/80">
                            <p className="text-sm">{showData.service.name}</p>
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