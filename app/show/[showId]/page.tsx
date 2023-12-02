import { Service } from '@/app/models/service';
import type { Show } from '@/app/models/show';
import { boolToEmoji } from '@/utils/boolToEmoji';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function getShow({ params }: { params: { showId: string } }): Promise<Show | null> {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const showId = params.showId;
    const { data: showData } = await supabase.from("show").select('id, name, created_at, length, limitedSeries, currentlyAiring, running, totalSeasons, service (id, name)').match({id: showId}).single();
    
    if (!showData) return null;   

    const show: Show = {
        ...showData,
        service: showData.service as unknown as Service
    };
    
    return show;
}

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
  const cookieStore = cookies()
  const supabase = createClient(cookieStore);
  const showId = params.showId;
  const showData = await getShow({ params })
  const show = showData as Show;

  if (!showData) {
    return <ShowNotFound />
  }

  return (
    <div className='bg-slate-500 rounded-md m-8 p-4'>
        <h1 className='text-4xl font-bold'>{show.name}</h1>
        <h2 className='text-2xl'>{show.length} minutes - {show.service.name}</h2>
        <span className='flex flex-row content-start justify-between text-xl'>
          <h2>Running: {boolToEmoji(show.running)} </h2>
          <h2 >Currently Airing: {boolToEmoji(show.currentlyAiring)}</h2>
        </span>
        <span className='flex flex-row content-start justify-between text-xl'>
          <h2>Total Seasons: {show.totalSeasons} </h2>
          <h2>Limited Series: {boolToEmoji(show.limitedSeries)}</h2>
        </span>
        <h4 className='text-lg'>Created: {show.created_at.toString()}</h4>
        <p className='text-sm'>ID: {params.showId}</p>
    </div>
  );
}