import EditShowPage from "@/app/components/editShow/EditShow";
import { getPresignedShowImageURL, getShow } from "@/app/(main)/show/[showId]/ShowService";
import { Suspense } from "react";
import EditShowLoading from "./loading";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { getShowImageUrlAction } from "../../show/[showId]/ShowImageService";
import { createClient } from '@/app/utils/supabase/server';
import { isAdmin } from '@/app/utils/userService';
import Link from 'next/link';

function Unauthorized() {
  return (
    <div className='text-center my-auto mx-auto py-20'>
      <h1 className='text-4xl font-bold mb-4'>Unauthorized</h1>
      <h2 className='text-2xl mb-4'>You don't have permission to edit shows</h2>
      <h2 className='text-5xl mb-6'>🚫</h2>
      <Link href="/" className='text-lg underline hover:text-blue-400'>
        Return to Home
      </Link>
    </div>
  );
}

export default async function EditShow({ params }: { params: Promise<{ showId: string }> }) {

  const showId = (await params).showId;
  
  // Check if user is admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserId = user?.id;
  const userIsAdmin = await isAdmin(currentUserId);
  
  if (!userIsAdmin) {
    return <Unauthorized />;
  }
  
  const show = await getShow(showId);
  // const presignedShowImageUrl = show?.pictureUrl
  //   ? await getPresignedShowImageURL(show.pictureUrl, false)
  //   : null;
  const presignedShowImageUrl = show?.pictureUrl ? getShowImageUrlAction(show.pictureUrl) : null;
  if (!show) {
    return (
      <div className='text-center my-auto mx-auto'>
        <h1 className='text-4xl font-bold'>Uh oh</h1>
        <h2 className='text-2xl'>Show not found</h2>
        <h2 className='text-5xl'>😞</h2>
      </div>
    )
  }
  return <EditShowPage show={show} presignedImageUrl={presignedShowImageUrl}  />
}