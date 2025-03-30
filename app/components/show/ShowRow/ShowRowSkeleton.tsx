import { Skeleton } from "@/components/ui/skeleton";
export default async function ShowRowSkeleton() {
    return (
            <div className="flex flex-nowrap justify-between">
                <div className="relative overflow-hidden flex space-x-2 w-full my-auto justify-start">
                    <Skeleton className="h-16 w-full rounded-md" />
                </div>
            </div>
    );

}