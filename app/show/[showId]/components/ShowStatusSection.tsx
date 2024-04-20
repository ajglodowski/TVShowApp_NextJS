'use client'

import { Status } from "@/app/models/status";
import { UserShowData } from "@/app/models/userShowData";
import { UserUpdateCategory } from "@/app/models/userUpdateType";
import { useState } from "react";
import { updateUserShowData } from "../UserShowDataService";
import { useToast } from "@/components/ui/use-toast";

export default function ShowStatusSection({ showId, userId, userShowData, allStatuses, updateFunction, loggedIn }: { showId: string, userId: string | undefined, userShowData: UserShowData | null, allStatuses: Status[] | null, updateFunction: Function, loggedIn: boolean }) {

    const [currentStatus, setCurrentStatus] = useState(userShowData?.status);
    const otherStatuses = allStatuses?.filter((status) => status.id !== currentStatus?.id);
    const [showOptions, setShowOptions] = useState(false);

    if (!loggedIn) return (<></>);
    if (userShowData === null) return (
        <div className="m-2">
            <button 
                onClick={() => addShowToWatchlist()}
                className="p-1 mx-2 rounded-lg outline outline-white hover:bg-white hover:text-black">
                Add to your shows
            </button>
        </div>
    );

    async function changeCurrentStatus(status: Status) {
        console.log(`Changing status to ${status.name}`);
        let updateResponse = await updateFunction({ updateType: UserUpdateCategory.UpdatedStatus, userId: userId, showId: showId, newValue: status });
        if (updateResponse) setCurrentStatus(status);
        else console.log(`Error updating season to ${status}`);
    };
    
    //const { toast } = useToast(); // TODO FIXME
    async function addShowToWatchlist() {
        const response = await updateFunction({ updateType: UserUpdateCategory.AddedToWatchlist, userId: userId, showId: showId, newValue: status });
        //if (!response) toast({variant: 'destructive',description: 'Error Adding Show to Watchlist', title: 'Failure'});
        //else toast({description: 'Please refresh page to see changes', title: 'Show Added to Watchlist'});
    };

    return (
        <div className="w-full">
            <h1 className="text-2xl">Current Status: {currentStatus?.name}</h1>
            {allStatuses && <div className="">
                <span className="flex items-center">
                    <button onClick={() => setShowOptions(!showOptions)} className="py-1 px-2 m-1 rounded-lg outline outline-white hover:bg-white hover:text-black">
                        {showOptions ? 'Hide other statuses' : 'Change status'}
                    </button>
                </span>
                {showOptions && <div className="whitespace-nowrap overflow-x-auto w-full">
                    {otherStatuses!.map((status: Status) => (
                        <button
                            key={status.id}
                            onClick={() => changeCurrentStatus(status)}
                            className={`py-1 px-2 m-1 rounded-lg outline outline-white hover:bg-white hover:text-black`}
                        >
                            {status.name}
                        </button>
                    ))}
                </div>}
            </div>}
        </div>
    );
}