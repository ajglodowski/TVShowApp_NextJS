import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ShowTile from "../show/ShowTile/ShowTile";
import { getComingSoon } from "./HomeService";
import { ShowTileBadgeProps } from "../show/ShowTile/ShowTileContent";
import ShowTileSkeleton from "../show/ShowTile/ShowTileSkeleton";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { LocalizedDaysAway, LocalizedReleaseDate } from "../LocalizedDate";
import { currentUserShowDetailsStateTag } from "@/app/utils/cacheTags";
export type ComingSoonDTO = {
    showId: string
    releaseDate: Date
}

export default async function ComingSoonRow ({userId}: {userId: string}) {

    'use cache'
    cacheTag(currentUserShowDetailsStateTag(userId));

    const shows = await getComingSoon({userId: userId});

    if (shows === null) return (<div>Error Loading Coming Soon</div>);
    if (shows.length === 0) return (<div>No Shows in marked as coming soon.</div>);

    const tileBadge = (date: Date): ShowTileBadgeProps => {
        return { text: <LocalizedDaysAway date={date} />, iconName: 'Clock' };
    }

    const releaseDateBadge = (releaseDate: Date): ShowTileBadgeProps => {
        return { text: <LocalizedReleaseDate date={releaseDate} />, iconName: 'Calendar' };
    }


    return (
        <div className="w-full px-2">
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex">
                    {shows.map((show) => (
                        <div key={show.showId} className="m-2">
                            <ShowTile 
                                showId={show.showId} 
                                badges={[tileBadge(show.releaseDate), releaseDateBadge(show.releaseDate)]}
                            />
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
};

export async function LoadingComingSoonRow() {
    return (
        <div className="w-full px-2">
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex">
                    {Array.from({ length: 10 }).map((_, index) => (
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