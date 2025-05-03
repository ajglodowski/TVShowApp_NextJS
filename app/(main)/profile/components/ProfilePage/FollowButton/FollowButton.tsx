
import { createClient } from "@/app/utils/supabase/server";
import { getUserFollowRelationship } from "@/app/utils/userService";
import FollowButtonClient from "./FollowButtonClient";

export default async function FollowButton({ userId }: { userId: string }) {

    const supabase = await createClient();
    const userData = (await supabase.auth.getUser()).data.user;
    const currentUserId = userData?.id;
    const loggedIn = currentUserId !== undefined;

    const followRelationship = loggedIn ? await getUserFollowRelationship(userId, currentUserId!) : null;

    return (
        <FollowButtonClient currentUserId={currentUserId} followRelationship={followRelationship} userId={userId} />
    );
}