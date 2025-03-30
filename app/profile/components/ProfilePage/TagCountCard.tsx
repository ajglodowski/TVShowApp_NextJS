import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShowTagCountDTO } from "@/app/utils/userService";

export default function TagCountCard({ tagData }: { tagData: ShowTagCountDTO[] | null }) {

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
        <Card>
            <CardHeader className="p-4">
                <CardTitle>Top Tags</CardTitle>
            </CardHeader>
            <CardContent>
                { tagData.map((tagCount: ShowTagCountDTO) => (
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