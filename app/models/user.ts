export type UserRole = 'user' | 'admin';

export type User = {
    id: string;
    username: string;
    created_at: Date;
    profilePhotoURL: string;
    bio: string;
    name: string;
    private: boolean;
    role: UserRole;
}

export type UserBasicInfo = {
    id: string;
    username: string;
    profilePhotoURL: string;
}