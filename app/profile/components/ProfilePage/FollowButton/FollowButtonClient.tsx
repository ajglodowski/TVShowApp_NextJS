'use client';
import { UserFollowRelationship } from "@/app/models/userFollowRelationship";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { backdropBackground } from "@/app/utils/stylingConstants";
import { followUser, unfollowUser } from "@/app/profile/UserServiceClient";

export default function FollowButtonClient({ currentUserId, followRelationship, userId }: { currentUserId: string | undefined, followRelationship: UserFollowRelationship|null, userId: string }) {

    const buttonStyle = `${backdropBackground}`;
    const [relationship, setRelationship] = useState<UserFollowRelationship | null>(followRelationship);
    const loggedIn = currentUserId !== undefined;
    if (!loggedIn) {
        return (
            <div className='w-full h-full'>
                <Button size="sm">Please login to follow users</Button>
            </div>
        );
    }

    if (currentUserId === userId) {
        return (
            <div className='w-full h-full'>
                <Button size="sm" className={`${buttonStyle} hover:bg-white hover:text-black`}>You</Button>
            </div>
        );
    }

    let buttonText = 'Follow';
    if (relationship) {
        if (relationship.pending) {
            buttonText = 'Follow Request Pending';
        } else {
            buttonText = 'Unfollow';
        }
    }

    const handleButtonClick = async () => {
        if (relationship) {
            const success = await unfollowUser(userId, currentUserId);
            if (success) setRelationship(null);
        } else {
            const createdRelationship = await followUser(userId, currentUserId);
            if (createdRelationship) setRelationship(createdRelationship);
        }
    }


    return (
        <div className='w-full h-full mx-16'>
            <Button size="sm"
                variant="outline"
                className={`${buttonStyle} hover:bg-white hover:text-black`}
                onClick={handleButtonClick}>
                    {buttonText}
            </Button>
        </div>
    );
}