import { getUserImageURL } from "@/utils/userService";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cache } from "react";
import { serverBaseURL } from "../envConfig";

export async function getProfilePic (username: string): Promise<string|null> {
    return getUserImageURL(username);
}

export const getPresignedUserImageURL = cache(async (picLocation: string): Promise<string | null> => {
    "use cache";
    cacheLife({
      stale: 300, // 5 minutes
      revalidate: 300, // 5 minutes
      expire: 600, // 10 minutes
    });
    const apiURL = `${serverBaseURL}/api/imageUrlFetcher?path=profilePics&imageName=`;
    const transformedName = encodeURIComponent(picLocation);
    //const dimensions = tile ? "200x200" : "640x640";
    const showNameURL = `${apiURL}${transformedName}`;


    const response = await fetch(showNameURL, {
      next: {
        revalidate: 60 * 5 // 5 minutes
      }
    });
    if (response.status !== 200) return null;
    const data = await response.json();
    return data.url;
  });