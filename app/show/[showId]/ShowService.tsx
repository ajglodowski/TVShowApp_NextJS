import { createClient } from '@/utils/supabase/server';
import { Show, ShowPropertiesWithService } from "@/app/models/show";
import { ShowTag } from "@/app/models/showTag";
import { Service } from "@/app/models/service";
//import { ref, getDownloadURL } from "firebase/storage";
//import { firebaseImageBaseURL, firebaseStorage, setFirebaseImageBaseURL } from "@/app/firebaseConfig";
import { ShowImage } from "@/app/models/showImage";
import sharp from 'sharp';
import { Rating } from "@/app/models/rating";
import { RatingCounts } from "@/app/models/ratingCounts";
import { StatusCount } from "@/app/models/statusCount";
import { Status } from "@/app/models/status";
import { serverBaseURL } from '@/app/envConfig';

export async function getShow( showId: string ): Promise<Show | null> {
    
    const supabase = await createClient();
    const { data: showData } = await supabase.from("show").select(ShowPropertiesWithService).match({id: showId}).single();
    
    if (!showData) return null;   

    const show: Show = {
      ...showData,
      service: showData.service as unknown as Service,
    };
    
    return show;
}

export async function getTags(showId: string): Promise<ShowTag[] | null> {
  
  const supabase = await createClient();
  const { data: tagData } = await supabase.from("ShowTagRelationship").select('tag:tagId (id, name, created_at)').match({showId: showId});
  
  const { data: actorData } = await supabase
            .from("ActorShowRelationship")
            .select("showId, actor!inner(id, name)")
            .match({"showId": showId});

  console.log(actorData);
  
  if (!tagData) return null;
  
  const tags = tagData.map((obj) => obj.tag) as unknown as ShowTag[];
  
  return tags;
}

export async function getAllTags(): Promise<ShowTag[] | null> {
  
  const supabase = await createClient();
  const { data: tagData } = await supabase.from("showTag").select('id, name, created_at');
  
  if (!tagData) return null; 
  
  const tags = tagData as ShowTag[];
  /*
  const TagCategoryProperties = "id, created_at, name"
  const NestedTagProperties = `showTag (id, created_at, name, category (${TagCategoryProperties}))`
  const { data: dummyData } = await supabase
    .from("ShowTagRelationship")
    .select(NestedTagProperties)
    .eq("showId", showId)

  const string = JSON.stringify(dummyData);
  console.log(dummyData);
  */
  
  return tags;
}

export function getShowImageURL(showName: string, tile: boolean): string {
  const apiURL = `${serverBaseURL}/api/imageFetcher?imageName=`;
  const transformedName = showName.replace(/ /g, "%20");
  const dimensions = tile ? "200x200" : "640x640";
  const showNameURL = `${apiURL}${transformedName}_${dimensions}.jpeg`;
  return showNameURL;
}

export async function fetchAverageColor(imageUrl: string): Promise<string> {
  const apiURL = `${serverBaseURL}/api/averageColor?imageUrl=${imageUrl}`;
  const response = await fetch(apiURL);
  if (response.status !== 200) return "rbg(0,0,0)";
  const { averageColor } = await response.json();
  return averageColor;
}

export async function getShowImage(showName: string, tile: boolean): Promise<ShowImage | null> {
  //const storage = firebaseStorage;

  // Create a reference under which you want to list
  //const imageRef = ref(storage, `showImages/resizedImages/${showName}_640x640.jpeg`);
  try {
    //const url = await getDownloadURL(imageRef);
    // Timestamp for performance testing
    const url = await getShowImageURL(showName, tile);
    const response = await fetch(url);
    if (response.status !== 200) return null;
    const imageBuffer = await response.arrayBuffer();
    // Use sharp to resize the image to 1x1 and get the RGB values
    const { data } = await sharp(Buffer.from(imageBuffer))
      .resize(1, 1)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const averageColor = `rgb(${data[0]},${data[1]},${data[2]})`;
    // Timestamp for performance testing
    return { imageUrl: url, averageColor };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getRatingCounts(showId: string): Promise<RatingCounts | null> {
  
  const supabase = await createClient();
  const { data: ratingData } = await supabase.from("showratingcounts").select('rating, count').match({showId: showId});
  
  if (!ratingData) return null;
  const output: Record<Rating, number> = {
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

export async function getStatusCounts(showId: string): Promise<StatusCount[] | null> {
  
  const supabase = await createClient();
  const { data: ratingData } = await supabase.from("showstatuscounts").select('status:status(id, name), count').match({showId: showId});
  if (!ratingData) return null;
  const output = [];
  for (const status of ratingData) {
    output.push({
      status: status.status as unknown as Status,
      count: status.count
    } as unknown as StatusCount);
  }
  return output;
}
