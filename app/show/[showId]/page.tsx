import type { Show } from '@/app/models/show';
import { boolToEmoji } from '@/utils/boolToEmoji';
import { getAllTags, getRatingCounts, getShow, getShowImage, getTags } from './ShowService';
import ShowTagsSection from "./components/ShowTagsSection";
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { get } from 'http';
import SeasonsRow from './components/SeasonsRow';
import { getAllStatuses, getUserShowData, getUserUpdates, updateCurrentSeason, updateStatus } from './UserShowDataService';
import ShowStatusSection from './components/ShowStatusSection';
import RatingsSection from './components/RatingsSection';
import Image from 'next/image';
import UserUpdatesSection from './components/UserUpdatesSection';
import ShowTile from '@/app/components/show/ShowTile';

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
      <div className='flex justify-center'>
        {showImageUrl && <div>
          <Image src={showImageUrl} alt={show.name} width={600} height={600} className='object-contain h-96 w-96 rounded-lg m-2 hover:shadow-2xl'/>
        </div> }
        <div className='shadow-2xl rounded-lg m-8 p-4'>
            <h1 className='text-4xl font-bold'>{show.name}</h1>
            <h2 className='text-2xl'>{show.length} minutes - {show.service.name}</h2>
            <ShowStatusSection userShowData={userInfoData} allStatuses={allStatuses} updateFunction={updateStatus} loggedIn={loggedIn}/>
            <span className='flex flex-row content-start justify-between text-xl'>
              <h2>Running: {boolToEmoji(show.running)} </h2>
              <h2 >Currently Airing: {boolToEmoji(show.currentlyAiring)}</h2>
            </span>
            <span className='flex flex-row content-start justify-between text-xl'>
              <h2>Total Seasons: {show.totalSeasons} </h2>
              <h2>Limited Series: {boolToEmoji(show.limitedSeries)}</h2>
            </span>
            <SeasonsRow userId={currentUserId} currentSeason={userInfoData?.currentSeason} totalSeasons={showData.totalSeasons} showId={showId} updateFunction={updateCurrentSeason}/>
            {userInfoData?.updated && <h3 className='text-lg'>You last updated at: {userInfoData?.updated.toString()}</h3>}
            <span className='flex flex-row content-start justify-between text-md'>
              <h4 className=''>Show created at: {show.created_at.toString()}</h4>
              <h4 className=''>Last updated: {show.lastUpdated.toString()}</h4>
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
        <RatingsSection ratingCounts={ratingCounts}/>
      </div>
      <ShowTile showId={showId}/>
    </div>
    
  );
}