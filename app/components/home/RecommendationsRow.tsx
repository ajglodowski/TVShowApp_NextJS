import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ShowTile from "../show/ShowTile/ShowTile";
import { ShowTileBadgeProps } from "../show/ShowTile/ShowTileContent";
import ShowTileSkeleton from "../show/ShowTile/ShowTileSkeleton";
import { getRecommendationsForUser, userHasEmbedding } from "@/app/utils/recommendations/RecommendationService";
import { Star, Sparkles } from "lucide-react";

type RecommendationsRowProps = {
    userId: string;
};

export default async function RecommendationsRow({ userId }: RecommendationsRowProps) {
    // Check if user has an embedding (has rated shows)
    const hasEmbedding = await userHasEmbedding(userId);
    
    // Fetch recommendations
    const recommendations = await getRecommendationsForUser(userId, 15);

    if (!recommendations || recommendations.length === 0) {
        return (
            <div className="w-full px-4 py-4">
                <div className="flex flex-col items-center justify-center text-center text-white/70 gap-2">
                    <Star className="w-8 h-8 text-yellow-400/50" />
                    <p className="text-sm">
                        {hasEmbedding 
                            ? "No new recommendations available right now."
                            : "Rate some shows to get personalized recommendations!"}
                    </p>
                </div>
            </div>
        );
    }

    // Badge for similarity score
    const similarityBadge = (score: number, isFallback: boolean): ShowTileBadgeProps => {
        if (isFallback) {
            return { text: "Trending", iconName: "TrendingUp" };
        }
        const percentage = Math.round(score * 100);
        return { text: `${percentage}% match`, iconName: "Sparkles" };
    };

    return (
        <div className="w-full px-2">
            {!hasEmbedding && (
                <div className="px-2 pb-2 text-xs text-white/50 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>These are trending shows. Rate some shows to get personalized picks!</span>
                </div>
            )}
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex">
                    {recommendations.map((rec) => (
                        <div key={rec.showId} className="rounded-md p-2">
                            <ShowTile 
                                showId={rec.showId.toString()} 
                                badges={[similarityBadge(rec.similarityScore, rec.isFallback)]}
                            /> 
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}

export function LoadingRecommendationsRow() {
    return (
        <div className="w-full px-2">
            <ScrollArea className="w-full whitespace-nowrap rounded-md">
                <div className="flex">
                    {Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="rounded-md p-2">
                            <ShowTileSkeleton />
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}

