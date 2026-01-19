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
    const hasEmbedding = await userHasEmbedding(userId);
    const recommendations = await getRecommendationsForUser(userId, 15);

    if (!recommendations || recommendations.length === 0) {
        return (
            <div className="py-4">
                <div className="flex flex-col items-center justify-center text-center gap-2">
                    <Star className="w-5 h-5 text-white/20" />
                    <p className="text-xs text-white/40">
                        {hasEmbedding 
                            ? "No new recommendations available."
                            : "Rate some shows to get personalized recommendations!"}
                    </p>
                </div>
            </div>
        );
    }

    const similarityBadge = (score: number, isFallback: boolean): ShowTileBadgeProps => {
        if (isFallback) {
            return { text: "Trending", iconName: "TrendingUp" };
        }
        const percentage = Math.round(score * 100);
        return { text: `${percentage}% match`, iconName: "Sparkles" };
    };

    return (
        <div className="w-full">
            {!hasEmbedding && (
                <div className="pb-2 text-xs text-white/40 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Trending shows — rate to personalize</span>
                </div>
            )}
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-3">
                    {recommendations.map((rec) => (
                        <div key={rec.showId} className="flex-shrink-0">
                            <ShowTile 
                                showId={rec.showId.toString()} 
                                badges={[similarityBadge(rec.similarityScore, rec.isFallback)]}
                            /> 
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="opacity-0" />
            </ScrollArea>
        </div>
    );
}

export function LoadingRecommendationsRow() {
    return (
        <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="flex-shrink-0">
                        <ShowTileSkeleton />
                    </div>
                ))}
            </div>
            <ScrollBar orientation="horizontal" className="opacity-0" />
        </ScrollArea>
    );
}


