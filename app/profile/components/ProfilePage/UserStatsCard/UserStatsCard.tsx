import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getShowsLogged, ShowTagCountDTO } from "@/app/utils/userService";
import { getListsCreated, getUpdatesCreated } from "./UserStatsCardService";

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
        <Card>
            <CardHeader>
                <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="">
                {showsLogged && <StatLine label="Shows Logged" value={showsLogged} />}
                {updatesCreated && <StatLine label="Updates Created" value={updatesCreated} />}
                {listsCreated && <StatLine label="Lists Created" value={listsCreated} />}
                {listsLiked && <StatLine label="Liked lists" value={listsLiked} />}
                {likesOnLists && <StatLine label="List Likes" value={likesOnLists} />}
            </CardContent>
        </Card>
    );
}