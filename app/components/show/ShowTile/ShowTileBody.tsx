import { Show } from "@/app/models/show";

type ShowTileContentProps = 
    { showData: Show; };

export default async function ShowTileBody({showData}: ShowTileContentProps) {
    const show = showData;
    return (
        <div className="text-left text-ellipsis overflow-hidden px-2">
            <h2 className="text-lg font-semibold truncate">{show.name}</h2>
            <p className="text-sm truncate">{show.length}m · {show.service.name}</p>
        </div>
    );
};