import { getUser } from "@/app/utils/userService";
import ProfileBubbleClient from "./ProfileBubbleClient";
import { getPresignedUserImageURL } from "@/app/(main)/profile/UserService";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

type ProfileBubbleProps = { userId: string; };

export default async function ProfileBubble({ userId }: ProfileBubbleProps) {
    'use cache'
    cacheTag('currentUser');
    cacheLife('hours');

    const userData = await getUser(userId);
    const profilePicUrl: string | null = userData?.profilePhotoURL ? await getPresignedUserImageURL(userData.profilePhotoURL) : null;
    
    return (
        <ProfileBubbleClient user={userData} profilePicUrl={profilePicUrl} />
    );
};