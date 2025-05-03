import { apiRoute } from "@/app/envConfig";
import { UserFollowRelationship } from "@/app/models/userFollowRelationship";
import { createClient } from "@/app/utils/supabase/client";

export function getUserImageURL(username: string): string {
  const apiURL = `${apiRoute}/api/imageFetcher?path=profilePics&imageName=`;
  const transformedName = encodeURIComponent(username);
  //const dimensions = tile ? "200x200" : "640x640";
  const showNameURL = `${apiURL}${transformedName}`;
  return showNameURL;
}


export function getProfilePic (username: string): string {
    return getUserImageURL(username);
}

export async function followUser(userToFollow: string, userFollowing: string): Promise<UserFollowRelationship | null> {
    const supabase = await createClient();

    const privateUser = await supabase.from('user').select('private').eq('id', userToFollow).single();
    if (privateUser.error) {
        console.error('Error fetching user privacy:', privateUser.error);
        return null;
    }
    if (!privateUser.data) {
        console.error('User not found:', userToFollow);
        return null;
    }
    const { private: isPrivate } = privateUser.data;
    let pending = false;
    if (isPrivate) pending = true;

    const { data, error } = await supabase
        .from('UserFollowRelationship')
        .insert([{ followingUserId: userToFollow, followerUser: userFollowing, pending: pending }])
        .select()
        .single();
    if (error) {
        console.error('Error following user:', error);
        return null;
    }
    const relationshipData = data as UserFollowRelationship;
    return relationshipData;
}

export async function unfollowUser(userToUnfollow: string, userUnfollowing: string): Promise<boolean> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('UserFollowRelationship')
        .delete()
        .match({ followingUserId: userToUnfollow, followerUser: userUnfollowing });
    if (error) console.error('Error unfollowing user:', error);
    return true;
}