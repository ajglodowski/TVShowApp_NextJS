import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserTopTags, ShowTagCountDTO } from "@/app/utils/userService";
import { backdropBackground } from "@/app/utils/stylingConstants";

export default async function TagCountCard({ userId }: { userId: string }) {

    const tagData = await getUserTopTags(userId);

    if (tagData === null) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Error loading tag data</CardTitle>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className={`${backdropBackground} text-white border-2 border-white/10`}>
            <CardHeader className="p-4">
                <CardTitle>Top Tags</CardTitle>
            </CardHeader>
            <CardContent>
                { tagData.slice(0, 5).map((tagCount: ShowTagCountDTO) => (
                    <div key={tagCount.tag.id} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="">{tagCount.tag.name}</span>
                            <span className="">{tagCount.count} shows</span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}