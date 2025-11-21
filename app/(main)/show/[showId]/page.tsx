import type { Show } from '@/app/models/show';
import { createClient } from '@/app/utils/supabase/server';
import { Suspense } from 'react';
import { getRatingCounts, getShow, getStatusCounts } from './ShowService';
import ShowPageContent from './components/ShowPageContent';
import { isAdmin } from '@/app/utils/userService';
import LoadingShowPage from './loading';

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
  
  const [userIsAdmin, showData, ratingCounts, statusCounts] = await Promise.all([
    isAdmin(currentUserId),
    getShow(showId),
    getRatingCounts(showId),
    getStatusCounts(showId),
  ]);

  if (!showData) {
    return <ShowNotFound />
  }
  const show = showData as Show;

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
      />
    </Suspense>
  );
}