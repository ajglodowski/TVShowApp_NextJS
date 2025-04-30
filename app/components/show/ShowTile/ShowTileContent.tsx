import { Show } from "@/app/models/show";
import { Clock, LucideIcon } from 'lucide-react';
import Image from "next/image";
import { LoadingImageSkeleton } from "../../image/LoadingImageSkeleton";

export type ShowTileContentProps = {
    showData: Show
    presignedUrl: string | null
    badges?: ShowTileBadgeProps[]
}

export type ShowTileBadgeProps = {
    text: string
    icon?: LucideIcon
  }
  

export default function ShowTileContent({showData, presignedUrl, badges}: ShowTileContentProps) {
    const show = showData;
    const showImageUrl = presignedUrl;

    const ShowImage = () => {
        if (!showImageUrl) return <LoadingImageSkeleton />;
        return (
            <div className="relative w-full h-full">
                <Image 
                    src={showImageUrl || "/placeholder.svg"} 
                    alt={show.name}
                    fill
                    sizes="128px"
                    className="object-cover rounded-lg shadow-md"
                    unoptimized={true}
                />
            </div>
        );
    }

    return (
        <div
            className="group w-48 h-48 overflow-hidden rounded-lg bg-white/5 transition-all hover:bg-white/10 cursor-pointer relative"
        >
            <div className="aspect-square overflow-hidden">
                <ShowImage/>
            </div>
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3">
                <h3 className="font-medium text-sm line-clamp-1">{show.name}</h3>
                {(show.length || show.service.name) && (
                <div className="flex items-center gap-2 mt-1">
                    {show.length && (
                    <div className="flex items-center text-xs text-white/60">
                        <Clock className="mr-1 h-3 w-3" />
                        {show.length}m
                    </div>
                    )}
                    {show.service && <div className="text-xs text-white/60">{show.service.name}</div>}
                </div>
                )}


                {/* Add the badge component */}
                {badges && (
                    <div className="flex flex-wrap gap-1">
                        {badges.map((badge, index) => (
                            <div key={index} className="flex items-center gap-1 bg-primary/20 backdrop-blur-sm rounded-full text-sm text-primary-foreground">
                                {badge.icon && <badge.icon className="w-3 h-3" />}
                                <span>{badge.text}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};