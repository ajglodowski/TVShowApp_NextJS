import { apiRoute } from "@/app/envConfig";
import { Service } from "@/app/models/service";
import { Show, ShowPropertiesWithService } from "@/app/models/show";
import { ShowTag } from "@/app/models/showTag";
import { createClient } from "@/app/utils/supabase/client";
import { cache } from "react";

export const getShowFromCache = (showId: string): Show | null => {
    const cacheKey = `show_${showId}`;
    const sessionStorageValue = JSON.parse(sessionStorage.getItem(cacheKey) || "null");
    if (sessionStorageValue && sessionStorageValue.timestamp > Date.now() - 60 * 10 * 1000) { // 10 minutes
        return sessionStorageValue.data;
    } else {
        sessionStorage.removeItem(cacheKey);
        return null;
    }
}

export const setShowInCache = (showId: string, show: Show): void => {
    const cacheKey = `show_${showId}`;
    const sessionStorageItem = JSON.stringify({ data: show, timestamp: Date.now() });
    sessionStorage.setItem(cacheKey, sessionStorageItem);
}

export const getShow = cache(async (showId: string): Promise<Show | null> => {
    // Check cache first
    const cachedShow = getShowFromCache(showId);
    if (cachedShow) {
        return cachedShow;
    }
    
    const supabase = createClient();
    const { data: showData } = await supabase.from("show").select(ShowPropertiesWithService).match({id: showId}).single();
    
    if (!showData) { return null; }

    const show: Show = {
        ...showData,
        service: showData.service as unknown as Service
    };
    
    // Store in cache
    setShowInCache(showId, show);
    
    return show;
});

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
    if (sessionStorageValue.timestamp > Date.now() - 60 * 1) { // 1 minute
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
        cache: 'force-cache',
        next: {
            revalidate: 60 * 1 // 1 minute
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

export async function searchShows(query: string): Promise<any[] | null> {
  'use client'
  const supabase = createClient();
  const { data } = await supabase.from('show').select('id, name').ilike('name', `%${query}%`).limit(10);
  
  if (!data) return null;
  return data;
}