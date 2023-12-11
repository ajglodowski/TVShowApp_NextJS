import { cookies } from "next/headers";
import { createClient } from '@/utils/supabase/server';
import { Show } from "@/app/models/show";
import { ShowTag } from "@/app/models/showTag";
import { Service } from "@/app/models/service";
import { ref, getDownloadURL } from "firebase/storage";
import { firebaseStorage } from "@/app/firebaseConfig";
import { ShowImage } from "@/app/models/showImage";
import sharp from 'sharp';

export async function getShow( showId: string ): Promise<Show | null> {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const { data: showData } = await supabase.from("show").select('id, name, created_at, lastUpdated, length, limitedSeries, currentlyAiring, running, totalSeasons, service (id, name)').match({id: showId}).single();
    
    if (!showData) return null;   

    const show: Show = {
        ...showData,
        service: showData.service as unknown as Service
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

export async function getShowImage(showName: string): Promise<ShowImage | null> {
  const storage = firebaseStorage;

  // Create a reference under which you want to list
  const imageRef = ref(storage, `showImages/${showName}.jpg`);
  try {
    const url = await getDownloadURL(imageRef);
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
    console.log(error);
    return null;
  }

}
