import { Show, ShowWithAnalytics } from "@/app/models/show"
import { Skeleton } from "@/components/ui/skeleton";
import { UserShowDataWithUserInfo } from "@/app/models/userShowData";
import Link from "next/dist/client/link";
import Image from "next/image";
import { UserDetailsDropdown } from "./UserDetailsDropdown";
import { getPresignedShowImageURL } from "@/app/show/[showId]/ShowService";
import { Suspense } from "react";
import ShowRowSkeleton from "./ShowRowSkeleton";
import { getCurrentUsersShowDetails, getFriendsUserDetails } from "./ShowRowService";

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
    let showImageUrl: string | null = null;
    if (showData.pictureUrl) {
        try {
            showImageUrl = await getPresignedShowImageURL(showData.pictureUrl as string, true);
        } catch (error) {
            console.error(`Error fetching presigned URL for show ${showData.id} (${showData.name}):`, error);
            showImageUrl = null; // Handle error case, e.g., set to null
        }
    }

    // Fetch friends' data if not provided and requested
    if (otherUsersInfo === undefined && fetchFriendsInfo) {
        try {
            otherUsersInfo = await getFriendsUserDetails(showData.id);
        } catch (error) {
            console.error(`Error fetching friends' details for show ${showData.id} (${showData.name}):`, error);
            // Handle error case if needed, e.g., otherUsersInfo = [];
        }
    }
    
    // Fetch current user's data if not provided and requested
    if (currentUserInfo === undefined && fetchCurrentUsersInfo) {
        try {
            currentUserInfo = await getCurrentUsersShowDetails(showData.id);
        } catch (error) {
            console.error(`Error fetching current user's details for show ${showData.id} (${showData.name}):`, error);
            // Handle error case if needed, e.g., currentUserInfo = null;
        }
    }
    
    return (
        <Link href={`/show/${showData.id}`}>
            <div className="flex flex-nowrap justify-between">
                <div className="relative flex space-x-2 md:w-3/4 w-full my-auto justify-start overflow-hidden">
                    <div className="relative min-w-16 w-16 h-16 shrink-0 my-auto">
                        <div className="absolute inset-0">
                            {showImageUrl &&
                                <Image src={showImageUrl} 
                                alt={showData.name} 
                                fill 
                                sizes="64px"
                                className="rounded-md object-cover"
                                unoptimized={true}
                                />  
                            }
                            {!showImageUrl && <Skeleton className="w-full h-full rounded-md" />}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center w-full min-w-0 overflow-hidden">
                        <h2 className="font-bold text-md truncate">{showData.name}</h2>
                        <span className="flex md:flex-row flex-col w-full md:space-x-2 md:items-center items-start text-xs text-white/80 overflow-hidden">
                            <p className="text-sm truncate">{showData.service.name}</p>
                            {showData.limitedSeries && <p className="md:truncate whitespace-nowrap">Limited</p>}
                            <p className="md:truncate whitespace-nowrap">{showData.totalSeasons} Seasons</p>
                        </span>
                    </div>
                </div>
                <Suspense fallback={<Skeleton className="w-16 h-16 rounded-md" />}>
                    {currentUserInfo && <UserDetailsDropdown currentUserInfo={currentUserInfo} otherUsersInfo={otherUsersInfo || []}/>}
                </Suspense>
                
            </div>
        </Link>
    );

}