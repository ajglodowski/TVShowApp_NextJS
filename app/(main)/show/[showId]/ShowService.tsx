import { generatePresignedUrlAction, getAverageColorAction } from "@/app/actions/imageActions";
import { serverBaseURL } from '@/app/envConfig';
import { Actor } from "@/app/models/actor";
import { Rating } from "@/app/models/rating";
import { RatingCounts } from "@/app/models/ratingCounts";
import { Service } from "@/app/models/service";
import { Show, ShowPropertiesWithService } from "@/app/models/show";
import { ShowTag } from "@/app/models/showTag";
import { Status } from "@/app/models/status";
import { StatusCount } from "@/app/models/statusCount";
import { createClient, publicClient } from '@/app/utils/supabase/server';
import { cacheLife } from 'next/dist/server/use-cache/cache-life';
import { cache } from 'react';

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
  const dimensions = tile ? "200x200" : "640x640";
  const imageName = `${showName}_${dimensions}.jpeg`; 
  const path = 'showImages/resizedImages';

  const presignedUrl = await generatePresignedUrlAction(path, imageName);
  return presignedUrl;
});

export const fetchAverageShowColor = cache(async function (showName: string): Promise<string> {
  'use cache';
  cacheLife('days');
  // Construct the image path using the raw showName
  const imagePath = `showImages/resizedImages/${showName}_200x200.jpeg`; 
  // Call the server action directly
  const averageColor = await getAverageColorAction(imagePath);
  // Return the result from the action, defaulting to black if null
  return averageColor || "rgb(0,0,0)";
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


