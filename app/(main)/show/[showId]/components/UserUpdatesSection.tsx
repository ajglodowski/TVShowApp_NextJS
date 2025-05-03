import { getUserUpdates, toggleUpdateHiddenStatus } from "../UserShowDataService";
import { Skeleton } from "@/components/ui/skeleton";
import UpdatesWrapper from "./UpdatesWrapper";

// Define the server action outside the component
async function handleToggleHidden(updateId: number) {
    "use server";
    return toggleUpdateHiddenStatus({ updateId });
}

export async function UserUpdatesSection({ showId, currentUserId }: { showId: number, currentUserId: string | undefined }) {
    const userUpdates = await getUserUpdates({ showId: showId, userId: currentUserId });

    if (userUpdates == null) return (<></>);
    if (userUpdates.length === 0) return (<div>No updates</div>);
    
    return <UpdatesWrapper updates={userUpdates} toggleHidden={handleToggleHidden} />;
}

export const LoadingUserUpdatesSection = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-7xl font-bold my-auto tracking-tighter">Your Updates</h2>
                <div className="w-24 h-8">
                    <Skeleton className="h-full w-full rounded-lg" />
                </div>
            </div>
            <ul className="mt-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <li key={index}
                        className="border border-white rounded-full p-2 px-4 my-2 w-full"
                    >
                       <Skeleton className="h-12 w-full" />
                    </li>
                ))}
            </ul>
        </div>
    );
}