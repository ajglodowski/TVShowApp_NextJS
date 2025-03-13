import { Show } from "@/app/models/show";
import { getShow } from "@/app/show/[showId]/ShowService";
import Link from "next/link";
import ShowTileContent from "./ShowTileContent";
import ShowTileWithoutImage from "./ShowTileWithoutImage";
import { Suspense } from "react";
import ShowTileContentNew from "./ShowTileNew";

type ShowTileProps =
    { showId: string; } | 
    { showDto: Show; };

export default async function ShowTile(props: ShowTileProps) {

    let showData: Show;
    let showId;
    if ('showDto' in props) {
        showData = props.showDto;
        showId = props.showDto.id.toString();
    } else { 
        showData = await getShow(props.showId) as Show; 
        showId = props.showId;
    }
    

    if (!showData) {
        return <div key={showId}>Show not found</div>
    }

    return (
        <Link key={showId} href={`show/${showId}`}>
            {/*
            <Suspense fallback={<ShowTileWithoutImage showData={showData} />}>
                <ShowTileContentNew showData={showData} />
            </Suspense>
            */}
            <ShowTileContentNew showData={showData} />
        </Link>
    );
};