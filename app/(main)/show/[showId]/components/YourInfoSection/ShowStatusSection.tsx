'use client'

import { Status } from "@/app/models/status";
import { UserShowData } from "@/app/models/userShowData";
import { UserUpdateCategory } from "@/app/models/userUpdateType";
import { StatusIcon } from "@/app/utils/StatusIcon";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ShowStatusSection({ showId, userId, userShowData, allStatuses, updateFunction, loggedIn }: { showId: string, userId: string | undefined, userShowData: UserShowData | null, allStatuses: Status[] | null, updateFunction: Function, loggedIn: boolean }) {

    const [currentStatus, setCurrentStatus] = useState(userShowData?.status);
    const otherStatuses = allStatuses?.filter((status) => status.id !== currentStatus?.id);
    const [showOptions, setShowOptions] = useState(false);
    const router = useRouter();

    if (!loggedIn) return (<></>);
    if (userShowData === null) return (
        <div className="m-2">
            <button 
                onClick={() => addShowToWatchlist()}
                className="p-0.5 px-1 rounded-md text-sm outline outline-white hover:bg-white hover:text-black">
                Add to your shows
            </button>
        </div>
    );

    async function changeCurrentStatus(status: Status) {
        console.log(`Changing status to ${status.name}`);
        const updateResponse = await updateFunction({ updateType: UserUpdateCategory.UpdatedStatus, userId: userId, showId: showId, newValue: status });
        if (updateResponse) {
            setCurrentStatus(status);
            toast.success(`Status updated to ${status.name}`);
        }
        else {
            console.log(`Error updating season to ${status}`);
            toast.error("Failed to update status");
        }
    };
    
    async function addShowToWatchlist() {
        const _response = await updateFunction({ updateType: UserUpdateCategory.AddedToWatchlist, userId: userId, showId: showId, newValue: null });
        router.push(`/show/${showId}`);
    };

    return (
        <div className="w-full">
            <h1 className="text-xl flex flex-row">Current Status: 
                <div className="flex items-center gap-1 ml-2">
                    <StatusIcon {...currentStatus!} />
                    {currentStatus?.name}
                </div>
            </h1>
            {allStatuses && <div className="">
                <span className="flex items-center">
                    <button onClick={() => setShowOptions(!showOptions)} className="py-0.5 px-1 m-1 rounded-md text-sm outline outline-white hover:bg-white hover:text-black">
                        {showOptions ? 'Hide other statuses' : 'Change status'}
                    </button>
                </span>
                {showOptions && <div className="whitespace-nowrap overflow-x-auto w-full mt-1">
                    {otherStatuses!.map((status: Status) => (
                        <button
                            key={status.id}
                            onClick={() => changeCurrentStatus(status)}
                            className={`py-0.5 px-1 m-1 rounded-md text-sm outline outline-white hover:bg-white hover:text-black`}
                        >
                            <div className="flex items-center gap-1">
                                <StatusIcon {...status} />
                                {status.name}
                            </div>
                        </button>
                    ))}
                </div>}
            </div>}
        </div>
    );
}