import { getShowImageUrlAction } from "@/app/(main)/show/[showId]/ShowImageService";
import { getShow } from "@/app/(main)/show/[showId]/ShowService";
import { Show } from "@/app/models/show";
import Link from "next/link";
import ShowTileContent, { ShowTileBadgeProps } from "./ShowTileContent";
type ShowTileProps = 
    | { showId: string; badges?: ShowTileBadgeProps[] }
    | { showDto: Show; badges?: ShowTileBadgeProps[] };


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

    // Fetch presigned URL on the server
    // let presignedUrl: string | null = null;
    // if (showData.pictureUrl) {
    //     presignedUrl = await getPresignedShowImageURL(showData.pictureUrl, true);
    // }

    const imageUrl = showData.pictureUrl ? getShowImageUrlAction(showData.pictureUrl) : null;

    return (
        <Link key={showId} href={`/show/${showId}`}>
            <ShowTileContent showData={showData} presignedUrl={imageUrl} badges={props.badges}/>
        </Link>
    );
};