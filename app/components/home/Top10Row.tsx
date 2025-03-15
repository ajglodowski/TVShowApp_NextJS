import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ShowTile from "../show/ShowTile/ShowTile";
import { getTop10 } from "./HomeService";
import { Info } from "lucide-react";
import { ShowTileBadgeProps } from "../show/ShowTile/ShowTileContent";

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
        <div className="flex items-center justify-center mx-2">
            <ScrollArea className="w-full whitespace-nowrap rounded-md border-2">
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