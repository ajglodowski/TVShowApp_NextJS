import { getUserUpdates } from "@/app/components/home/HomeService";
import UserUpdateTile from "@/app/components/userUpdate/UserUpdateTile/UserUpdateTile";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default async function UserUpdatesRow ({userId}: {userId: string}) {

    const updates = await getUserUpdates({userId: userId, updateLimit: 10, fetchHidden: false});

    if (updates === null) return (<div>Error loading updates</div>);
    if (updates.length === 0) return (<div>No Updates found</div>);

    return (
        <div className="flex flex-wrap space-y-2 space-x-4 p-4">
            {updates.map((update) => (
                <div key={update.userUpdate.id} className="flex-shrink-0">
                    <UserUpdateTile key={update.showName} updateDto={update}/>
                </div>
            ))}
        </div>
    )
};