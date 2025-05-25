import EditShowPage from "@/app/components/editShow/EditShow";
import { getPresignedShowImageURL, getShow } from "@/app/(main)/show/[showId]/ShowService";
import { Suspense } from "react";
import EditShowLoading from "./loading";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { getShowImageUrlAction } from "../../show/[showId]/ShowImageService";


export default async function EditShow({ params }: { params: Promise<{ showId: string }> }) {

  const showId = (await params).showId;
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