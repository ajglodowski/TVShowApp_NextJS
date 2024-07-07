'use client'
import { useEffect, useMemo, useState } from "react";
import { getYourShows } from "../HomeClientService";
import ClientShowTile from "../../show/ShowTile/ClientShowTile";
import { Status } from "@/app/models/status";
import { UserShowData } from "@/app/models/userShowData";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function YourShowsRowClient ({userId, allStatuses}: {userId: string, allStatuses: Status[] | null}) {

    const [selectedStatus, setSelectedStatus] = useState<Status[]>([]);
    const [displayedShows, setDisplayedShows] = useState<UserShowData[]| null | undefined>(undefined);

    const handleStatusChange = (status: Status) => {
        if (selectedStatus.length === 0) setSelectedStatus([status]);
        else {
            if (selectedStatus.includes(status)) setSelectedStatus(selectedStatus.filter((s) => s !== status));
            else setSelectedStatus([...selectedStatus, status]);
        }
    };
  

    useEffect(() => { // On page load

        getYourShows({userId: userId, selectedStatuses: []}).then((shows) => {
            if (!shows) setDisplayedShows(null);
            else setDisplayedShows(shows);
        });
        
    }, []);

    useMemo(() => {
        setDisplayedShows(undefined);
        getYourShows({userId: userId, selectedStatuses: selectedStatus}).then((shows) => {
            if (!shows) setDisplayedShows(null);
            else setDisplayedShows(shows);
        });
        
    }, [selectedStatus]);



    function ShowRow() {
        if (displayedShows === undefined) return (<div>Loading your shows</div>);
        if (displayedShows === null) return (<div>Error Loading your shows</div>);
        if (displayedShows.length === 0) return (<div>No Shows match this criteria</div>);
        return (
            <div className="flex items-center justify-center mx-2">
                <ScrollArea className="w-full whitespace-nowrap rounded-md border-2">
                    <div className="flex">
                        {displayedShows.map((showData) => (
                            <div key={showData.showId} className="m-2">
                                <ClientShowTile showId={showData.showId.toString()} />
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        );
    }

    const displayedStatuses = () => {
        if (!allStatuses) return ([]);
        if (selectedStatus?.length === 0) return allStatuses;
        else {
            const selectedStatuses = selectedStatus.map((status) => status.id);
            const remainingStatuses = allStatuses?.filter((status) => !selectedStatuses.includes(status.id));
            return [...selectedStatus, ...remainingStatuses];
        }
    };

    const bubbleStyle = (status: Status) => {
        return selectedStatus.includes(status) ? "bg-white text-black" : "bg-black text-white";
    }

    function AllStatusesButtons() {
        if (!allStatuses) return (<></>);
        return (

            <div className="flex items-center justify-center mx-2">
                <ScrollArea className="w-full whitespace-nowrap rounded-md">
                    <div className="flex py-1">
                        {displayedStatuses().map((status) => (
                            <button
                                key={status.id}
                                onClick={() => handleStatusChange(status)}
                                className={`rounded-full py-1 px-2 mx-2 outline outline-1 outline-white hover:bg-white hover:text-black ${bubbleStyle(status)}`}
                            >
                                {status.name}
                            </button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="whitespace-nowrap overflow-x-auto ">
                <AllStatusesButtons />
            </div>
            <ShowRow />
        </div>
    )
};
