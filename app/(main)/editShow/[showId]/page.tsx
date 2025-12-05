import { getShow } from "@/app/(main)/show/[showId]/ShowService";
import EditShowPage from "@/app/components/editShow/EditShow";
import { createClient } from '@/app/utils/supabase/server';
import { isAdmin } from '@/app/utils/userService';
import { getShowImageUrlAction } from "../../show/[showId]/ShowImageService";
import Unauthorized from "@/app/components/Unauthorized";

export default async function EditShow({ params }: { params: Promise<{ showId: string }> }) {

  const showId = (await params).showId;
  
  // Check if user is admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const currentUserId = user?.id;
  const userIsAdmin = await isAdmin(currentUserId);
  
  if (!userIsAdmin) {
    return <Unauthorized message="You don't have permission to edit shows" />;
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
