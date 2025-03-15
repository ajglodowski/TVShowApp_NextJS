'use client'
import { LoadingImageSkeleton } from "../image/LoadingImageSkeleton";
import Image from 'next/image';
import { User } from "@/app/models/user";
import { getUserImageURL } from "@/app/user/UserServiceClient";

type ProfileBubbleProps = { user: User | null, userId: string; };

export default function ProfileBubbleClient({ user, userId }: ProfileBubbleProps) {
    const userData = user
    const username = userData?.username || "Error loading user";
    const userImage = userData?.profilePhotoURL == undefined ? undefined : getUserImageURL(userData?.profilePhotoURL);
    return (
            <button 
                className="flex flex-row items-center space-x-2 rounded-full  border-neutral-800 bg-neutral-800/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-800/60 h-6 max-w-32 pe-2"
                onClick={() => {window.location.href = `/user/${username}`}}
            >
                <div className="w-6 h-6 rounded-full relative overflow-hidden">
                {userImage == undefined && <LoadingImageSkeleton />}
                {userImage && 
                    <>
                    <Image
                        src={userImage}
                        alt={`${username}'s profile photo`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                    />
                    </>
                }
                </div>
                <p className="ml-2 truncate text-xs text-white/70">{username}</p>
            </button>
    );
};