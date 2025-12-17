import { getUserTopTags, ShowTagCountDTO } from "@/app/utils/userService";
import { Tag } from "lucide-react";

export default async function TagCountCard({ userId }: { userId: string }) {

    const tagData = await getUserTopTags(userId);

    if (tagData === null) {
        return (
            <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-5">
                <div className="flex items-center gap-2 text-white/50">
                    <Tag className="w-5 h-5" />
                    <span>Error loading tag data</span>
                </div>
            </div>
        );
    }

    if (tagData.length === 0) {
        return (
            <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-white">Top Tags</h3>
                    </div>
                </div>
                <div className="px-5 py-8 text-center text-white/50 text-sm">
                    No tags tracked yet
                </div>
            </div>
        );
    }

    // Calculate max count for progress bar
    const maxCount = Math.max(...tagData.slice(0, 5).map(t => t.count));

    return (
        <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-white">Top Tags</h3>
                </div>
            </div>
            <div className="px-5 py-3 space-y-3">
                {tagData.slice(0, 5).map((tagCount: ShowTagCountDTO, index: number) => (
                    <div key={tagCount.tag.id} className="group">
                        <div className="flex justify-between items-center text-sm mb-1.5">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-xs text-primary font-medium">
                                    {index + 1}
                                </div>
                                <span className="text-white/80 group-hover:text-white transition-colors">{tagCount.tag.name}</span>
                            </div>
                            <span className="text-white/50 text-xs tabular-nums">{tagCount.count} shows</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                                style={{ width: `${(tagCount.count / maxCount) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}