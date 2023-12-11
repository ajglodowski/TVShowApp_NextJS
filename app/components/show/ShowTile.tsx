import { Show } from "@/app/models/show";
import { getShow, getShowImage } from "@/app/show/[showId]/ShowService";
import Image from "next/image";

export default async function ShowTile({ showId }: { showId: string }) {

    const showData = await getShow(showId) as Show;
    const show = showData as Show;
    const showImageInfo = await getShowImage(show.name);
    const showImageUrl = showImageInfo?.imageUrl;
    const backgroundColor = showImageInfo?.averageColor;

    if (!showData) {
        return <div>Show not found</div>
    }

    return (
        <div className="inline-block p-1 m-2 rounded-lg w-42 h-42 shadow-xl" style={{ backgroundColor: backgroundColor }}>
            <div className="h-full w-full items-center text-center justify-center">
                <div className="w-32 h-32 mx-auto items-center">
                    {showImageUrl && <div className="relative">
                        <Image src={showImageUrl} alt={show.name} width="0"
                            height="0"
                            sizes="100vw"
                            className="w-full h-full rounded-lg"
                        />
                    </div>}
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