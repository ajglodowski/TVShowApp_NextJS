import { Show } from "@/app/models/show";
import Image from "next/image";
import ShowTileBody from "./ShowTileBody";
import { LoadingImageSkeleton } from "../../image/LoadingImageSkeleton";
import { getShowImage } from "@/app/show/[showId]/ShowService";

type ShowTileContentProps = 
    { showData: Show; };

export default async function ShowTileContent({showData}: ShowTileContentProps) {
    const showId = showData.id;
    const show = showData;
    const showImageInfo = await getShowImage(show.name, true);
    const showImageUrl = showImageInfo?.imageUrl;
    const backgroundColor = showImageInfo?.averageColor;

    const ShowImage = () => {
        if (!showImageUrl) return <LoadingImageSkeleton />;
        return (
            <div className="relative">
                <Image src={showImageUrl} alt={show.name} width="0"
                    height="0"
                    sizes="100vw"
                    className="w-full h-full rounded-lg shadow-md"
                />
            </div>
        );
    }

    return (
        <div key={showId} className="inline-block rounded-lg w-42 h-42 shadow-xl" style={{ backgroundColor: backgroundColor }}>
            <div className="h-full w-full items-center text-center justify-center">
                <div className="w-32 h-32 mx-auto items-center">
                    <ShowImage/>
                </div>
                <ShowTileBody showData={show} />
            </div>
        </div>
    );
};