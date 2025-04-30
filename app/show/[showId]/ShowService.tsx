import { Service } from "@/app/models/service";
import { Show, ShowPropertiesWithService } from "@/app/models/show";
import { ShowTag } from "@/app/models/showTag";
import { createClient, publicClient } from '@/app/utils/supabase/server';
import { serverBaseURL } from '@/app/envConfig';
import { Rating } from "@/app/models/rating";
import { RatingCounts } from "@/app/models/ratingCounts";
import { Status } from "@/app/models/status";
import { StatusCount } from "@/app/models/statusCount";
import { cacheLife } from 'next/dist/server/use-cache/cache-life';
import { cache } from 'react';
import { Actor } from "@/app/models/actor";
import { cookies } from "next/headers";
import { generatePresignedUrlAction } from "@/app/actions/imageActions";

export const getShow = cache(async (showId: string): Promise<Show | null> => {
  'use cache'
  cacheLife('hours');
  const supabase = await publicClient();
  const { data: showData } = await supabase.from("show").select(ShowPropertiesWithService).match({id: showId}).single();
  if (!showData) return null;
  const show: Show = {
    ...showData,
    service: showData.service as unknown as Service,
  };
  return show;
});

export async function getTags(showId: string): Promise<ShowTag[] | null> {
  const supabase = await createClient();
  const { data: tagData } = await supabase.from("ShowTagRelationship").select('tag:tagId (id, name, created_at)').match({showId: showId});
  
  if (!tagData) return null;
  
  const tags = tagData.map((obj) => obj.tag) as unknown as ShowTag[];
  
  return tags;
}

export const getAllTags = async function (): Promise<ShowTag[] | null> {
  'use cache'
  cacheLife('days');
  const supabase = await publicClient();
  const { data: tagData, error } = await supabase
    .from('showTag')
    .select('id, name, created_at');

  if (error) {
    console.error("Error fetching tags:", error);
    return null;
  }

  if (!tagData || tagData.length === 0) {
    console.log("No tags found in the database");
    return null;
  }

  const tags = tagData as ShowTag[];
  return tags;
};

export const getShowImageURL = cache((showName: string, tile: boolean): string => {
  const apiURL = `${serverBaseURL}/api/imageFetcher?path=showImages/resizedImages&imageName=`;
  const transformedName = encodeURIComponent(showName);
  const dimensions = tile ? "200x200" : "640x640";
  const showNameURL = `${apiURL}${transformedName}_${dimensions}.jpeg`;
  return showNameURL;
});

export const getPresignedShowImageURL = cache(async (showName: string, tile: boolean): Promise<string | null> => {
  // Construct the image name and path WITHOUT encoding the showName here
  const dimensions = tile ? "200x200" : "640x640";
  // Use the raw showName to construct the imageName
  const imageName = `${showName}_${dimensions}.jpeg`; 
  const path = 'showImages/resizedImages';

  // Call the server action directly with the raw imageName
  const presignedUrl = await generatePresignedUrlAction(path, imageName);
  
  // Return the result from the action
  return presignedUrl;
});

export const fetchAverageShowColor = cache(async function (showName: string): Promise<string> {
  'use cache';
  cacheLife('days');
  const imagePath = `showImages/resizedImages/${showName}_200x200.jpeg`;
  const encodedImagePath = encodeURIComponent(imagePath); // Encode the path
  const apiURL = `${serverBaseURL}/api/averageColor?imagePath=${encodedImagePath}`;
  const response = await fetch(apiURL);
  if (response.status !== 200) return "rgb(0,0,0)";
  const { averageColor } = await response.json();
  return averageColor;
});

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

export async function getActorsForShow(showId: number): Promise<Actor[] | null> {
  const supabase = await createClient();
  const { data: actorData } = await supabase.from("ActorShowRelationship").select('actor: actorId (id, name)').match({showId: showId});
  if (!actorData) return null;
  const actors = actorData.map((obj) => obj.actor) as unknown as Actor[];
  return actors;
}

export async function getSimilarShows(showId: number, limit: number = 10): Promise<number[] | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.rpc('get_similar_show_ids', {
      input_show_id: showId,
      limit_count: limit
    });

    if (error) {
      console.error('Error fetching similar shows:', error.message);
      return null;
    }

    if (data && Array.isArray(data)) {
      const showIds = data.map((item: { similar_show_id: number }) => item.similar_show_id);
      return showIds;
    } else {
      console.warn('No similar shows found or unexpected data format for showId:', showId);
      return [];
    }

  } catch (err) {
    console.error('Unexpected error in getSimilarShows:', err);
    return null;
  }
}