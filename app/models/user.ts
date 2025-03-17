export type User = {
    id: string;
    username: string;
    created_at: Date;
    profilePhotoURL: string;
    bio: string;
    name: string;
}

export type UserBasicInfo = {
    id: string;
    username: string;
    profilePhotoURL: string;
}