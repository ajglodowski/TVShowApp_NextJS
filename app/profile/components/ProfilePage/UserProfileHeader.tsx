import { User } from "@/app/models/user";
import { getFollowerCount, getFollowingCount, getShowsLogged } from "@/app/utils/userService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, Tv, Users } from "lucide-react";
import Link from "next/link";
import { getPresignedUserImageURL } from "../../UserService";
import EditButton from "./EditButton";
import FollowButton from "./FollowButton/FollowButton";

export default async function UserProfileHeader({userId, userData}: {userId: string, userData: User}) {
    const user = userData;

    let profilePicUrl: string | undefined = undefined;
    if (user.profilePhotoURL) {
        const fetchedProfilePicUrl = await getPresignedUserImageURL(user.profilePhotoURL);
        if (fetchedProfilePicUrl) profilePicUrl = fetchedProfilePicUrl;
        else profilePicUrl = undefined;
    }

    const [showsLogged, followersCount, followingCount] = await Promise.all([
        getShowsLogged(userId),
        getFollowerCount(userId),
        getFollowingCount(userId!)
    ]);
    
    return(
        <div>
            <Avatar className="h-24 w-24 border-2 border-white/70">
                <AvatarImage src={profilePicUrl} alt="@username" />
                <AvatarFallback></AvatarFallback>
            </Avatar>
            <div className="space-y-1 flex-1">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <FollowButton userId={userId} />
                    <EditButton userId={userId} />
                </div>
                <p className="text-muted-foreground font-bold">@{user.username}</p>
                { user.private && <p className="text-sm text-muted-foreground italic">This account is private</p>}
                <div className="flex space-x-1 text-muted-foreground items-center">
                    <Tv className="h-4 w-4" />
                    <span className="">{showsLogged} Shows Logged</span>
                </div>
                <p className="text-sm mt-2 max-w-md pb-2">
                    {user.bio}
                </p>
            </div>
            <div className="flex flex-col gap-2 text-sm md:text-right">
                <div className="flex items-center gap-2 hover:underline cursor-pointer">
                    <Users className="h-4 w-4" />
                    { followersCount != null && 
                      <Link href={`/profile/${user.username}/followers`}>
                        <span className="font-medium">{followersCount} Followers</span>
                      </Link>
                    }
                    { followersCount == null && <span className="font-medium">Error loading followers</span>}
                </div>
                <div className="flex items-center gap-2 hover:underline cursor-pointer">
                    <Users className="h-4 w-4" />
                    { followingCount != null && 
                      <Link href={`/profile/${user.username}/following`}>
                        <span className="font-medium">{followingCount} Following</span>
                      </Link>
                    }
                    { followingCount == null && <span className="font-medium">Error loading Following</span>}
                </div>
            </div>
            <div className="flex flex-col gap-2 my-2 hover:underline cursor-pointer">
                <Link href={`/watchlist/${user.username}`}>
                    <span className="text-muted-foreground flex items-center gap-2 text-sm">
                        Visit {user.username}'s Watchlist
                        <ChevronRight className="h-4 w-4" />
                    </span>
                </Link>
            </div>
        </div>
    );
}

