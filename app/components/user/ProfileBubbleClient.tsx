'use client'
import { LoadingImageSkeleton } from "../image/LoadingImageSkeleton";
import Image from 'next/image';
import { User } from "@/app/models/user";
import { getUserImageURL } from "@/app/profile/UserServiceClient";

type ProfileBubbleProps = { user: User | null, profilePicUrl: string | null; };

export default function ProfileBubbleClient({ user, profilePicUrl }: ProfileBubbleProps) {
    const userData = user
    const username = userData?.username || "Error loading user";
    return (
            <button 
                className="flex flex-row items-center space-x-2 rounded-full  border-neutral-800 bg-neutral-800/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-800/60 h-6 max-w-32 pe-2"
                onClick={() => {window.location.href = `/profile/${username}`}}
            >
                <div className="w-6 h-6 rounded-full relative overflow-hidden">
                {profilePicUrl == null && <LoadingImageSkeleton />}
                {profilePicUrl && 
                    <>
                    <Image
                        src={profilePicUrl}
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