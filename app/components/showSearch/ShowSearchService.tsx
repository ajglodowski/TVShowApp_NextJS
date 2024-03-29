import { Show, ShowPropertiesWithService } from "@/app/models/show";
import { ShowSearchFilters } from "./ShowSearchHeader/ShowSearchHeader";
import { createClient } from "@/utils/supabase/client";
import { Service } from "@/app/models/service";
import { UserShowData, UserShowDataParams } from "@/app/models/userShowData";
import { Status } from "@/app/models/status";
import { Rating } from "@/app/models/rating";
import { ShowSearchType } from "@/app/models/showSearchType";

export async function fetchShows(filters: ShowSearchFilters, searchType: ShowSearchType, otherUserId?: string): Promise<Show[] | null> {
    const supabase = createClient();
    let queryBase = supabase.from("show").select(ShowPropertiesWithService);

    if (filters.currentlyAiring !== undefined) queryBase = queryBase.eq('currentlyAiring', filters.currentlyAiring);
    if (filters.running !== undefined) queryBase = queryBase.eq('running', filters.running);
    if (filters.limitedSeries !== undefined) queryBase = queryBase.eq('limitedSeries', filters.limitedSeries);
    if (filters.service.length > 0) queryBase = queryBase.in('service', filters.service.map((service) => service.id));
    if (filters.airDate.length > 0) queryBase = queryBase.in('airdate', filters.airDate);

    //queryBase = queryBase.limit(100);
    if (searchType === ShowSearchType.WATCHLIST) {
        const { data: { user }, } = await supabase.auth.getUser();
        const currentUserId = user?.id;
        if (!currentUserId) return null;
        const showIds = (await getUserShowData({showIds: [], userId: currentUserId}))?.map((showData) => showData.showId);
        if (!showIds) return null;
        queryBase = queryBase.in('id', showIds);
    } 
    if (searchType === ShowSearchType.OTHER_USER_WATCHLIST) {
        if (!otherUserId) return null;
        const showIds = (await getUserShowData({showIds: [], userId: otherUserId}))?.map((showData) => showData.showId);
        if (!showIds) return null;
        queryBase = queryBase.in('id', showIds);
    }
    if (searchType === ShowSearchType.DISCOVER_NEW) {
        const { data: { user }, } = await supabase.auth.getUser();
        const currentUserId = user?.id;
        if (!currentUserId) return null;
        const showIds = (await getUserShowData({showIds: [], userId: currentUserId}))?.map((showData) => showData.showId);
        if (!showIds) return null;
        var showIdsString = '(';
        for (var i = 0; i < showIds.length; i++) {
            showIdsString += showIds[i];
            if (i < showIds.length - 1) {
                showIdsString += ', ';
            }
        }
        showIdsString += ')';
        queryBase = queryBase.not('id', 'in', showIdsString);
    }

    const { data: showData } = await queryBase;
    
    if (!showData) return null;

    const shows: Show[] = showData.map((show) => {
        return {
            ...show,
            service: show.service as unknown as Service
        };
    });
    
    
    return shows;
}

export async function getServices(): Promise<Service[] | null> {
    const supabase = createClient();
    const { data: serviceData } = await supabase.from("service").select();
    if (!serviceData) return null;
    const services: Service[] = serviceData;
    return services;
}

export async function getUserShowData({showIds, userId}: {showIds: string[], userId: string | undefined}): Promise<UserShowData[] | null> {

    if (!userId) return null;
  
    const supabase = createClient();
    var queryBase  = supabase.from("UserShowDetails").select(UserShowDataParams)
        .match({userId: userId});

    if (showIds.length > 0) queryBase = queryBase.in('showId', showIds);
    const { data: showData } = await queryBase;
    
    if (!showData) return null;   
  
    const output = [];
    for (const data of showData) {
        output.push({
            ...data,
            status: data.status as unknown as Status,
            rating: data.rating as unknown as Rating
        } as UserShowData);
    }
    
    return output;
}
