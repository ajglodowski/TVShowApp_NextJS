import type { Show } from '@/app/models/show';
import { boolToEmoji } from '@/utils/boolToEmoji';
import { getAllTags, getRatingCounts, getShow, getShowImage, getTags } from './ShowService';
import ShowTagsSection from "./components/ShowTagsSection";
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import SeasonsRow from './components/SeasonsRow';
import { getAllStatuses, getUserShowData, getUserUpdates, updateCurrentSeason, updateUserShowData } from './UserShowDataService';
import ShowStatusSection from './components/ShowStatusSection';
import Image from 'next/image';
import UserUpdatesSection from './components/UserUpdatesSection';
import RatingsStatsSection from './components/RatingsStatsSection';
import UserRatingsSection from './components/UserRatingsSection';
import { dateToString } from '@/utils/timeUtils';
import { randomInt } from 'crypto';
import Divider from '@/app/components/Divider';

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

  const RGBAToHexA = (rgba: string, forceRemoveAlpha = false) => {
    return "#" + rgba.replace(/^rgba?\(|\s+|\)$/g, '') // Get's rgba / rgb string values
      .split(',') // splits them at ","
      .filter((string, index) => !forceRemoveAlpha || index !== 3)
      .map(string => parseFloat(string)) // Converts them to numbers
      .map((number, index) => index === 3 ? Math.round(number * 255) : number) // Converts alpha to 255 number
      .map(number => number.toString(16)) // Converts numbers to hex
      .map(string => string.length === 1 ? "0" + string : string) // Adds 0 when length of one number is 1
      .join("") // Puts the array to togehter to a string
  }

  const adjustHexColor = (color: string, amount: number) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  }

  const gradientStyle = (scale: number) => {
    if (!backgroundColor) return {};
    const lightColor = adjustHexColor(RGBAToHexA(backgroundColor), scale);
    const darkColor = adjustHexColor(RGBAToHexA(backgroundColor), -scale);
    const angle = 30;

    return {
     background: `linear-gradient(${angle}deg, ${lightColor} 0%, ${darkColor} 100%)`,
    };
  }

  const flatStyle = () => {
    if (!backgroundColor) return {};
    const color = RGBAToHexA(backgroundColor);
    return {
      background: color,
    };
  }

  return (
    <div style={gradientStyle(50)}  className='w-full h-full'>
      <div className=''>
        <div className='w-full'>
          {showImageUrl && <div className='w-4/12 mx-auto'>
            <Image src={showImageUrl} alt={show.name} width={600} height={600} className='rounded-lg m-2 hover:shadow-2xl'/>
          </div> }
        </div>
        <h1 className='text-9xl font-extrabold tracking-tighter text-center -mt-16'>{show.name}</h1>
      </div>
      <h2 className='text-2xl tracking-tight text-center'>{show.length} minutes - {show.service.name}</h2>
      
      <div className='flex flex-wrap md:flex-nowrap'>
        <div style={flatStyle()} className='text-left w-full md:w-1/2 m-4 p-2 shadow-xl rounded-lg'>
          <span className='flex justify-between my-auto'>
            {loggedIn && <UserRatingsSection userInfo={userInfoData} updateFunction={updateUserShowData}/> }
            <h2 className='text-7xl font-bold tracking-tighter text-center my-auto'>Your History</h2>
          </span>
          <Divider />
          <ShowStatusSection userShowData={userInfoData} allStatuses={allStatuses} updateFunction={updateUserShowData} loggedIn={loggedIn}/>
          <Divider />
          <SeasonsRow userId={currentUserId} currentSeason={userInfoData?.currentSeason} totalSeasons={showData.totalSeasons} showId={showId} updateFunction={updateCurrentSeason}/>  
        </div>

        <div style={flatStyle()} className='text-left w-full md:w-1/2 m-4 p-2 h-auto shadow-2xl rounded-lg'>
          <span className='flex justify-between my-auto'>
            <h2 className='text-7xl font-bold my-auto tracking-tighter'>Show Info</h2>
            <div className='my-auto text-right'>
              <h3 className='text-lg'>Name - {show.name}</h3>
              <h3 className='text-lg'>Service - {show.service.name}</h3>
            </div>
          </span>
          <span className='flex flex-row content-start justify-between text-xl'>
            <h2>Running: {boolToEmoji(show.running)} </h2>
            <h2 >Currently Airing: {boolToEmoji(show.currentlyAiring)}</h2>
          </span>
          <span className='flex flex-row content-start justify-between text-xl'>
            <h2>Total Seasons: {show.totalSeasons} </h2>
            <h2>Limited Series: {boolToEmoji(show.limitedSeries)}</h2>
          </span>
          <span className='flex flex-row content-start justify-between text-md'>
            <h4 className=''>Show created at: {dateToString(show.created_at)}</h4>
            <h4 className=''>Last updated: {dateToString(show.lastUpdated)}</h4>
          </span>
          <p className='text-xs'>Show ID: {params.showId}</p>
        </div>
      </div>
    </div>

  );
}