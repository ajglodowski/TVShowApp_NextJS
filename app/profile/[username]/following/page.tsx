import { ProfileRow } from "@/app/components/user/ProfileRow";
import { createClient } from "@/app/utils/supabase/server";
import { getFollowerList, getFollowingList, getUserByUsername, getUserFollowRelationship } from "@/app/utils/userService";

export default async function FollowingPage({ params }: { params: Promise<{ username: string }> }) {
    const username = (await params).username;
    const user = await getUserByUsername(username);
    
    const UserNotFound = () => {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold">User Not Found</h1>
                <p className="text-muted-foreground text-center">The user you are looking for does not exist or has been deleted.</p>
            </div>
        );
    }
    if (!user) return <UserNotFound />;

    const supabase = await createClient();
    const userData = (await supabase.auth.getUser()).data.user;
    const currentUserId = userData?.id;

    const userId = user.id;
    if (user.private) {
        if (!currentUserId) {
            return (
                <div className="flex flex-col items-center justify-center space-y-4">
                    <h1 className="text-2xl font-bold">This profile is private</h1>
                    <p className="text-muted-foreground text-center">You must be logged in to see this user's following.</p>
                </div>
            );
        }
        const followRelationship = await getUserFollowRelationship(userId, currentUserId);
        if (!followRelationship) {
            return (
                <div className="flex flex-col items-center justify-center space-y-4">
                    <h1 className="text-2xl font-bold">This profile is private</h1>
                    <p className="text-muted-foreground text-center">You must be following this user to see their following.</p>
                </div>
            );
        }
    }

    const following = await getFollowingList(userId);
    if (!following) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold">Following</h1>
                <p className="text-muted-foreground text-center">This user isn't following anyone.</p>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">Following</h1>
            <div className="flex flex-col items-center justify-center">
                {following.map((follower) => (
                    <ProfileRow profileData={follower} key={follower.id} />
                ))}
            </div>
        </div>
    );

}