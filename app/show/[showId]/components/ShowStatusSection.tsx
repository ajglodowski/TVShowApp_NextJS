'use client'

import { Status } from "@/app/models/status";
import { UserShowData } from "@/app/models/userShowData";
import { UserUpdateCategory } from "@/app/models/userUpdateType";
import { useState } from "react";
import { updateUserShowData } from "../UserShowDataService";

export default function ShowStatusSection({ userShowData, allStatuses, updateFunction, loggedIn }: { userShowData: UserShowData | null, allStatuses: Status[] | null, updateFunction: Function, loggedIn: boolean }) {

    if (!loggedIn) return (<></>);
    if (userShowData === null) return (<div>Add to your shows</div>);

    const [currentStatus, setCurrentStatus] = useState(userShowData.status);
    const otherStatuses = allStatuses?.filter((status) => status.id !== currentStatus.id);

    async function changeCurrentStatus(status: Status) {
        console.log(`Changing status to ${status.name}`);
        var updateResponse = await updateFunction({ updateType: UserUpdateCategory.UpdatedStatus, userId: userShowData!.userId, showId: userShowData!.showId, newValue: status });
        if (updateResponse) setCurrentStatus(status);
        else console.log(`Error updating season to ${status}`);
    };

    return (
        <div>
            <h1 className="text-2xl">Current Status: {currentStatus.name}</h1>
            {allStatuses && <div>
                <h2>Change status:</h2>
                <div className="h-16 flex-row  overflow-scroll no-scrollbar">
                    {otherStatuses!.map((status: Status) => (
                        <button
                            key={status.id}
                            onClick={() => changeCurrentStatus(status)}
                            className={`py-2 px-4 m-1 rounded-lg outline outline-white hover:bg-white hover:text-black`}
                        >
                            {status.name}
                        </button>
                    ))}
                </div>
            </div>}
        </div>
    );
}