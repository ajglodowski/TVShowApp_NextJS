import { Show } from "@/app/models/show";
import { Clock, Calendar, Info, AlertCircle, LucideIcon } from 'lucide-react';
import Image from "next/image";
import { LoadingImageSkeleton } from "../../image/LoadingImageSkeleton";

import React from "react";

export type ShowTileContentProps = {
    showData: Show
    presignedUrl: string | null
    badges?: ShowTileBadgeProps[]
}

export type ShowTileBadgeProps = {
    text: string | React.ReactNode
    icon?: LucideIcon
    iconName?: 'Clock' | 'Calendar' | 'Info' | 'AlertCircle'
    color?: string
}

export default function ShowTileContent({showData, presignedUrl, badges}: ShowTileContentProps) {
    const show = showData;
    const showImageUrl = presignedUrl;

    const getIcon = (name?: string) => {
        switch (name) {
            case 'Clock': return Clock;
            case 'Calendar': return Calendar;
            case 'Info': return Info;
            case 'AlertCircle': return AlertCircle;
            default: return null;
        }
    }

    const ShowImage = () => {
        if (!showImageUrl) return <LoadingImageSkeleton />;
        return (
            <div className="relative w-full h-full">
                <Image 
                    src={showImageUrl || "/placeholder.svg"} 
                    alt={show.name}
                    fill
                    sizes="128px"
                    //height={128}
                    //width={128}
                    className="object-cover rounded-lg shadow-md"
                    //unoptimized={true}
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
                {(show.length || (show.services && show.services.length > 0)) && (
                <div className="flex items-center gap-2 mt-1">
                    {show.length && (
                    <div className="flex items-center text-xs text-white/60">
                        <Clock className="mr-1 h-3 w-3" />
                        {show.length}m
                    </div>
                    )}
                    {show.services && show.services.length > 0 && <div className="text-xs text-white/60">{show.services.map(s => s.name).join(", ")}</div>}
                </div>
                )}


                {badges && (
                    <div className="flex flex-wrap gap-1">
                        {badges.map((badge, index) => {
                            const IconComponent = badge.icon || getIcon(badge.iconName);
                            return (
                                <div key={index} className={`flex items-center gap-1 backdrop-blur-sm rounded-full text-sm px-2 py-0.5 ${badge.color || "bg-primary/20 text-primary-foreground"}`}>
                                    {IconComponent && <IconComponent className="w-3 h-3" />}
                                    <span>{badge.text}</span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};