import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getShowsLogged, ShowTagCountDTO } from "@/app/utils/userService";
import { getListsCreated, getUpdatesCreated } from "./UserStatsCardService";
import { backdropBackground } from "@/app/utils/stylingConstants";

export default async function UserStatsCard({ userId }: { userId: string }) {

    const statsData = {}; 
    const showsLogged = await getShowsLogged(userId);
    const updatesCreated = await getUpdatesCreated(userId);
    const listsCreated = await getListsCreated(userId);
    const listsLiked = 23;
    const likesOnLists = 123;

    if (statsData === null) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Error loading stats data</CardTitle>
                </CardHeader>
            </Card>
        );
    }

    const StatLine = ({label, value}: {label: string, value: number}) => {
        return (
            <div className="flex justify-between items-center">
                <span className="text-sm">{label}</span>
                <span className="font-medium">{value}</span>
            </div>
        )
    }

    return (
        <Card className={`${backdropBackground} text-white border-2 border-white/10`}>
            <CardHeader className="p-4">
                <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="">
                {showsLogged != null && <StatLine label="Shows Logged" value={showsLogged} />}
                {updatesCreated != null && <StatLine label="Updates Created" value={updatesCreated} />}
                {listsCreated != null && <StatLine label="Lists Created" value={listsCreated} />}
                {listsLiked != null && <StatLine label="Liked lists" value={listsLiked} />}
                {likesOnLists != null && <StatLine label="List Likes" value={likesOnLists} />}
            </CardContent>
        </Card>
    );
}