import { Show, ShowWithAnalytics } from "@/app/models/show"
import { Skeleton } from "@/components/ui/skeleton";
import { UserShowDataWithUserInfo } from "@/app/models/userShowData";
import Link from "next/dist/client/link";
import Image from "next/image";
import { UserDetailsDropdown } from "./UserDetailsDropdown";
import { Suspense } from "react";
import ShowRowSkeleton from "./ShowRowSkeleton";
import { getCurrentUsersShowDetails, getFriendsUserDetails } from "./ShowRowService";
import { getPresignedShowImageURL } from "@/app/(main)/show/[showId]/ShowService";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { ShowRowInfo } from "./ShowRowInfo";

type ShowRowProps = {
    show: Show | ShowWithAnalytics | undefined;
    currentUserInfo?: UserShowDataWithUserInfo | undefined;
    otherUsersInfo?: UserShowDataWithUserInfo[] | undefined;
    fetchCurrentUsersInfo?: boolean;
    fetchFriendsInfo?: boolean;
}


export default async function ShowRow({ show, currentUserInfo, otherUsersInfo, fetchCurrentUsersInfo, fetchFriendsInfo }: ShowRowProps) {

    const showData = show;
    if (!showData) return <ShowRowSkeleton />;

    if (otherUsersInfo === undefined && fetchFriendsInfo) {
        try {
            otherUsersInfo = await getFriendsUserDetails(showData.id);
        } catch (error) {
            console.error(`Error fetching friends' details for show ${showData.id} (${showData.name}):`, error);
        }
    }
    
    if (currentUserInfo === undefined && fetchCurrentUsersInfo) {
        try {
            currentUserInfo = await getCurrentUsersShowDetails(showData.id);
        } catch (error) {
            console.error(`Error fetching current user's details for show ${showData.id} (${showData.name}):`, error);
        }
    }
    
    return (
        <Link href={`/show/${showData.id}`}>
            <div className="flex flex-nowrap justify-between">
                <ShowRowInfo showData={showData} />
                <Suspense fallback={<Skeleton className="w-16 h-16 rounded-md" />}>
                    {currentUserInfo && <UserDetailsDropdown currentUserInfo={currentUserInfo} otherUsersInfo={otherUsersInfo || []}/>}
                </Suspense>
                
            </div>
        </Link>
    );

}