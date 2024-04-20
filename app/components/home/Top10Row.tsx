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
                    {shows.map((showInfo,index) => (
                        <div key={showInfo.showId} className=" bg-gray-900 rounded-md p-1 m-2">
                            <ShowTile showId={showInfo.showId.toString()} />
                            <h3 className="font-bold">#{index + 1} Most Updated</h3>
                            <p className="">{showInfo.updates} updates</p>   
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
};