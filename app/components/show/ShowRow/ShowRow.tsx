import { Show, ShowWithAnalytics } from "@/app/models/show";
import { UserShowDataWithUserInfo } from "@/app/models/userShowData";
import { cacheLife } from "next/cache";
import Link from "next/dist/client/link";
import { ShowRowInfo } from "./ShowRowInfo";
import { getCurrentUsersShowDetails, getFriendsUserDetails } from "./ShowRowService";
import ShowRowSkeleton from "./ShowRowSkeleton";
import { UserDetailsDropdown } from "./UserDetailsDropdown";

type ShowRowProps = {
    show: Show | ShowWithAnalytics | undefined;
    currentUserId?: string | undefined;
    currentUserInfo?: UserShowDataWithUserInfo | undefined;
    otherUsersInfo?: UserShowDataWithUserInfo[] | undefined;
    fetchCurrentUsersInfo?: boolean;
    fetchFriendsInfo?: boolean;
}


export default async function ShowRow({ show, currentUserId, currentUserInfo, otherUsersInfo, fetchCurrentUsersInfo, fetchFriendsInfo }: ShowRowProps) {

    'use cache'
    cacheLife('seconds');
    const showData = show;
    if (!showData) return <ShowRowSkeleton />;

    if (otherUsersInfo === undefined && fetchFriendsInfo) {
        try {
            otherUsersInfo = await getFriendsUserDetails(showData.id, currentUserId);
        } catch (error) {
            console.error(`Error fetching friends' details for show ${showData.id} (${showData.name}):`, error);
        }
    }
    
    if (currentUserInfo === undefined && fetchCurrentUsersInfo) {
        try {
            currentUserInfo = await getCurrentUsersShowDetails(showData.id, currentUserId);
        } catch (error) {
            console.error(`Error fetching current user's details for show ${showData.id} (${showData.name}):`, error);
        }
    }
    
    return (
        <div className="flex flex-nowrap justify-between w-full">
            <Link href={`/show/${showData.id}`} className="flex-1 min-w-0 block">
                <ShowRowInfo showData={showData} />
            </Link>
            {currentUserInfo && <UserDetailsDropdown currentUserInfo={currentUserInfo} otherUsersInfo={otherUsersInfo || []}/>}
        </div>
    );

}