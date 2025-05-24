import { LoadingShowSearch } from "@/app/components/showSearch/ShowSearch";

export default async function LoadingSearchPage() {

    return (
        <div className="w-full">
            <LoadingShowSearch pageTitle="Search" />
        </div>
    );
}