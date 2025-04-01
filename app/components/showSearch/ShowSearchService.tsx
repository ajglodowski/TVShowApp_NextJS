import { Show, ShowPropertiesWithService } from "@/app/models/show";
import { ShowSearchFiltersType } from "./ShowSearchHeader/ShowSearchHeader";
import { createClient, publicClient } from "@/app/utils/supabase/server";
import { Service } from "@/app/models/service";
import { UserShowDataWithUserInfo, UserShowDataWithUserInfoParams } from "@/app/models/userShowData";
import { Status } from "@/app/models/status";
import { Rating } from "@/app/models/rating";
import { ShowSearchType } from "@/app/models/showSearchType";
import { UserBasicInfo } from "@/app/models/user";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { AirDate } from "@/app/models/airDate";

export async function fetchShows(filters: ShowSearchFiltersType, searchType: ShowSearchType, otherUserId?: string, currentUserId?: string): Promise<Show[] | null> {
    const supabase = await createClient();
    let queryBase = supabase.from("show").select(ShowPropertiesWithService);
    
    if (filters.currentlyAiring !== undefined) queryBase = queryBase.eq('currentlyAiring', filters.currentlyAiring);
    if (filters.running !== undefined) queryBase = queryBase.eq('running', filters.running);
    if (filters.limitedSeries !== undefined) queryBase = queryBase.eq('limitedSeries', filters.limitedSeries);
    if (filters.service.length > 0) queryBase = queryBase.in('service', filters.service.map((service) => service.id));
    if (filters.airDate.length > 0) queryBase = queryBase.in('airdate', filters.airDate);
    if (filters.length.length > 0) queryBase = queryBase.in('length', filters.length);
    

    //queryBase = queryBase.limit(100);
    if (searchType === ShowSearchType.WATCHLIST) {
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
        if (!currentUserId) return null;
        const showIds = (await getUserShowData({showIds: [], userId: currentUserId}))?.map((showData) => showData.showId);
        if (!showIds) return null;
        let showIdsString = '(';
        for (let i = 0; i < showIds.length; i++) {
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

    const shows: Show[] = showData.map((show: any) => {
        return {
            ...show,
            service: show.service as unknown as Service
        };
    });
    
    return shows;
}

export type UserWatchListData = {
    show: Show;
    userShowData: UserShowDataWithUserInfo;
}

export async function fetchUsersWatchlist(userId: string): Promise<UserWatchListData[] | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .rpc('fetch_watchlist_for_user', { userid: userId });

    if (error) {
        console.error(error);
        return null;
    }

    const shows: UserWatchListData[] = data.map((row: any) => ({
        show: {
            id: row.id,
            createdAt: row.created_at,
            lastUpdated: row.lastupdated,
            name: row.name,
            service: {
                id: row.service,
                name: row.service_name
            },
            running: row.running,
            limitedSeries: row.limitedseries,
            totalSeasons: row.totalseasons,
            releaseDate: row.releasedate,
            airDate: row.airdate,
            currentlyAiring: row.currentlyairing,
            length: row.length,
            firebaseShowId: row.firebaseshowid,
            pictureUrl: row.pictureurl
        },
        userShowData: {
            user: {
                id: row.user_id,
                username: row.username,
                profilePhotoURL: row.profilephotourl
            },
            showId: row.showid,
            status: row.status,
            updated: row.user_details_updated,
            currentSeason: row.currentseason,
            rating: row.rating,
            createdAt: row.user_details_created_at
        }
    }));
    return shows;
}

export function filterWatchlist(UserWatchListData: UserWatchListData[] | null, filters: ShowSearchFiltersType): UserWatchListData[] | null {
    if (!UserWatchListData) return null;
    let filteredShows = [...UserWatchListData];
    if (filters.currentlyAiring !== undefined) filteredShows = filteredShows.filter((show) => show.show.currentlyAiring === filters.currentlyAiring);
    if (filters.running !== undefined) filteredShows = filteredShows.filter((show) => show.show.running === filters.running);
    if (filters.limitedSeries !== undefined) filteredShows = filteredShows.filter((show) => show.show.limitedSeries === filters.limitedSeries);
    if (filters.service.length > 0) filteredShows = filteredShows.filter((show) => filters.service.map((service) => service.id).includes(show.show.service.id));
    if (filters.airDate.length > 0) filteredShows = filteredShows.filter((show) => filters.airDate.includes(show.show.airdate as AirDate));
    if (filters.length.length > 0) filteredShows = filteredShows.filter((show) => filters.length.includes(show.show.length));
    return filteredShows;
}

export async function getServices(): Promise<Service[] | null> {
    'use cache'
    cacheLife('days');
    const supabase = await publicClient();
    const { data: serviceData } = await supabase.from("service").select();
    if (!serviceData) return null;
    const services: Service[] = serviceData;
    return services;
}

export async function getUserShowData({showIds, userId}: {showIds: string[], userId: string | undefined}): Promise<UserShowDataWithUserInfo[] | null> {

    if (!userId) return null;
  
    const supabase = await createClient();
    let queryBase = supabase.from("UserShowDetails").select(UserShowDataWithUserInfoParams)
        .match({userId: userId});

    if (showIds.length > 0) queryBase = queryBase.in('showId', showIds);
    const { data: showData } = await queryBase;
    
    if (!showData) return null;   
  
    const output = [];
    for (const data of showData) {
        output.push({
            ...data,
            user: data.user as unknown as UserBasicInfo,
            status: data.status as unknown as Status,
            rating: data.rating as unknown as Rating
        } as UserShowDataWithUserInfo);
    }
    //console.log(output);
    
    return output;
}
