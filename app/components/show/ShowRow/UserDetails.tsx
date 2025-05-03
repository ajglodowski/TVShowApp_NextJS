import { UserShowDataWithUserInfo } from "@/app/models/userShowData"
import { LovedIcon } from "@/public/icons/LovedIcon";
import { LikedIcon } from "@/public/icons/LikedIcon";
import { MehIcon } from "@/public/icons/MehIcon";
import { DislikedIcon } from "@/public/icons/DislikedIcon";
import { Rating } from "@/app/models/rating";
import Image from "next/image";
import { getPresignedUserImageURL } from "@/app/(main)/profile/UserService";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
export async function UserDetails({ userInfo }: { userInfo: UserShowDataWithUserInfo }) {
    
    let profilePicUrl: string | null = null
    if (userInfo.user.profilePhotoURL) {
        profilePicUrl = await getPresignedUserImageURL(userInfo.user.profilePhotoURL);
    }

    const RatingIcon = ({rating}: {rating: Rating}) => {
        switch (rating) {
            case Rating.LOVED:
                return <LovedIcon color="default" />;
            case Rating.LIKED:
                return <LikedIcon color="default" />;
            case Rating.MEH:
                return <MehIcon color="default" />;
            case Rating.DISLIKED:
                return <DislikedIcon color="default" />;
            default:
                return <></>;
        }
    };

    const ProfilePic = () => {
        if (!profilePicUrl) {
            return <Skeleton className="w-8 h-8 mx-auto rounded-full" />;
        }
        return (
            <div className="">
                <Image
                    src={profilePicUrl}
                    width="0"
                    height="0" sizes="100vw"
                    alt="Avatar"
                    className="w-8 h-8 mx-auto rounded-full"
                    loading="lazy"
                />
            </div>);
    }

    return (
        <Link href={`/profile/${userInfo.user.username}`} className="flex flex-nowrap justify-between">
            <span className="flex space-x-2">
                <div className="my-auto text-center">
                    <ProfilePic />
                    <h5 className="font-bold">{userInfo.user.username}</h5>
                </div>
                <div className="my-auto">
                    <p>Current Season: {userInfo.currentSeason}</p>
                    <p>Status: {userInfo.status.name}</p>
                </div>
                {userInfo.rating && <div className="my-auto">
                        <RatingIcon rating={userInfo.rating} />
                    </div>}
            </span>
        </Link>
    );

}