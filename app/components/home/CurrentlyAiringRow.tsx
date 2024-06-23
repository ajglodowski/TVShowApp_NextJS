import { Show } from "@/app/models/show";
import ShowTile from "../show/ShowTile/ShowTile";
import { getCurrentlyAiring } from "./HomeService";
import { AirDate, CurrentlyAiringDTO } from "@/app/models/airDate";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default async function CurrentlyAiringRow({userId}: {userId: string}) {

    const shows = await getCurrentlyAiring({userId: userId});

    type AirDateInfo = {
        day: AirDate,
        shows: CurrentlyAiringDTO[]
    }

    const groupedShows = (): AirDateInfo[] => {
        if (shows === null) return [];
        const days = new Set(shows?.map(show => show.airdate)) as Set<AirDate>;
        let output: AirDateInfo[] = [];
        days.forEach((day) => {
            const showsForDay = shows?.filter(show => show.airdate === day);
            const dayInfo = {day: day, shows: showsForDay};
            output.push(dayInfo);
        });
        return output;
    }

    if (shows === null) return (<div>Error Loading Currently Airing</div>);

    return (
        <div className="flex items-center justify-center mx-2">
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex mb-4">
                    {groupedShows().map((airDateInfo: AirDateInfo) => (
                        <div key={airDateInfo.day} className="items-center border border-white rounded-lg p-1 mx-2">
                            <h3 className="text-center text-lg font-bold"> {airDateInfo.day ? airDateInfo.day : "Unknown"} </h3>
                            <div>
                                {airDateInfo.shows.map((show) => (
                                    <div key={show.id} className="m-2">
                                        <ShowTile showId={show.id.toString()} />    
                                    </div>
                                ))} 
                            </div>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
};