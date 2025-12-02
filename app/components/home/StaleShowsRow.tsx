import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ClientShowTile from "../show/ShowTile/ClientShowTile";
import ShowTileSkeleton from "../show/ShowTile/ShowTileSkeleton";
import { getStaleShows } from "./HomeService";
import { releaseDateToString } from "@/app/utils/timeUtils";
import { ShowTileBadgeProps } from "../show/ShowTile/ShowTileContent";
import { LocalizedDaysAgo, LocalizedReleaseDate } from "../LocalizedDate";

export async function LoadingStaleShowsRow() {
    return (
        <div className="w-full">
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="m-2">
                            <ShowTileSkeleton />
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}

export default async function StaleShowsRow({ userId }: { userId: string }) {
    const shows = await getStaleShows({ userId });

    if (!shows || shows.length === 0) {
        return (
            <div className="p-4 text-center text-gray-400">
                No stale shows found. Great job keeping up!
            </div>
        );
    }

    const daysAgoBadge = (date: Date): ShowTileBadgeProps => {
        return { text: <LocalizedDaysAgo date={date} />, iconName: 'Clock' };
    }

    const dateBadge = (date: Date): ShowTileBadgeProps => {
        return { text: <LocalizedReleaseDate date={date} />, iconName: 'Calendar' };
    }

    return (
        <div className="w-full">
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex">
                    {shows.map((staleShow) => (
                        <div key={staleShow.show.id} className="m-2">
                            <ClientShowTile 
                                showDto={staleShow.show} 
                                badges={[daysAgoBadge(staleShow.updated), dateBadge(staleShow.updated)]}
                            />
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}

