import type { Show } from '@/app/models/show';
import { boolToEmoji } from '@/app/utils/boolToEmoji';
import { RGBAToHexA } from '@/app/utils/colorUtil';
import { createClient } from '@/app/utils/supabase/server';
import { dateToString, releaseDateToString } from '@/app/utils/timeUtils';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { fetchAverageShowColor, getAllTags, getPresignedShowImageURL, getRatingCounts, getShow, getStatusCounts, getTags } from './ShowService';
import ActorsSection from './components/ActorsSection';
import RatingsStatsSection from './components/RatingsStatsSection';
import { LoadingShowTagsSection, ShowTagsSection } from "./components/ShowTagsSection";
import StatusStatsSection from './components/StatusStatsSection';
import { UserUpdatesSection, LoadingUserUpdatesSection } from './components/UserUpdatesSection';
import { LoadingYourInfoSection, YourInfoSection } from './components/YourInfoSection';

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

  const [showData, ratingCounts, statusCounts] = await Promise.all([
    getShow(showId),
    getRatingCounts(showId),
    getStatusCounts(showId),
  ]);

  if (!showData) {
    return <ShowNotFound />
  }
  const show = showData as Show;

  const startTime = performance.now();
  const pictureUrl = show.pictureUrl;
  let showImageUrl: string | null = null;
  let backgroundColor = 'rgb(0,0,0)';
  if (pictureUrl) {
    const [x, y] = await Promise.all([
      getPresignedShowImageURL(pictureUrl, false),
      fetchAverageShowColor(pictureUrl),
    ]);
    backgroundColor = y;
    showImageUrl = x;
  }
  const endTime = performance.now();
  console.log(`Image fetching took ${endTime - startTime} milliseconds`);
  

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
            <Image 
              src={showImageUrl} 
              alt={show.name} 
              width={600} 
              height={600} 
              className='rounded-lg m-2 hover:shadow-2xl'
              unoptimized={true}
            />
          </div> }
          { !showImageUrl && <div className="">
            <Skeleton className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] mx-auto object-contain rounded-md" />
          </div>}
        </div>
        <h1 className='text-7xl sm:text-9xl font-extrabold tracking-tighter text-center -mt-16 break-words'>{show.name}</h1>
      </div>
      <h2 className='text-2xl tracking-tight text-center'>{show.length} minutes - {show.service.name}</h2>
      
      <div className='flex flex-wrap md:flex-nowrap'>
        <Suspense fallback={<LoadingYourInfoSection />}>
          <YourInfoSection show={show} backgroundColor={backgroundColor} />
        </Suspense>

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
          <Suspense fallback={<LoadingUserUpdatesSection />}>
            <UserUpdatesSection showId={parseInt(showId)} currentUserId={currentUserId} />
          </Suspense>
        </div>
      </div>

      <div className='flex'>
        <div style={flatStyle()} className='text-left w-full m-4 p-2 shadow-xl rounded-lg'>
          <span className='flex flex-row content-start justify-between text-xl'>
            <h1 className='text-7xl font-bold tracking-tighter'>Actors</h1>
            <Link href={`/show/${showId}/editActors`}>
              <button className='p-1 mx-2 rounded-lg outline outline-white hover:bg-white hover:text-black'>Edit Actors</button>
            </Link>
          </span>
          <ActorsSection showId={parseInt(showId)} />
        </div>
      </div>

      <div className='flex flex-wrap md:flex-nowrap'>
        <div style={flatStyle()} className='text-left w-full md:w-1/2 m-4 p-2 shadow-xl rounded-lg'>
          <h1 className='text-7xl font-bold tracking-tighter text-right'>Tags</h1>
          <Suspense fallback={<LoadingShowTagsSection />}>
            <ShowTagsSection showId={showId} />
          </Suspense>
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