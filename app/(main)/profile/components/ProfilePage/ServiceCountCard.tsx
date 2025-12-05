import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserTopServices, ShowServiceCountDTO } from "@/app/utils/userService";
import { backdropBackground } from "@/app/utils/stylingConstants";

export default async function ServiceCountCard({ userId }: { userId: string }) {

    const serviceData = await getUserTopServices(userId);

    if (serviceData === null) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Error loading service data</CardTitle>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className={`${backdropBackground} text-white border-2 border-white/10`}>
            <CardHeader className="p-4">
                <CardTitle>Top Services</CardTitle>
            </CardHeader>
            <CardContent>
                { serviceData.slice(0, 5).map((tagCount: ShowServiceCountDTO) => (
                    <div key={tagCount.service.id} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="">{tagCount.service.name}</span>
                            <span className="">{tagCount.count} shows</span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}