export type UserFollowRelationship = {
    id: string;
    followingUserId: string;
    followerUserId: string;
    pending: boolean;
}