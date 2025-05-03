import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ShowTile from "../show/ShowTile/ShowTile";
import { getComingSoon } from "./HomeService";
import { Calendar, Clock } from "lucide-react";
import { ShowTileBadgeProps } from "../show/ShowTile/ShowTileContent";
import { releaseDateToString } from "@/app/utils/timeUtils";
import ShowTileSkeleton from "../show/ShowTile/ShowTileSkeleton";

export type ComingSoonDTO = {
    showId: string
    releaseDate: Date
}

export default async function ComingSoonRow ({userId}: {userId: string}) {

    const shows = await getComingSoon({userId: userId});

    if (shows === null) return (<div>Error Loading Coming Soon</div>);
    if (shows.length === 0) return (<div>No Shows in marked as coming soon.</div>);

    const getDaysAwayString = (days: number) => {
        if (days == 1) return "day";
        else return "days";
    }

    const daysAway = (date: Date):string =>  {
        const now = new Date();
        const releaseDate = new Date(date);
        const diff = releaseDate.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days < 0) return "Out Now";
        return `${days.toString()} ${getDaysAwayString(days)} away`;
    };


    const tileBadge = (daysAwayString: string): ShowTileBadgeProps => {
        return { text: `${daysAwayString}`, icon: Clock };
    }

    const releaseDateBadge = (releaseDate: Date): ShowTileBadgeProps => {
        return { text: `${releaseDateToString(releaseDate)}`, icon: Calendar };
    }


    return (
        <div className="flex items-center justify-center mx-2">
            <ScrollArea className="w-full whitespace-nowrap rounded-md border-2">
                <div className="flex">
                    {shows.map((show) => (
                        <div key={show.showId} className="m-2">
                            <ShowTile 
                                showId={show.showId} 
                                badges={[tileBadge(daysAway(show.releaseDate)), releaseDateBadge(show.releaseDate)]}
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
        <div className="flex items-center justify-center mx-2">
            <ScrollArea className="w-full whitespace-nowrap rounded-md border-2">
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