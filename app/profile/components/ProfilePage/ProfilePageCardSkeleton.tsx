import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserTopTags, ShowTagCountDTO } from "@/app/utils/userService";
import { backdropBackground } from "@/app/utils/stylingConstants";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ProfilePageCardSkeleton({ cardTitle }: { cardTitle: string }) {

    return (
        <Card className={`${backdropBackground} text-white border-2 border-white/10`}>
            <CardHeader className="p-4">
                <CardTitle>{cardTitle}</CardTitle>
            </CardHeader>
            <CardContent>
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="space-y-2">
                        <Skeleton className="h-4 w-full mb-2" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}