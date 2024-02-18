import ShowSearch from "@/app/components/showSearch/ShowSearch";


export default async function WatchlistPage({ params }: { params: { userId: string } }) {

    const userId = params.userId;

    return (
        <div className="w-full">
            <h1>Watchlist Page {userId}</h1>
            <ShowSearch />
        </div>
    );
}