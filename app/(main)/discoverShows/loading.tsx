import { LoadingShowSearch } from "@/app/components/showSearch/ShowSearch";

export default async function LoadingDiscoverShows() {

    return (
        <div className="w-full">
            <h1 className="text-5xl font-bold">Discover New Shows</h1>
            <LoadingShowSearch />
        </div>
    );
}