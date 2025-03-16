'use client';
import { UserFollowRelationship } from "@/app/models/userFollowRelationship";
import { Button } from "@/components/ui/button";
import { followUser, unfollowUser } from "../../UserServiceClient";
import { useState } from "react";

export default function FollowButton({ currentUserId, followRelationship, userId }: { currentUserId: string | undefined, followRelationship: UserFollowRelationship|null, userId: string }) {

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
                <Button size="sm">You</Button>
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
            let success = await unfollowUser(userId, currentUserId);
            if (success) setRelationship(null);
        } else {
            let response = await unfollowUser(userId, currentUserId);
            if (response) setRelationship(response);
        }
    }


    return (
        <div className='w-full h-full'>
            <Button size="sm" onClick={handleButtonClick}>{buttonText}</Button>
        </div>
    );
}