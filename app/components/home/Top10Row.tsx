import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ShowTile from "../show/ShowTile/ShowTile";
import { getTop10 } from "./HomeService";
import { Info } from "lucide-react";
import { ShowTileBadgeProps } from "../show/ShowTile/ShowTileContent";
import { Skeleton } from "@/components/ui/skeleton";
import ShowTileSkeleton from "../show/ShowTile/ShowTileSkeleton";

export default async function Top10Row() {

    const shows = await getTop10();

    if (shows === null) return (<div>Error Loading Top 10</div>);

    const getUpdateString = (updates: number) => {
        if (updates == 1) return "update";
        else return "updates";
    }

    const tileBadge = (updates: number): ShowTileBadgeProps => {
        return { text: `${updates} ${getUpdateString(updates)}`, icon: Info };
    }

    const positionBadge = (position: number): ShowTileBadgeProps => {
        return { text: `#${position} most updated`, icon: Info };
    }

    return (
        <div className="w-full">
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex">
                    {shows.map((showInfo,index) => (
                        <div key={showInfo.showId} className="rounded-md p-2">
                            <ShowTile 
                                showId={showInfo.showId.toString()} 
                                badges={[tileBadge(showInfo.updates), positionBadge(index+1)]}
                            /> 
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
};

export async function LoadingTop10Row() {
    return (
        <div className="w-full">
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="rounded-md p-2">
                            <ShowTileSkeleton />
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}