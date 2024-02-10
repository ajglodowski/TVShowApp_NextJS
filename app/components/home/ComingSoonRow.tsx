import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ShowTile from "../show/ShowTile";
import { getComingSoon } from "./HomeService";

export type ComingSoonDTO = {
    showId: string
    releaseDate: Date
}

export default async function ComingSoonRow ({userId}: {userId: string}) {

    const shows = await getComingSoon({userId: userId});

    if (shows === null) return (<div>Error Loading Coming Soon</div>);
    if (shows.length === 0) return (<div>No Shows in marked as coming soon.</div>);

    const daysAway = (date: Date):String =>  {
        const now = new Date();
        const releaseDate = new Date(date);
        const diff = releaseDate.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days < 0) return "Out Now";
        return `${days.toString()} days away`;
    };

    return (
        <div className="flex items-center justify-center mx-2">
            <ScrollArea className="w-full whitespace-nowrap rounded-md border-2">
                <div className="flex">
                    {shows.map((show) => (
                        <div>
                            <ShowTile showId={show.showId} />
                            <p className="text-center">{daysAway(show.releaseDate)}</p>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
};