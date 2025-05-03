import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getUserUpdates } from "./HomeService";
import UserUpdateTile, { LoadingUserUpdateTile } from "../userUpdate/UserUpdateTile/UserUpdateTile";

export default async function YourUpdatesRow ({userId}: {userId: string}) {

    const updates = await getUserUpdates({userId: userId, updateLimit: 10, fetchHidden: false});

    if (updates === null) return (<div>Error loading updates</div>);
    if (updates.length === 0) return (<div>No Updates found</div>);

    return (
        <div className="w-full">
            <ScrollArea className="w-full whitespace-nowrap rounded-md border-2">
                <div className="flex space-x-4 p-4">
                    {updates.map((update) => (
                        <div key={update.userUpdate.id} className="flex-shrink-0">
                            <UserUpdateTile key={update.showName} updateDto={update}/>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
};

export async function LoadingYourUpdatesRow() {
    return (
        <div className="w-full">
            <ScrollArea className="w-full whitespace-nowrap rounded-md border-2">
                <div className="flex space-x-4 p-4">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="flex-shrink-0">
                            <LoadingUserUpdateTile />
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}