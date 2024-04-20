import { UserShowData, UserShowDataWithUserInfo } from "@/app/models/userShowData"
import { LovedIcon } from "@/public/icons/LovedIcon";
import { LikedIcon } from "@/public/icons/LikedIcon";
import { MehIcon } from "@/public/icons/MehIcon";
import { DislikedIcon } from "@/public/icons/DislikedIcon";
import { Rating } from "@/app/models/rating";
import { getProfilePic } from "@/app/user/UserService";
import Image from "next/image";
import { useEffect, useState } from "react";
export const UserDetails = ({ userInfo }: { userInfo: UserShowDataWithUserInfo }) => {
    
    const [profilePicUrl, setProfilePicUrl] = useState<string | undefined | null>(undefined);

    useEffect(() => {
        getProfilePic(userInfo.user.username).then((res) => {
            if (res) setProfilePicUrl(res);
            else setProfilePicUrl(null);
        });
    }, []);

    function getRatingIcon(rating: Rating) {
        switch (rating) {
            case Rating.LOVED:
                return <LovedIcon color="default" />
            case Rating.LIKED:
                return <LikedIcon color="default" />
            case Rating.MEH:
                return <MehIcon color="default" />
            case Rating.DISLIKED:
                return <DislikedIcon color="default" />
            default:
                return <></>
        }
    }

    const ProfilePic = () => {
        const source = profilePicUrl ? profilePicUrl : "/images/placeholder-user.jpg";
        return (
            <div className="">
                <Image
                    src={source}
                    width="0"
                    height="0" sizes="100vw"
                    alt="Avatar"
                    className="w-8 h-8 mx-auto rounded-full"
                />
            </div>);
    }

    return (
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
                    {getRatingIcon(userInfo.rating)}
                </div>}
        </span>
    );

}