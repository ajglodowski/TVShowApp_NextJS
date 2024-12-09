import { ShowListEntry } from "@/app/models/showList";
import Link from "next/link";

export default async function ListShowsSection({ shows }: { shows: ShowListEntry[]| null }) {

    const displayed = shows?.sort((a, b) => a.position - b.position);

    return (
        <div className="">
            <h1 className="text-2xl">Shows:</h1>
            {displayed === null && <p>No shows found</p>}
            {displayed && displayed.map((showEntry) => {
                return (
                    <Link key={showEntry.id} href={`/show/${showEntry.show.id}`}>
                        <span className="flex justify-between border-b-2 border-gray-300">
                            <p>{showEntry.position}</p>
                            <p>{showEntry.show.name}</p>
                        </span>
                        <div >
                            
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}