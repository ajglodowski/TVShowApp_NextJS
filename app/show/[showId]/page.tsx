import type { Show } from '@/app/models/show';
import { boolToEmoji } from '@/utils/boolToEmoji';
import { fetchAverageColor, getAllTags, getRatingCounts, getShow, getShowImage, getShowImageURL, getStatusCounts, getTags } from './ShowService';
import ShowTagsSection from "./components/ShowTagsSection";
import { createClient } from '@/utils/supabase/server';
import SeasonsRow from './components/SeasonsRow';
import { getAllStatuses, getUserShowData, getUserUpdates, updateUserShowData } from './UserShowDataService';
import ShowStatusSection from './components/ShowStatusSection';
import Image from 'next/image';
import UserUpdatesSection from './components/UserUpdatesSection';
import RatingsStatsSection from './components/RatingsStatsSection';
import UserRatingsSection from './components/UserRatingsSection';
import { dateToString, releaseDateToString } from '@/utils/timeUtils';
import Divider from '@/app/components/Divider';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import StatusStatsSection from './components/StatusStatsSection';

function ShowNotFound() {
  return (
    <div className='text-center my-auto mx-auto'>
        <h1 className='text-4xl font-bold'>Uh oh</h1>
        <h2 className='text-2xl'>Show not found</h2>
        <h2 className='text-5xl'>😞</h2>
    </div>
  );
}


export default async function ShowPage({ params }: { params: Promise<{ showId: string }> }) {
  const showId = (await params).showId;

  // User Data
  const supabase = await createClient();
  const { data: { user }, } = await supabase.auth.getUser();
  const currentUserId = user?.id;
  const loggedIn = currentUserId !== undefined;

  const [showData, currentTags, allTags, userInfoData, allStatuses, ratingCounts, statusCounts, userUpdates] = await Promise.all([
    getShow(showId),
    getTags(showId),
    getAllTags(),
    getUserShowData({ userId: currentUserId, showId: showId }),
    getAllStatuses(),
    getRatingCounts(showId),
    getStatusCounts(showId),
    getUserUpdates({ showId: showId, userId: currentUserId}),
  ]);

  if (!showData) {
    return <ShowNotFound />
  }
  const show = showData as Show;

  //const showImageInfo = await getShowImage(show.name, false);
  const showImageUrl = getShowImageURL(show.name, false);
  console.log(showImageUrl);
  //const backgroundColor = showImageInfo?.averageColor;
  const backgroundColor = await fetchAverageColor(showImageUrl);
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
          {showImageUrl && <div className='w-9/12 md:4/12 max-w-xl min-w-64 mx-auto'>
            <Image src={showImageUrl} alt={show.name} width={600} height={600} className='rounded-lg m-2 hover:shadow-2xl'/>
          </div> }
          { !showImageUrl && <div className="">
            <Skeleton className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] mx-auto object-contain rounded-md" />
          </div>}
        </div>
        <h1 className='text-7xl sm:text-9xl font-extrabold tracking-tighter text-center -mt-16'>{show.name}</h1>
      </div>
      <h2 className='text-2xl tracking-tight text-center'>{show.length} minutes - {show.service.name}</h2>
      
      <div className='flex flex-wrap md:flex-nowrap'>
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
          {userInfoData && <SeasonsRow userId={currentUserId} currentSeason={userInfoData?.currentSeason} totalSeasons={showData.totalSeasons} showId={showId} updateFunction={updateUserShowData}/> }
        </div>

        <div style={flatStyle()} className='text-left w-full md:w-1/2 m-4 p-2 h-auto shadow-2xl rounded-lg'>
          <span className='flex justify-between my-auto'>
            <h2 className='text-7xl font-bold my-auto tracking-tighter'>Show Info</h2>
            <div className='my-auto text-right'>
              <h3 className='text-lg'>Name - {show.name}</h3>
              <h3 className='text-lg'>Service - {show.service.name}</h3>
              <Link href={`/editShow/${showId}`}>
                <button className='p-1 mx-2 rounded-lg outline outline-white hover:bg-white hover:text-black'>Edit Show</button>
              </Link>
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
          <span className='flex flex-row content-start justify-between text-xl'>
            {!!show.releaseDate && <h2>Release Date: {releaseDateToString(show.releaseDate)}</h2>}
            {!!show.airdate && <h2>Airdate: {show.airdate}</h2>}
          </span>
          <span className='flex flex-row content-start justify-between text-md'>
            <h4 className=''>Show created at: {dateToString(show.created_at)}</h4>
            <h4 className=''>Last updated: {dateToString(show.lastUpdated)}</h4>
          </span>
          <p className='text-xs'>Show ID: {showId}</p>
        </div>
      </div>

      <div className='flex'>
        <div style={flatStyle()} className='text-left w-full m-4 p-2 shadow-xl rounded-lg'>
          <h1 className='text-7xl font-bold tracking-tighter'>Your Updates</h1>
          <UserUpdatesSection userUpdates={userUpdates} />
        </div>
      </div>

      <div className='flex flex-wrap md:flex-nowrap'>
        <div style={flatStyle()} className='text-left w-full md:w-1/2 m-4 p-2 shadow-xl rounded-lg'>
          <h1 className='text-7xl font-bold tracking-tighter text-right'>Tags</h1>
          <ShowTagsSection showId={showId} currentTags={currentTags} allTags={allTags} />
        </div>
        <div style={flatStyle()} className='text-left w-full md:w-1/2 m-4 p-2 shadow-xl rounded-lg'>
          <RatingsStatsSection ratingCounts={ratingCounts} />
        </div>
      </div>

      <div className='flex'>
        <div style={flatStyle()} className='text-left w-full m-4 p-2 shadow-xl rounded-lg'>
          <StatusStatsSection statusCounts={statusCounts} />
        </div>
      </div>


    </div>

  );
}