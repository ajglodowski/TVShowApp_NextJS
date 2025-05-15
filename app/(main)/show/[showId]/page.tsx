import type { Show } from '@/app/models/show';
import { RGBAToHexA } from '@/app/utils/colorUtil';
import { backdropTabsTrigger } from '@/app/utils/stylingConstants';
import { createClient } from '@/app/utils/supabase/server';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Info, Tv, UserCheck, Users, UsersRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { fetchAverageShowColor, getPresignedShowImageURL, getRatingCounts, getShow, getStatusCounts } from './ShowService';
import ActorsSection from './components/ActorsSection';
import RatingsStatsSection from './components/RatingsStatsSection';
import ShowInfoSection from './components/ShowInfoSection';
import { SimilarShowsSection } from './components/SimilarShowsSection';
import StatusStatsSection from './components/StatusStatsSection';
import { LoadingUserUpdatesSection, UserUpdatesSection } from './components/UserUpdatesSection';
import { LoadingYourInfoSection, YourInfoSection } from './components/YourInfoSection/YourInfoSection';
import LoadingShowPage from './loading';
import { cacheLife } from 'next/dist/server/use-cache/cache-life';

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
    <div style={gradientStyle(50)}  className='w-full h-full min-h-screen'>
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
      
      <div className='flex flex-wrap md:flex-nowrap w-full px-4'>
        <Suspense fallback={<LoadingYourInfoSection />}>
          <YourInfoSection show={show} backgroundColor={backgroundColor} />
        </Suspense>
      </div>

      <Tabs defaultValue="show-info" className="w-full px-4 mt-4">
        <ScrollArea className={`w-full whitespace-nowrap rounded-lg`}>
          <TabsList style={flatStyle()} className={`flex w-max p-1 gap-1 text-white`}>
            <TabsTrigger value="show-info" className={backdropTabsTrigger}><Info className='mr-2 h-4 w-4'/> Show Info</TabsTrigger>
            <TabsTrigger value="actors" className={backdropTabsTrigger}><Users className='mr-2 h-4 w-4'/> Actors</TabsTrigger>
            <TabsTrigger value="similar-shows" className={backdropTabsTrigger}><Tv className='mr-2 h-4 w-4'/> Similar Shows</TabsTrigger>
            <TabsTrigger value="your-updates" className={backdropTabsTrigger}><UserCheck className='mr-2 h-4 w-4'/> Your Updates</TabsTrigger>
            <TabsTrigger value="friends-updates" className={backdropTabsTrigger}><UsersRound className='mr-2 h-4 w-4'/> Friend's Updates</TabsTrigger>
            <TabsTrigger value="stats" className={backdropTabsTrigger}><BarChart className='mr-2 h-4 w-4'/> Stats</TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" className="h-2 [&>div]:bg-black/40" />
        </ScrollArea>

        <TabsContent value="show-info">
          <ShowInfoSection show={show} flatStyle={flatStyle} showId={showId} />
        </TabsContent>

        <TabsContent value="actors">
          <div style={flatStyle()} className='text-left w-full p-2 shadow-xl rounded-lg'>
            <span className='flex flex-row content-start justify-between text-xl'>
              <h1 className='text-7xl font-bold tracking-tighter'>Actors</h1>
              <Link href={`/show/${showId}/editActors`}>
                <button className='p-1 mx-2 rounded-lg outline outline-white hover:bg-white hover:text-black my-auto'>Edit Actors</button>
              </Link>
            </span>
            <ActorsSection showId={parseInt(showId)} />
          </div>
        </TabsContent>

        <TabsContent value="similar-shows">
          <div style={flatStyle()} className='text-left w-full p-2 shadow-xl rounded-lg overflow-hidden'>
            <h1 className='text-7xl font-bold tracking-tighter'>Similar Shows</h1>
            <div className='flex'>
              <SimilarShowsSection showId={parseInt(showId)} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="your-updates">
          <div style={flatStyle()} className='text-left w-full p-2 shadow-xl rounded-lg'>
            <Suspense fallback={<LoadingUserUpdatesSection />}>
              <UserUpdatesSection showId={parseInt(showId)} currentUserId={currentUserId} />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="friends-updates">
           <div style={flatStyle()} className='text-left w-full p-2 shadow-xl rounded-lg'>
             <h1 className='text-7xl font-bold tracking-tighter'>Friend's Updates</h1>
             <p>Friend's updates feature coming soon!</p>
           </div>
        </TabsContent>

        <TabsContent value="stats">
          <div className='flex flex-wrap md:flex-nowrap w-full space-y-2'>
            <div style={flatStyle()} className='text-left w-full md:w-1/2 p-2 shadow-xl rounded-lg'>
               <RatingsStatsSection ratingCounts={ratingCounts} />
            </div>
            <div style={flatStyle()} className='text-left w-full md:w-1/2 p-2 shadow-xl rounded-lg'>
               <StatusStatsSection statusCounts={statusCounts} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

    </div>

  );
}