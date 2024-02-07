import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ShowTile from "../show/ShowTile";
import { getTop10 } from "./HomeService";

export default async function Top10Row() {

    const shows = await getTop10();

    if (shows === null) return (<div>Error Loading Top 10</div>);

    return (
        <div className="flex items-center justify-center mx-2">
            <ScrollArea className="w-full whitespace-nowrap rounded-md border-2">
                <div className="flex">
                    {shows.map((showInfo) => (
                        <div className="">
                            <ShowTile showId={showInfo.showId.toString()} />
                            <p className="text-center">{showInfo.updates} updates</p>   
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
};