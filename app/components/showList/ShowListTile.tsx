import { getListData, getListEntries } from "@/app/(main)/list/[listId]/ListService";
import { getPresignedShowImageURL } from "@/app/(main)/show/[showId]/ShowService";
import { backdropBackground } from "@/app/utils/stylingConstants";
import Image from "next/image";
import Link from "next/link";
import ProfileBubble from "@/app/components/user/ProfileBubble";

export default async function ShowsListTile({listId}: {listId: number}) {

    const listData = await getListData(listId);
    const listEntries = await getListEntries(listId, 5);
    if (!listData || !listEntries) {
        return (
            <div>
                Error Loading list
            </div>
        );
    };

    const imageUrlPromises = listEntries.map(async (entry) => {
      if (entry.show.pictureUrl) {
        const imageUrl = await getPresignedShowImageURL(entry.show.pictureUrl, true);
        return imageUrl;
      } else {
        return null;
      }
    });
    const imageUrls = await Promise.all(imageUrlPromises);

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
                className="w-full h-full object-cover"
                unoptimized={true}
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

