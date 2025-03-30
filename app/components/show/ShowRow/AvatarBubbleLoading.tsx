import { Skeleton } from "@/components/ui/skeleton";
export default async function AvatarBubbleLoading() {

    return (
        <div className="m-2">
            <div className="relative">
                <Skeleton className="w-10 h-10 mx-auto rounded-full" />
            </div>
        </div>
    );

}