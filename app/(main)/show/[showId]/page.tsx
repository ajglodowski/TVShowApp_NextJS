import type { Show } from '@/app/models/show';
import { createClient } from '@/app/utils/supabase/server';
import { Suspense } from 'react';
import { getRatingCounts, getShow, getStatusCounts } from './ShowService';
import ShowPageContent from './components/ShowPageContent';
import { isAdmin } from '@/app/utils/userService';
import LoadingShowPage from './loading';
import { getShowMatchForCurrentUser } from '@/app/utils/recommendations/RecommendationService';

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
  
  const startTime = performance.now();
  const [userIsAdmin, showData, ratingCounts, statusCounts, showMatch] = await Promise.all([
    isAdmin(currentUserId),
    getShow(showId),
    getRatingCounts(showId),
    getStatusCounts(showId),
    currentUserId ? getShowMatchForCurrentUser(Number(showId)) : Promise.resolve(null),
  ]);
  const endTime = performance.now();
  console.log(`Time taken: ${endTime - startTime} milliseconds`);
  if (!showData) {
    return <ShowNotFound />
  }
  const show = showData as Show;
  const matchPercent =
    showMatch?.similarityScore !== null && showMatch?.similarityScore !== undefined
      ? Math.max(0, Math.min(100, Math.round(showMatch.similarityScore * 100)))
      : null;

  return (
    <Suspense fallback={
      <div style={{ background: 'rgb(0,0,0)' }} className='w-full h-full min-h-screen'>
        <LoadingShowPage />
      </div>
    }>
      <ShowPageContent 
        show={show}
        showId={showId}
        currentUserId={currentUserId}
        userIsAdmin={userIsAdmin}
        ratingCounts={ratingCounts}
        statusCounts={statusCounts}
        matchPercent={matchPercent}
        matchReason={showMatch?.reason ?? null}
      />
    </Suspense>
  );
}