'use client';
import { UserFollowRelationship } from "@/app/models/userFollowRelationship";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { followUser, unfollowUser } from "@/app/(main)/profile/UserServiceClient";
import { UserPlus, UserMinus, Clock, User } from "lucide-react";

export default function FollowButtonClient({ currentUserId, followRelationship, userId }: { currentUserId: string | undefined, followRelationship: UserFollowRelationship|null, userId: string }) {

    const [relationship, setRelationship] = useState<UserFollowRelationship | null>(followRelationship);
    const [isLoading, setIsLoading] = useState(false);
    const loggedIn = currentUserId !== undefined;

    if (!loggedIn) {
        return (
            <Button 
                size="sm" 
                variant="outline"
                className="border-white/20 bg-white/5 text-white/70 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            >
                <UserPlus className="w-4 h-4 mr-2" />
                Log in to Follow
            </Button>
        );
    }

    if (currentUserId === userId) {
        return null; // Don't show a button on your own profile
    }

    const handleButtonClick = async () => {
        setIsLoading(true);
        try {
            if (relationship) {
                const success = await unfollowUser(userId, currentUserId);
                if (success) setRelationship(null);
            } else {
                const createdRelationship = await followUser(userId, currentUserId);
                if (createdRelationship) setRelationship(createdRelationship);
            }
        } finally {
            setIsLoading(false);
        }
    }

    // Determine button state
    if (relationship?.pending) {
        return (
            <Button 
                size="sm"
                variant="outline"
                className="border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all"
                onClick={handleButtonClick}
                disabled={isLoading}
            >
                <Clock className="w-4 h-4 mr-2" />
                Pending
            </Button>
        );
    }

    if (relationship) {
        return (
            <Button 
                size="sm"
                variant="outline"
                className="border-white/20 bg-white/10 text-white hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all group"
                onClick={handleButtonClick}
                disabled={isLoading}
            >
                <User className="w-4 h-4 mr-2 group-hover:hidden" />
                <UserMinus className="w-4 h-4 mr-2 hidden group-hover:block" />
                <span className="group-hover:hidden">Following</span>
                <span className="hidden group-hover:inline">Unfollow</span>
            </Button>
        );
    }

    return (
        <Button 
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            onClick={handleButtonClick}
            disabled={isLoading}
        >
            <UserPlus className="w-4 h-4 mr-2" />
            Follow
        </Button>
    );
}