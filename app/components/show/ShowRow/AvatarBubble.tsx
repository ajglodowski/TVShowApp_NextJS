import { getUserImageUrlAction } from "@/app/(main)/profile/UserService";
import { Rating } from "@/app/models/rating";
import { UserShowDataWithUserInfo } from "@/app/models/userShowData";
import { backdropBackground } from "@/app/utils/stylingConstants";
import { Skeleton } from "@/components/ui/skeleton";
import { DislikedIcon } from "@/public/icons/DislikedIcon";
import { LikedIcon } from "@/public/icons/LikedIcon";
import { LovedIcon } from "@/public/icons/LovedIcon";
import { MehIcon } from "@/public/icons/MehIcon";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import Image from "next/image";
export default async function AvatarBubble({ userInfo }: { userInfo: UserShowDataWithUserInfo }) {

    'use cache'
    cacheLife('hours');

    let profilePicUrl: string | null = null;
    // if (userInfo.user.profilePhotoURL) {
    //     profilePicUrl = await getPresignedUserImageURL(userInfo.user.profilePhotoURL);
    // }
    profilePicUrl = getUserImageUrlAction(userInfo.user.profilePhotoURL);

    const RatingIcon = ({rating}: {rating: Rating}) => {
        switch (rating) {
            case Rating.LOVED:
                return <LovedIcon color="default" size={4} />;
            case Rating.LIKED:
                return <LikedIcon color="default" size={4} />;
            case Rating.MEH:
                return <MehIcon color="default" size={4} />;
            case Rating.DISLIKED:
                return <DislikedIcon color="default" size={4} />;
            default:
                return <></>;
        }
    };

    return (
        <div className="m-2">
            <div className="relative">
                {profilePicUrl &&
                    <Image 
                    src={profilePicUrl}
                    width="0"
                    height="0" sizes="100vw"
                    alt="Avatar"
                    className="w-10 h-10 mx-auto rounded-full"
                    />
                }
                {!profilePicUrl &&
                    <Skeleton className="w-10 h-10 mx-auto rounded-full" />
                }
                {userInfo.rating && 
                    <div className="absolute top-5 left-5">
                        <div className={`rounded-full ${backdropBackground} p-1`}>
                            <RatingIcon rating={userInfo.rating} />
                        </div>
                    </div>
                }
            </div>
        </div>
    );

}