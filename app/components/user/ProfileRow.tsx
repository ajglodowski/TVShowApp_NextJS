import { UserBasicInfo } from "@/app/models/user";
import { getUser } from "@/app/utils/userService";
import { getPresignedUserImageURL } from "@/app/(main)/profile/UserService";
import { LoadingImageSkeleton } from "../image/LoadingImageSkeleton";
import Image from 'next/image';
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { hoverBackdropBackground } from "@/app/utils/stylingConstants";

export type ProfileRowProps = 
    | { userId: string; profileData?: never }
    | { userId?: never; profileData: UserBasicInfo };

export async function ProfileRow({ userId, profileData }: ProfileRowProps) {

    const userData = profileData || (userId ? getUser(userId) as unknown as UserBasicInfo : null);
    
    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <LoadingImageSkeleton />
                <h1 className="text-2xl font-bold">User Not Found</h1>
                <p className="text-muted-foreground text-center">The user you are looking for does not exist or has been deleted.</p>
            </div>
        );
    }

    let imageUrl: string | null = null;
    if (userData?.profilePhotoURL) {
        imageUrl = await getPresignedUserImageURL(userData?.profilePhotoURL || "");
    }
    
    return (
        <Link
            href={`/profile/${userData.username}`}>
            <div className={`flex items-center my-auto space-x-2 hover:underline ${hoverBackdropBackground} p-2 rounded-lg`}>
                <div className="w-12 h-12 rounded-full relative overflow-hidden">
                    {imageUrl == undefined && <LoadingImageSkeleton />}
                    {imageUrl && 
                        <>
                        <Image
                            src={imageUrl}
                            alt={`${userData.username}'s profile photo`}
                            fill
                            style={{objectFit:"cover"}}
                            className="rounded-full"
                        />
                        </>
                    }
                </div>
                <p className="my-auto">@{userData.username}</p>
                <ChevronRight />
            </div>
        </Link>
    );
};