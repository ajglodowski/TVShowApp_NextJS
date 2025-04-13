import Divider from "@/app/components/Divider";
import ShowStatusSection from "./ShowStatusSection";
import UserRatingsSection from "./UserRatingsSection";
import SeasonsRow from "./SeasonsRow";
import { createClient } from "@/app/utils/supabase/server";
import { getAllStatuses, getUserShowData, updateUserShowData } from "../UserShowDataService";
import { Show } from "@/app/models/show";
import { RGBAToHexA } from "@/app/utils/colorUtil";

type YourInfoSectionProps = {
    show: Show;
    backgroundColor: string;
}

export async function YourInfoSection ({ show, backgroundColor }: YourInfoSectionProps) {

    const flatStyle = () => {
        if (!backgroundColor) return {};
        const color = RGBAToHexA(backgroundColor);
        return {
            background: color,
        };
    }

    // User Data
    const supabase = await createClient();
    const { data: { user }, } = await supabase.auth.getUser();
    const currentUserId = user?.id;
    const loggedIn = currentUserId !== undefined;

    const [userInfoData, allStatuses] = await Promise.all([
        getUserShowData({ userId: currentUserId, showId: show.id.toString() }),
        getAllStatuses()
    ]);

    const showId = show.id.toString();

    return (
        <div style={flatStyle()} className='text-left w-full md:w-1/2 m-4 p-2 shadow-xl rounded-lg'>
          <span className='flex flex-wrap md:flex-nowrap justify-between my-auto'>
            <div className='mx-auto'>
              {loggedIn && <UserRatingsSection userInfo={userInfoData} updateFunction={updateUserShowData}/> }
            </div>
            <h2 className='text-5xl md:text-7xl font-bold tracking-tighter md:text-center my-auto'>Your History</h2>
          </span>
          <Divider />
          <ShowStatusSection showId={showId} userId={currentUserId} userShowData={userInfoData} allStatuses={allStatuses} updateFunction={updateUserShowData} loggedIn={loggedIn}/>
          <Divider />
          {userInfoData && <SeasonsRow userId={currentUserId} currentSeason={userInfoData?.currentSeason} totalSeasons={show.totalSeasons} showId={showId} updateFunction={updateUserShowData}/> }
        </div>
    );
};

export const LoadingYourInfoSection = () => {
    return (
        <div>
            <h2>Loading...</h2>
        </div>
    );
}