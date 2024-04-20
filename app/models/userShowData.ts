import { Rating } from "./rating";
import { Status } from "./status";
import { UserBasicInfo } from "./user";

export type UserShowData = {
    userId: string;
    showId: string;
    status: Status;
    updated: Date;
    currentSeason: number;
    rating: Rating;
    created_at: Date;
}

export type UserShowDataWithUserInfo = {
    user: UserBasicInfo;
    showId: string;
    status: Status;
    updated: Date;
    currentSeason: number;
    rating: Rating;
    created_at: Date;
}

export const UserShowDataParams = 'userId, showId, created_at, updated, currentSeason, rating, status (id, name)';
export const UserShowDataWithUserInfoParams = 'user (id, username), showId, created_at, updated, currentSeason, rating, status (id, name)';