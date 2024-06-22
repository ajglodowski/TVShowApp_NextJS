import { Show } from "@/app/models/show";
import { Skeleton } from "@/components/ui/skeleton";

type ShowTileContentProps = 
    { showData: Show; };

export default async function ShowTileWithoutImage({showData}: ShowTileContentProps) {
    const showId = showData.id;
    const show = showData as Show;

    const LoadingImageSkeleton = () => {
        return (
            <div className="w-full h-full">
                <Skeleton className="h-full w-full rounded-md" />
            </div>
        );
    }

    return (
        <div key={showId} className="inline-block rounded-lg w-42 h-42 shadow-xl">
            <div className="h-full w-full items-center text-center justify-center">
                <div className="w-32 h-32 mx-auto items-center">
                    <LoadingImageSkeleton />
                </div>
                <div>
                    <h2 className="text-xl font-bold">{show.name}</h2>
                    <span className="flex justify-evenly text-lg">
                        <p>{show.length}m</p>
                        <p>{show.service.name}</p>
                    </span>
                </div>
            </div>
        </div>
    );
};