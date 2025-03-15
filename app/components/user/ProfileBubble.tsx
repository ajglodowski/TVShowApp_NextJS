import { getUser } from "@/utils/userService";
import ProfileBubbleClient from "./ProfileBubbleClient";

type ProfileBubbleProps = { userId: string; };

export default async function ProfileBubble({ userId }: ProfileBubbleProps) {
    const userData = await getUser(userId);
    return (
        <ProfileBubbleClient user={userData} userId={userId} />
    );
};