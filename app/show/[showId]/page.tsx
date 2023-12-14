import type { Show } from '@/app/models/show';
import { boolToEmoji } from '@/utils/boolToEmoji';
import { getAllTags, getRatingCounts, getShow, getShowImage, getTags } from './ShowService';
import ShowTagsSection from "./components/ShowTagsSection";
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import SeasonsRow from './components/SeasonsRow';
import { getAllStatuses, getUserShowData, getUserUpdates, updateCurrentSeason, updateRating, updateStatus, updateUserShowData } from './UserShowDataService';
import ShowStatusSection from './components/ShowStatusSection';
import Image from 'next/image';
import UserUpdatesSection from './components/UserUpdatesSection';
import RatingsStatsSection from './components/RatingsStatsSection';
import UserRatingsSection from './components/UserRatingsSection';
import { dateToString } from '@/utils/timeUtils';

function ShowNotFound() {
  return (
    <div className='text-center my-auto mx-auto'>
        <h1 className='text-4xl font-bold'>Uh oh</h1>
        <h2 className='text-2xl'>Show not found</h2>
        <h2 className='text-5xl'>😞</h2>
    </div>
  );
}


export default async function ShowPage({ params }: { params: { showId: string } }) {
  const showId = params.showId;

  const showData = await getShow(showId);

  if (!showData) {
    return <ShowNotFound />
  }

  const currentTags = await getTags(showId);
  const allTags = await getAllTags(showId);
  const show = showData as Show;
  const showImageInfo = await getShowImage(show.name);
  const showImageUrl = showImageInfo?.imageUrl;
  const backgroundColor = showImageInfo?.averageColor;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user }, } = await supabase.auth.getUser();
  const currentUserId = user?.id;
  const userInfoData = await getUserShowData({userId: currentUserId, showId: showId});
  const loggedIn = currentUserId !== undefined;
  const allStatuses = await getAllStatuses();
  const ratingCounts = await getRatingCounts(showId);
  const userUpdates = await getUserUpdates({showId: showId, userId: currentUserId});

  

  /* div className={`text-red bg-[${backgroundColor}]/1`}> */

  return (
    <div style={{ backgroundColor: backgroundColor }} className='w-full'>
      <div className='flex items-center justify-center'>
        {showImageUrl && <div className='w-3/12'>
          <Image src={showImageUrl} alt={show.name} width={600} height={600} className='rounded-lg m-2 hover:shadow-2xl'/>
        </div> }
        <div className='w-9/12 shadow-2xl rounded-lg m-8 p-4'>
            <span className='flex justify-between items-center'>
              <div>
                <h1 className='text-4xl font-bold'>{show.name}</h1>
                <h2 className='text-2xl'>{show.length} minutes - {show.service.name}</h2>
              </div>
              {loggedIn && <UserRatingsSection userInfo={userInfoData} updateFunction={updateUserShowData}/> }
            </span>
            <ShowStatusSection userShowData={userInfoData} allStatuses={allStatuses} updateFunction={updateUserShowData} loggedIn={loggedIn}/>
            <span className='flex flex-row content-start justify-between text-xl'>
              <h2>Running: {boolToEmoji(show.running)} </h2>
              <h2 >Currently Airing: {boolToEmoji(show.currentlyAiring)}</h2>
            </span>
            <span className='flex flex-row content-start justify-between text-xl'>
              <h2>Total Seasons: {show.totalSeasons} </h2>
              <h2>Limited Series: {boolToEmoji(show.limitedSeries)}</h2>
            </span>
            <SeasonsRow userId={currentUserId} currentSeason={userInfoData?.currentSeason} totalSeasons={showData.totalSeasons} showId={showId} updateFunction={updateCurrentSeason}/>
            {userInfoData?.updated && <h3 className='text-lg'>You last updated at: {dateToString(userInfoData?.updated)}</h3>}
            <span className='flex flex-row content-start justify-between text-md'>
              <h4 className=''>Show created at: {dateToString(show.created_at)}</h4>
              <h4 className=''>Last updated: {dateToString(show.lastUpdated)}</h4>
            </span>
            <p className='text-xs'>Show ID: {params.showId}</p>
        </div>
      </div>
      <div className='flex'>
        <div>
          <h2>Your Updates:</h2>
          <UserUpdatesSection userUpdates={userUpdates}/>
        </div>
      </div>
      <div>
        <ShowTagsSection currentTags={currentTags} allTags={allTags}/>
      </div>
      <div>
        <RatingsStatsSection ratingCounts={ratingCounts}/>
      </div>
    </div>
    
  );
}