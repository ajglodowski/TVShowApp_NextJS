import { LoadingShowSearch } from "@/app/components/showSearch/ShowSearch";

export default async function LoadingSearchPage() {

    return (
        <div className="w-full">
            <h1 className="text-5xl font-bold">Search</h1>
            <LoadingShowSearch />
        </div>
    );
}