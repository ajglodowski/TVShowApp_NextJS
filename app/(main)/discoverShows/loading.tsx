import { LoadingShowSearch } from "@/app/components/showSearch/ShowSearch";

export default async function LoadingDiscoverShows() {

    return (
        <div className="w-full">
            <LoadingShowSearch pageTitle="Discover New Shows" />
        </div>
    );
}