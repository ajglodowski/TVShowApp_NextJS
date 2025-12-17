import { getShowsLogged } from "@/app/utils/userService";
import { BarChart3, ChevronRight, ClipboardList, Heart, ListChecks, ThumbsUp, Tv } from "lucide-react";
import { getListsCreated, getUpdatesCreated } from "./UserStatsCardService";

export default async function UserStatsCard({ userId }: { userId: string }) {

    const showsLogged = await getShowsLogged(userId);
    const updatesCreated = await getUpdatesCreated(userId);
    const listsCreated = await getListsCreated(userId);
    const listsLiked = 23;
    const likesOnLists = 123;

    const StatLine = ({
        label, 
        value, 
        icon: Icon
    }: {
        label: string, 
        value: number,
        icon: React.ComponentType<{ className?: string }>
    }) => {
        return (
            <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-white/70">{label}</span>
                </div>
                <span className="font-semibold text-white tabular-nums">{value.toLocaleString()}</span>
            </div>
        )
    }

    return (
        <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden group-hover:border-primary/30 group-hover:bg-white/[0.07] transition-all">
            <div className="px-5 py-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-white">Stats</h3>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
            </div>
            <div className="px-5 py-2">
                {showsLogged != null && <StatLine label="Shows Logged" value={showsLogged} icon={Tv} />}
                {updatesCreated != null && <StatLine label="Updates Created" value={updatesCreated} icon={ClipboardList} />}
                {listsCreated != null && <StatLine label="Lists Created" value={listsCreated} icon={ListChecks} />}
                {listsLiked != null && <StatLine label="Liked Lists" value={listsLiked} icon={Heart} />}
                {likesOnLists != null && <StatLine label="List Likes" value={likesOnLists} icon={ThumbsUp} />}
            </div>
        </div>
    );
}