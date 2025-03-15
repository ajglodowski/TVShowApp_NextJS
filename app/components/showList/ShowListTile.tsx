import { getListData, getListEntries } from "@/app/showList/ShowListService";
import Image from "next/image"
import ProfileBubble from "../user/ProfileBubble";

export default async function ShowsListTile({listId}: {listId: number}) {

    const listData = await getListData(listId);
    const listEntries = await getListEntries(listId, 5);
    console.log(listData);
    console.log(listEntries);
    if (!listData || !listEntries) {
        return (
            <div>
                Error Loading list
            </div>
        );
    };

    // const imageUrls: string[] = () => {
    //     for (let entry of listEntries) {
    //         console.log(entry);
    //     }
    // }
    // console.log(imageUrls);
  // Sample data for the shows
  const shows = [
    { id: 1, title: "Show 1", image: "/placeholder.svg?height=400&width=400" },
    { id: 2, title: "Show 2", image: "/placeholder.svg?height=400&width=400" },
    { id: 3, title: "Show 3", image: "/placeholder.svg?height=400&width=400" },
    { id: 4, title: "Show 4", image: "/placeholder.svg?height=400&width=400" },
    { id: 5, title: "Show 5", image: "/placeholder.svg?height=400&width=400" },
  ]

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Shows thumbnails row with overlapping effect */}
      <div className="relative w-full h-[220px] overflow-hidden">
        <div className="flex absolute">
          {shows.map((show, index) => (
            <div
              key={show.id}
              className="w-[220px] h-[220px] rounded-lg overflow-hidden relative"
              style={{
                marginLeft: index === 0 ? "0" : "-40px",
                zIndex: index,
              }}
            >
              <Image
                src={show.image || "/placeholder.svg"}
                alt={show.title}
                width={220}
                height={220}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* List title and subtitle */}
      <div className="mt-6 mb-8">
        <h1 className="text-4xl font-bold">Test List</h1>
        <p className="text-2xl mt-2">A first list new</p>
      </div>

      <ProfileBubble userId={listData.creator} />
    </div>
  )
}

