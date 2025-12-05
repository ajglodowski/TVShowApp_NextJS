import { getUserImageUrlAction } from "@/app/(main)/profile/UserService";
import { getUser } from "@/app/utils/userService";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import ProfileBubbleClient from "./ProfileBubbleClient";

type ProfileBubbleProps = { userId: string; };

export default async function ProfileBubble({ userId }: ProfileBubbleProps) {
    'use cache'
    cacheTag('currentUser');
    cacheLife('hours');

    const userData = await getUser(userId);
    const profilePicUrl = userData?.profilePhotoURL ? getUserImageUrlAction(userData.profilePhotoURL) : null;
    // const profilePicUrl: string | null = userData?.profilePhotoURL ? await getPresignedUserImageURL(userData.profilePhotoURL) : null;
    
    return (
        <ProfileBubbleClient user={userData} profilePicUrl={profilePicUrl} />
    );
};