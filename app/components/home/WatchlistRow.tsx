import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ShowTile from "../show/ShowTile/ShowTile";
import { ShowTileBadgeProps } from "../show/ShowTile/ShowTileContent";
import ShowTileSkeleton from "../show/ShowTile/ShowTileSkeleton";
import { getWatchlistStartRecommendationsForUser, userHasEmbedding } from "@/app/utils/recommendations/RecommendationService";
import { Star, Sparkles } from "lucide-react";

export default async function WatchListRow ({userId}: {userId: string}) {

    // Check if user has an embedding for personalized rankings
    const hasEmbedding = await userHasEmbedding(userId);
    
    // Get watchlist shows ranked by preference match
    const recommendations = await getWatchlistStartRecommendationsForUser(userId, 15);

    if (!recommendations || recommendations.length === 0) {
        return (
            <div className="px-1 py-6">
                <div className="flex flex-col items-center justify-center text-center gap-2">
                    <Star className="w-6 h-6 text-white/20" />
                    <p className="text-sm text-white/40">No shows in your watchlist yet. Add some shows to start watching!</p>
                </div>
            </div>
        );
    }

    // Badge for similarity score
    const similarityBadge = (score: number, isFallback: boolean): ShowTileBadgeProps => {
        if (isFallback) {
            return { text: "Recently Added", iconName: "Clock" };
        }
        const percentage = Math.round(score * 100);
        return { text: `${percentage}% match`, iconName: "Sparkles" };
    };

    return (
        <div className="w-full">
            {!hasEmbedding && recommendations.length > 0 && (
                <div className="px-1 pb-3 text-xs text-white/40 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Rate some shows to get personalized start recommendations!</span>
                </div>
            )}
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-3 px-1">
                    {recommendations.map((rec) => (
                        <div key={rec.showId} className="flex-shrink-0">
                            <ShowTile 
                                showId={rec.showId.toString()} 
                                badges={hasEmbedding && !rec.isFallback ? [similarityBadge(rec.similarityScore, rec.isFallback)] : undefined}
                            />
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="opacity-0" />
            </ScrollArea>
        </div>
    );
}

export async function LoadingWatchlistRow() {
    return (
        <div className="w-full">
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-3 px-1">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="flex-shrink-0">
                            <ShowTileSkeleton />
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="opacity-0" />
            </ScrollArea>
        </div>
    )
}