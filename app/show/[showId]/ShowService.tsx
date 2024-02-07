import { cookies } from "next/headers";
import { createClient } from '@/utils/supabase/server';
import { Show } from "@/app/models/show";
import { ShowTag } from "@/app/models/showTag";
import { Service } from "@/app/models/service";
//import { ref, getDownloadURL } from "firebase/storage";
import { firebaseImageBaseURL, firebaseStorage, setFirebaseImageBaseURL } from "@/app/firebaseConfig";
import { ShowImage } from "@/app/models/showImage";
import sharp from 'sharp';
import { Rating } from "@/app/models/rating";
import { RatingCounts } from "@/app/models/ratingCounts";

export async function getShow( showId: string ): Promise<Show | null> {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const { data: showData } = await supabase.from("show").select('id, name, created_at, lastUpdated, length, limitedSeries, currentlyAiring, running, totalSeasons, service (id, name), airdate, releaseDate').match({id: showId}).single();
    
    if (!showData) return null;   

    const show: Show = {
      ...showData,
      service: showData.service as unknown as Service,
    };
    
    return show;
}

export async function getTags(showId: string): Promise<ShowTag[] | null> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore);
  const { data: tagData } = await supabase.from("ShowTagRelationship").select('tag:tagId (id, name, created_at)').match({showId: showId});
  
  if (!tagData) return null;
  
  const tags = tagData.map((obj) => obj.tag) as unknown as ShowTag[];
  
  return tags;
}

export async function getAllTags(showId: string): Promise<ShowTag[] | null> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore);
  const { data: tagData } = await supabase.from("showTag").select('id, name, created_at');
  
  if (!tagData) return null; 
  
  const tags = tagData as ShowTag[];
  
  return tags;
}

export async function getShowImageURL(showName: string): Promise<string> {
  if (!firebaseImageBaseURL) await setFirebaseImageBaseURL();
  var baseURL = firebaseImageBaseURL;
  var showNameURL = `${baseURL}${showName}_640x640.jpeg?alt=media`;
  return showNameURL;
}

export async function getShowImage(showName: string): Promise<ShowImage | null> {
  //const storage = firebaseStorage;

  // Create a reference under which you want to list
  //const imageRef = ref(storage, `showImages/resizedImages/${showName}_640x640.jpeg`);
  try {
    //const url = await getDownloadURL(imageRef);
    const url = await getShowImageURL(showName);
    const response = await fetch(url);
    const imageBuffer = await response.arrayBuffer();

    // Use sharp to resize the image to 1x1 and get the RGB values
    const { data } = await sharp(Buffer.from(imageBuffer))
      .resize(1, 1)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const averageColor = `rgb(${data[0]},${data[1]},${data[2]})`;
    return { imageUrl: url, averageColor };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getRatingCounts(showId: string): Promise<RatingCounts | null> {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore);
  const { data: ratingData } = await supabase.from("showratingcounts").select('rating, count').match({showId: showId});
  
  if (!ratingData) return null;
  var output: Record<Rating, number> = {
    [Rating.DISLIKED]: 0,
    [Rating.MEH]: 0,
    [Rating.LIKED]: 0,
    [Rating.LOVED]: 0
  };

  const ratings = Object.values(Rating) as Rating[];
  for (const ratingOption of ratings) {
    const ratingCount = ratingData.find((rating) => rating.rating === ratingOption)?.count;
    output[ratingOption] = ratingCount ?? 0;
  }

  /*
  const mockData: RatingCounts = {
    [Rating.DISLIKED]: 50,
    [Rating.MEH]: 2,
    [Rating.LIKED]: 5,
    [Rating.LOVED]: 200
  };
  */

  return output;
}
