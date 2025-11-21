import type { Show } from '@/app/models/show';
import { boolToEmoji } from '@/app/utils/boolToEmoji';
import { dateToString, releaseDateToString } from '@/app/utils/timeUtils';
import Link from 'next/link';
import { Suspense } from 'react';
import { LoadingShowTagsSection, ShowTagsSection } from './ShowTagsSection'; // Assuming ShowTagsSection is in the same dir or adjust path

interface ShowInfoTabContentProps {
  show: Show;
  flatStyle: () => React.CSSProperties;
  showId: string;
  isAdmin: boolean;
}

export default function ShowInfoSection({ show, flatStyle, showId, isAdmin }: ShowInfoTabContentProps) {
  return (
    <div className='flex flex-wrap gap-4 mt-4'>
      <div style={flatStyle()} className='text-left w-full md:flex-grow m-0 p-4 h-auto shadow-2xl rounded-lg'>
        <div className='flex flex-wrap justify-between items-start mb-4'>
          <h2 className='text-5xl md:text-6xl font-bold tracking-tighter mb-2 md:mb-0'>Show Info</h2>
          <div className='text-right space-y-1'>
            {isAdmin && (
              <Link href={`/editShow/${showId}`}>
                <button className='p-1 px-2 text-sm rounded-lg outline outline-white hover:bg-white hover:text-black'>Edit Show</button>
              </Link>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-lg md:text-xl'>
          <div className='flex justify-between'><span>Name:</span> <span>{show.name}</span></div>
          <div className='flex justify-between'><span>Service:</span> <span>{show.service.name}</span></div>
          <div className='flex justify-between'><span>Running:</span> <span>{boolToEmoji(show.running)}</span></div>
          <div className='flex justify-between'><span>Currently Airing:</span> <span>{boolToEmoji(show.currentlyAiring)}</span></div>
          <div className='flex justify-between'><span>Total Seasons:</span> <span>{show.totalSeasons}</span></div>
          <div className='flex justify-between'><span>Limited Series:</span> <span>{boolToEmoji(show.limitedSeries)}</span></div>
          {!!show.releaseDate && <div className='flex justify-between'><span>Release Date:</span> <span>{releaseDateToString(show.releaseDate)}</span></div>}
          {!!show.airdate && <div className='flex justify-between'><span>Airdate:</span> <span>{show.airdate}</span></div>}
        </div>

        <div className='flex flex-col sm:flex-row justify-between text-sm md:text-base mt-4'>
          <span>Show created at: {dateToString(show.created_at)}</span>
          <span>Last updated: {dateToString(show.lastUpdated)}</span>
        </div>
        <p className='text-xs mt-2'>Show ID: {showId}</p>
      </div>

      <div style={flatStyle()} className='text-left w-full md:w-1/3 m-0 p-4 shadow-xl rounded-lg'>
            <h1 className='text-4xl md:text-5xl font-bold tracking-tighter text-left mb-3'>Tags</h1>
            <Suspense fallback={<LoadingShowTagsSection />}>
                <ShowTagsSection showId={showId} isAdmin={isAdmin} />
            </Suspense>
      </div>
    </div>
  );
} 