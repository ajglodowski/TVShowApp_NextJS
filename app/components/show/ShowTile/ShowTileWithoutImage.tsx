import { Show } from "@/app/models/show";
import ShowTileBody from "./ShowTileBody";
import { LoadingImageSkeleton } from "../../image/LoadingImageSkeleton";

type ShowTileContentProps = 
    { showData: Show; };

export default async function ShowTileWithoutImage({showData}: ShowTileContentProps) {
    const showId = showData.id;
    const show = showData;
    return (
        <div key={showId} className="inline-block rounded-lg w-42 h-42 shadow-xl">
            <div className="h-full w-full items-center text-center justify-center">
                <div className="w-32 h-32 mx-auto items-center">
                    <LoadingImageSkeleton />
                </div>
                <ShowTileBody showData={show} />
            </div>
        </div>
    );
};