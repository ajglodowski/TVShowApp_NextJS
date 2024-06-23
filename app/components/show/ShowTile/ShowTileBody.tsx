import { Show } from "@/app/models/show";

type ShowTileContentProps = 
    { showData: Show; };

export default async function ShowTileBody({showData}: ShowTileContentProps) {
    const show = showData;
    return (
        <div>
            <h2 className="text-xl font-bold">{show.name}</h2>
            <span className="flex justify-evenly text-lg">
                <p>{show.length}m</p>
                <p>{show.service.name}</p>
            </span>
        </div>
    );
};