import { getListData, getListEntries } from "@/app/(main)/list/[listId]/ListService";
import { getShowImageUrlAction } from "@/app/(main)/show/[showId]/ShowImageService";
import ProfileBubble from "@/app/components/user/ProfileBubble";
import { backdropBackground } from "@/app/utils/stylingConstants";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import ShowsListTileSkeleton from "./ShowListTileSkeleton";

export default async function ShowsListTile({listId}: {listId: number}) {

    return (
        <Suspense fallback={<ShowsListTileSkeleton listId={listId}/>}>
            <ShowListTileContent listId={listId} />
        </Suspense>
    );

}

async function ShowListTileContent({listId}: {listId: number}) {

  'use cache'
  cacheLife('minutes');

  const listData = await getListData(listId);
    const listEntries = await getListEntries(listId, 5);
    if (!listData || !listEntries) {
        return <ShowsListTileSkeleton listId={listId}/>
    };

    // const imageUrlPromises = listEntries.map(async (entry) => {
    //   if (entry.show.pictureUrl) {
    //     const imageUrl = await getPresignedShowImageURL(entry.show.pictureUrl, true);
    //     return imageUrl;
    //   } else {
    //     return null;
    //   }
    // });
    // const imageUrls = await Promise.all(imageUrlPromises);
    const imageUrls = listEntries.map(entry => entry.show.pictureUrl ? getShowImageUrlAction(entry.show.pictureUrl) : null);

    const translateMap: {[key: number]: string} = {
      0: '',
      1: 'translate-x-8',
      2: 'translate-x-16',
      3: 'translate-x-24',
      4: 'translate-x-32'
    };

  return (
    <Link href={`/list/${listId}`}>
      <div className={`flex flex-col w-64 h-64  hover:bg-neutral-800/95 ${backdropBackground} text-white rounded-lg shadow-lg`}>
        <div className="relative flex w-full h-32 rounded-lg overflow-hidden mb-4">
          {imageUrls.map((imageUrl, index) => (
            <div 
            key={index}
            className={`absolute rounded-full h-32 w-32 transform ${translateMap[index] || 'translate-x-0'}`}
            style={{ zIndex: 5 - index }} // Still need z-index
            >
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={listEntries[index].show.name}
                fill
                sizes="128px"
                className="w-full h-full object-cover"
                //unoptimized={true}
              />
            </div>
          ))}
        </div>

        {/* List title and subtitle */}
        <div className="flex-1 m-1 p-1">
          <h1 className="text-md font-bold">{listData.name}</h1>
          <p className="text-sm mt-2">{listData.description}</p>
        </div>

        <div className="m-1 p-1">
          <ProfileBubble userId={listData.creator} />
        </div>
      </div>
    </Link>
  )
}

