import { getUser } from "@/app/utils/userService";
import ProfileBubbleClient from "./ProfileBubbleClient";
import { getPresignedUserImageURL } from "@/app/(main)/profile/UserService";


type ProfileBubbleProps = { userId: string; };

export default async function ProfileBubble({ userId }: ProfileBubbleProps) {
    const userData = await getUser(userId);
    const profilePicUrl: string | null = userData?.profilePhotoURL ? await getPresignedUserImageURL(userData.profilePhotoURL) : null;
    
    return (
        <ProfileBubbleClient user={userData} profilePicUrl={profilePicUrl} />
    );
};