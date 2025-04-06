import { apiRoute } from "@/app/envConfig";
import { Service } from "@/app/models/service";
import { Show, ShowPropertiesWithService } from "@/app/models/show";
import { ShowTag } from "@/app/models/showTag";
import { createClient } from "@/app/utils/supabase/client";
import { cache } from "react";

export async function getShow( showId: string ): Promise<Show | null> {
    const supabase = createClient();
    const { data: showData } = await supabase.from("show").select(ShowPropertiesWithService).match({id: showId}).single();
    
    if (!showData) { console.log("HEre"); return null;   }

    const show: Show = {
        ...showData,
        service: showData.service as unknown as Service
    };
    
    
    return show;
}

export async function updateShow(show: Show): Promise<boolean> {
    const supabase = createClient();
    const showData: any = { ...show };
    showData.service = showData.service.id;
    let query = supabase.from("show").upsert(showData)
    if (show.id === 0) showData.id = undefined;
    else query = query.match({id: show.id});
    const { error } = await query;
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

export function getShowImageURL(showName: string, tile: boolean): string {
    const apiURL = `${apiRoute}/api/imageFetcher?path=showImages/resizedImages&imageName=`;
    const transformedName = encodeURIComponent(showName);
    const dimensions = tile ? "200x200" : "640x640";
    const showNameURL = `${apiURL}${transformedName}_${dimensions}.jpeg`;
    return showNameURL;
}

export const getImageURLFromCache = (fullPath: string): string | null => {
    const sessionStorageValue = JSON.parse(sessionStorage.getItem(fullPath) || "{}");
    if (sessionStorageValue.timestamp > Date.now() - 60 * 10) { // 10 minutes
        return sessionStorageValue.url;
    } else {
        sessionStorage.removeItem(fullPath);
        return null;
    }
}

export const setImageURLInCache = (fullPath: string, url: string): void => {
    const sessionStorageItem = JSON.stringify({ url, timestamp: Date.now() });
    sessionStorage.setItem(fullPath, sessionStorageItem);
}

export const getPresignedShowImageURL = cache(async (showName: string, tile: boolean): Promise<string | null> => {
    const apiURL = `${apiRoute}/api/imageUrlFetcher?path=showImages/resizedImages&imageName=`;
    const transformedName = encodeURIComponent(showName);
    const dimensions = tile ? "200x200" : "640x640";
    const showNameURL = `${apiURL}${transformedName}_${dimensions}.jpeg`;

    if (getImageURLFromCache(showNameURL)) {
        return getImageURLFromCache(showNameURL);
    }

    const response = await fetch(showNameURL, {
        next: {
            revalidate: 60 * 5 // 5 minutes
        }
    });
    if (response.status !== 200) return null;
    const data = await response.json();
    setImageURLInCache(showNameURL, data.url);
    return data.url;
});

export async function addShowTag(showId: string, tag: ShowTag): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase.from("ShowTagRelationship").insert({showId: showId, tagId: tag.id});
    if (error) {
      console.error(error);
      return false;
    }
    return true;
  }
  
export async function removeShowTag(showId: string, tag: ShowTag): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase.from("ShowTagRelationship").delete().match({showId: showId, tagId: tag.id});
    if (error) {
      console.error(error);
      return false;
    }
    return true;
}

export async function getServices(): Promise<Service[] | null> {
    const supabase = await createClient();
    const { data: serviceData } = await supabase.from("service").select();
    if (!serviceData) return null;
    const services: Service[] = serviceData;
    return services;
}