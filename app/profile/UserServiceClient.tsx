import { apiRoute } from "../envConfig";
import { UserFollowRelationship } from "../models/userFollowRelationship";

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

export async function followUser(userToFollow: string, userFollowing: string): Promise<Boolean> {
    //TODO
    return false;
}

export async function unfollowUser(userToUnfollow: string, userUnfollowing: string): Promise<UserFollowRelationship | null> {
    //TODO
    return null;
}