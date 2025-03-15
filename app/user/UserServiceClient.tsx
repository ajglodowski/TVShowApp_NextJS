import { UserFollowRelationship } from "../models/userFollowRelationship";


export function getUserImageURL(username: string): string {
    return `https://storage.googleapis.com/tv-show-app-602d7.appspot.com/profilePics/${username}.jpg`
}


export async function getProfilePic (username: string): Promise<string|null> {
    try {
        const url = getUserImageURL(username);

        let image = new Image();
        image.src = "";
        image.src = url;
        //image.crossOrigin = "Anonymous";

        await new Promise((resolve) => {
            image.onload = resolve;
        });

        return url;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function followUser(userToFollow: string, userFollowing: string): Promise<Boolean> {
    //TODO
    return false;
}

export async function unfollowUser(userToUnfollow: string, userUnfollowing: string): Promise<UserFollowRelationship | null> {
    //TODO
    return null;
}