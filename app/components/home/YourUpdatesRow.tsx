import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getUserUpdates } from "./HomeService";
import UserUpdateTile from "../userUpdate/UserUpdateTile";

export default async function YourUpdatesRow ({userId}: {userId: string}) {

    //const updates = await getWatchList({userId: userId});
    const updates = await getUserUpdates({userId: userId, updateLimit: 10});

    if (updates === null) return (<div>Error Loading Watchlist</div>);
    if (updates.length === 0) return (<div>No Updates. Log some updates</div>);

    return (
        <div className="flex items-center justify-center mx-2">
            <ScrollArea className="w-full whitespace-nowrap rounded-md border-2">
                <div className="flex space-x-2">
                    {updates.map((update) => (
                        <UserUpdateTile key={update} updateId={update}/>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
};