import { Skeleton } from "@/components/ui/skeleton";

export const LoadingImageSkeleton = () => {
    return (
        <div className="w-full h-full">
            <Skeleton className="h-full w-full rounded-md" />
        </div>
    );
}