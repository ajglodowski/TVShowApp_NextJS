import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShowsListTile({listId}: {listId: number}) {

  return (
    <Link href={`/showList/${listId}`}>
      <div className={`flex flex-col w-64 h-64 rounded-lg shadow-lg`}>
        <Skeleton className="flex w-full h-full"/>
      </div>
    </Link>
  )
}

