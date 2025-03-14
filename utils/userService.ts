import { serverBaseURL } from "@/app/envConfig";
import { createClient } from "./supabase/server";
import { User } from "@/app/models/user";
import { UserFollowRelationship } from "@/app/models/userFollowRelationship";

export async function getUser( userId: string ): Promise<User | null> {
    const supabase = await createClient();
    const { data: userData } = await supabase.from("user").select().match({id: userId}).single();
    
    if (!userData) return null;   
    
    return userData as User;
}

export async function getShowsLogged( userId: string ): Promise<number | null> {
    const supabase = await createClient();
    const { count: count } = await supabase.from("UserShowDetails").select('*', { count: 'exact', head: true }).match({userId: userId});
    
    if (!count) return null;   
    
    return count as number;
}

export function getUserImageURL(username: string): string {
  const apiURL = `${serverBaseURL}/api/imageFetcher?path=profilePics&imageName=`;
  const transformedName = username.replace(/ /g, "%20");
  //const dimensions = tile ? "200x200" : "640x640";
  const showNameURL = `${apiURL}${transformedName}`;
  return showNameURL;
}

export async function getUserFollowRelationship(followingUser: string, followerUser: string): Promise<UserFollowRelationship | null> {
    const supabase = await createClient();
    const { data: relationshipData } = await supabase.from("UserFollowRelationship").select().match({followingUser: followingUser, followerUser: followerUser}).single();
    if (!relationshipData) return null;

    return relationshipData as UserFollowRelationship;
}