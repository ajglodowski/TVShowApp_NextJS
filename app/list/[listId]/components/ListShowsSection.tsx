import ShowRow from "@/app/components/show/ShowRow/ShowRow";
import { getShowsForList } from "../ListService";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ListShowsSection({ listId }: { listId: string }) {
    return (
        <div className="flex flex-col gap-4">
            <Suspense fallback={<LoadingListShowsSection />}>
                <ListShowsSectionContent listId={listId} />
            </Suspense>
        </div>
    );
}

async function ListShowsSectionContent({ listId }: { listId: string }) {
    const shows = await getShowsForList(listId);
    const displayed = shows?.sort((a, b) => a.position - b.position);
    return (
        <div className="">
            <h1 className="text-2xl">Shows:</h1>
            {displayed === null && <p>No shows found</p>}
            {displayed && displayed.map((showEntry) => {
                return (
                    <div key={showEntry.id} className="flex flex-row space-x-4 space-y-2">
                        <p className="my-auto">{showEntry.position}</p>
                        <div className="w-full">
                            <ShowRow key={showEntry.id} show={showEntry.show} fetchCurrentUsersInfo={true} fetchFriendsInfo={true} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

async function LoadingListShowsSection() {
    return (
        <div className="">
            <h1 className="text-2xl">Loading Shows:</h1>
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex flex-row space-x-4 space-y-2">
                    <p className="my-auto">{index + 1}</p>
                    <div className="w-full">
                        <Skeleton className="h-8 w-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}