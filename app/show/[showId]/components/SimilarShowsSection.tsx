import ShowTile from "@/app/components/show/ShowTile/ShowTile";
import { getSimilarShows } from "../ShowService";
import ShowTileSkeleton from "@/app/components/show/ShowTile/ShowTileSkeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export async function SimilarShowsSection({showId}: {showId: number} ) {
    
    const similarShows = await getSimilarShows(showId);

    if (similarShows == null) {
        return (
            <div>
                <h1>Error fetching similar shows</h1>
            </div>
        );
    }

    return (
        <ScrollArea className="w-full whitespace-nowrap rounded-md border-2">
            <div className="flex">
                {similarShows.map((showId) => (
                    <div key={showId} className="rounded-md p-2">
                        <ShowTile 
                            showId={showId.toString()} 
                        /> 
                    </div>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}

export const LoadingSimilarShowsSection = () => {
    return (
        <ScrollArea className="w-full whitespace-nowrap rounded-md border-2">
            <div className="flex">
                {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index} className="m-2">
                        <ShowTileSkeleton key={index} />
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}