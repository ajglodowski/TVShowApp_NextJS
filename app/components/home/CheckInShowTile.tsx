"use client";

import { Show } from "@/app/models/show";
import ClientShowTile from "../show/ShowTile/ClientShowTile";
import { CheckInShowDTO } from "./HomeService";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import { updateUserShowData } from "@/app/(main)/show/[showId]/UserShowDataService";
import { UserUpdateCategory } from "@/app/models/userUpdateType";
import { useState } from "react";
import { toast } from "sonner";
import { ShowTileBadgeProps } from "../show/ShowTile/ShowTileContent";
import { LocalizedDaysAgo } from "../LocalizedDate";

export default function CheckInShowTile({ checkInShow, userId }: { checkInShow: CheckInShowDTO, userId: string }) {
    const [isVisible, setIsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const handleCaughtUp = async () => {
        setIsLoading(true);
        try {
            const success = await updateUserShowData({
                updateType: UserUpdateCategory.ChangedSeason,
                userId,
                showId: checkInShow.show.id.toString(),
                newValue: checkInShow.show.totalSeasons
            });
            if (success) {
                toast.success(`Caught up on ${checkInShow.show.name}`);
                setIsVisible(false);
            } else {
                toast.error("Failed to update season");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePlusOne = async () => {
        setIsLoading(true);
        const newSeason = checkInShow.currentSeason + 1;
        try {
            const success = await updateUserShowData({
                updateType: UserUpdateCategory.ChangedSeason,
                userId,
                showId: checkInShow.show.id.toString(),
                newValue: newSeason
            });
            if (success) {
                toast.success(`Updated to Season ${newSeason}`);
                // If they are now caught up, hide it? Or just keep it?
                // If we just +1, they might still be behind. 
                // But for this row, we probably want to remove it to give immediate feedback.
                // But technically they might still be behind.
                // Let's hide it for satisfaction.
                setIsVisible(false);
            } else {
                toast.error("Failed to update season");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isVisible) return null;

    const badges: ShowTileBadgeProps[] = [
        { text: checkInShow.reason, iconName: 'AlertCircle', color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' },
        { text: <LocalizedDaysAgo date={checkInShow.updated} />, iconName: 'Clock' }
    ];

    return (
        <div className="relative group flex flex-col gap-2 m-2 w-48">
            <ClientShowTile 
                showDto={checkInShow.show} 
                badges={badges}
            />
            
            <div className="flex flex-col gap-2 mt-1 opacity-100 transition-opacity w-full">
                {/* Suggested Resolutions */}
                <div className="flex gap-2 justify-between w-full">
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-xs flex-1 bg-black/50 hover:bg-white hover:text-black border-white/20 px-1"
                        onClick={handlePlusOne}
                        disabled={isLoading}
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        S{checkInShow.currentSeason + 1}
                    </Button>
                    
                    <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-xs flex-1 bg-black/50 hover:bg-white hover:text-black border-white/20 px-1"
                        onClick={handleCaughtUp}
                        disabled={isLoading}
                    >
                        <Check className="w-3 h-3 mr-1" />
                        Caught Up
                    </Button>
                </div>
            </div>
        </div>
    );
}

