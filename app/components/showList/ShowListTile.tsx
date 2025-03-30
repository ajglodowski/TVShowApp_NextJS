import { getListData, getListEntries } from "@/app/showList/ShowListService";
import Image from "next/image"
import ProfileBubble from "../user/ProfileBubble";
import { getShowImageURL } from "@/app/show/[showId]/ShowService";
import { backdropBackground } from "@/app/utils/stylingConstants";
import Link from "next/link";

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

    const imageUrls: string[] = listEntries.map(entry => {
        return getShowImageURL(entry.show.name, true);
    });

    const translateMap: {[key: number]: string} = {
      0: '',
      1: 'translate-x-8',
      2: 'translate-x-16',
      3: 'translate-x-24',
      4: 'translate-x-32'
    };

  return (
    <Link href={`/showList/${listId}`}>
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

