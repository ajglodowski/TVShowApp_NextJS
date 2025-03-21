import { LoadingSpinner } from "@/utils/loadingSpinner";

export default async function LoadingShowPage() {
    return (
        <div className="w-full items-center text-center">
            <div className="flex flex-col items-center justify-center h-64">
                <LoadingSpinner size="large" />
            </div>
            <h1 className="text-lg font-bold">Loading</h1>
            <h2 className="text-md">Please wait...</h2>
        </div>
    )
}