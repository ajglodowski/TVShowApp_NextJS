import { Show, ShowPropertiesWithService, ShowAnalyticsProperties, ShowAnalytics, ShowWithAnalytics } from "@/app/models/show";
import { ShowSearchFiltersType } from "./ShowSearchHeader/ShowSearchHeader";
import { createClient, publicClient } from "@/app/utils/supabase/server";
import { Service } from "@/app/models/service";
import { UserShowDataWithUserInfo, UserShowDataWithUserInfoParams } from "@/app/models/userShowData";
import { Status } from "@/app/models/status";
import { Rating, RatingPoints } from "@/app/models/rating";
import { ShowSearchType } from "@/app/models/showSearchType";
import { UserBasicInfo } from "@/app/models/user";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { AirDate } from "@/app/models/airDate";

export async function fetchShows(filters: ShowSearchFiltersType, searchType: ShowSearchType, otherUserId?: string, currentUserId?: string): Promise<ShowWithAnalytics[] | null> {
    const supabase = await createClient();
    let queryBase;
    
    // Determine if we should use the analytics view based on sort field
    const sortField = filters.sortBy?.split('-')[0];
    const sortDirection = filters.sortBy?.split('-')[1] || 'desc';
    const useAnalyticsView = sortField === 'weekly_popularity' || 
                            sortField === 'monthly_popularity' || 
                            sortField === 'yearly_popularity' ||
                            sortField === 'avg_rating';
    
    if (useAnalyticsView) {
        // Query the materialized view for sorting by popularity metrics
        queryBase = supabase.from("show_analytics")
            .select(ShowAnalyticsProperties);
        
        // Apply server-side sorting for analytics metrics
        if (sortField === 'weekly_popularity') {
            queryBase = queryBase.order('weekly_updates', { ascending: sortDirection === 'asc' });
        } else if (sortField === 'monthly_popularity') {
            queryBase = queryBase.order('monthly_updates', { ascending: sortDirection === 'asc' });
        } else if (sortField === 'yearly_popularity') {
            queryBase = queryBase.order('yearly_updates', { ascending: sortDirection === 'asc' });
        } else if (sortField === 'avg_rating') {
            queryBase = queryBase.order('avg_rating_points', { ascending: sortDirection === 'asc', nullsFirst: false });
        }
        
        // Apply filters on the view columns
        if (filters.currentlyAiring !== undefined) queryBase = queryBase.eq('currentlyAiring', filters.currentlyAiring);
        if (filters.running !== undefined) queryBase = queryBase.eq('running', filters.running);
        if (filters.limitedSeries !== undefined) queryBase = queryBase.eq('"limitedSeries"', filters.limitedSeries);
        if (filters.service.length > 0) queryBase = queryBase.in('service_id', filters.service.map((service) => service.id));
        if (filters.airDate.length > 0) queryBase = queryBase.in('airdate', filters.airDate);
        if (filters.length.length > 0) queryBase = queryBase.in('length', filters.length);
    } else {
        // Use the regular show table for other sorts
        queryBase = supabase.from("show").select(ShowPropertiesWithService);
        
        // Apply filters to the regular show table
        if (filters.currentlyAiring !== undefined) queryBase = queryBase.eq('currentlyAiring', filters.currentlyAiring);
        if (filters.running !== undefined) queryBase = queryBase.eq('running', filters.running);
        if (filters.limitedSeries !== undefined) queryBase = queryBase.eq('limitedSeries', filters.limitedSeries);
        if (filters.service.length > 0) queryBase = queryBase.in('service', filters.service.map((service) => service.id));
        if (filters.airDate.length > 0) queryBase = queryBase.in('airdate', filters.airDate);
        if (filters.length.length > 0) queryBase = queryBase.in('length', filters.length);
        
        // Apply sorting for the regular show table
        if (sortField === 'alphabetical') {
            queryBase = queryBase.order('name', { ascending: sortDirection === 'asc' });
        } else if (sortField === 'rating') {
            // This sorts by user's personal rating, handled client-side
            // We'll leave this as default alphabetical sort on the server
            queryBase = queryBase.order('name', { ascending: true });
        } else {
            // Default sort
            queryBase = queryBase.order('name', { ascending: true });
        }
    }

    // Handle filters for different search types
    if (searchType === ShowSearchType.WATCHLIST) {
        if (!currentUserId) return null;
        const showIds = (await getUserShowData({showIds: [], userId: currentUserId}))?.map((showData) => showData.showId);
        if (!showIds) return null;
        
        if (useAnalyticsView) {
            queryBase = queryBase.in('show_id', showIds);
        } else {
            queryBase = queryBase.in('id', showIds);
        }
    } 
    if (searchType === ShowSearchType.OTHER_USER_WATCHLIST) {
        if (!otherUserId) return null;
        const showIds = (await getUserShowData({showIds: [], userId: otherUserId}))?.map((showData) => showData.showId);
        if (!showIds) return null;
        
        if (useAnalyticsView) {
            queryBase = queryBase.in('show_id', showIds);
        } else {
            queryBase = queryBase.in('id', showIds);
        }
    }
    if (searchType === ShowSearchType.DISCOVER_NEW) {
        if (!!currentUserId) {
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
            
            if (useAnalyticsView) {
                queryBase = queryBase.not('show_id', 'in', showIdsString);
            } else {
                queryBase = queryBase.not('id', 'in', showIdsString);
            }
        }
    }

    const { data: showData } = await queryBase;
    
    if (!showData) return null;
    
    const shows: ShowWithAnalytics[] = showData.map((show: any) => {
        if (useAnalyticsView) {
            // Map analytics view fields to ShowWithAnalytics type
            const analyticsData = show as ShowAnalytics;
            const result = {
                id: analyticsData.show_id,
                name: analyticsData.show_name,
                created_at: new Date(), // Default value as it's not in the view
                lastUpdated: new Date(), // Default value as it's not in the view
                length: show.length || null,
                limitedSeries: analyticsData.limitedSeries || false,
                currentlyAiring: show.currentlyAiring || false,
                running: analyticsData.running || false,
                service: {
                    id: analyticsData.service_id,
                    name: analyticsData.service_name
                },
                totalSeasons: analyticsData.totalSeasons || 1,
                airdate: show.airdate,
                releaseDate: analyticsData.releaseDate,
                pictureUrl: analyticsData.pictureUrl,
                weekly_updates: typeof analyticsData.weekly_updates === 'number' ? analyticsData.weekly_updates : 0,
                monthly_updates: typeof analyticsData.monthly_updates === 'number' ? analyticsData.monthly_updates : 0,
                yearly_updates: typeof analyticsData.yearly_updates === 'number' ? analyticsData.yearly_updates : 0,
                avg_rating_points: typeof analyticsData.avg_rating_points === 'number' ? analyticsData.avg_rating_points : 0
            };
            return result;
        } else {
            // Regular show table mapping (no analytics data)
            return {
                ...show,
                service: show.service as unknown as Service
            } as ShowWithAnalytics;
        }
    });
    
    return shows;
}

export type UserWatchListData = {
    show: ShowWithAnalytics;
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
            created_at: row.created_at,
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
            airdate: row.airdate,
            currentlyAiring: row.currentlyairing,
            length: row.length,
            pictureUrl: row.pictureurl,
            // Analytics data
            weekly_updates: row.weekly_updates || 0,
            monthly_updates: row.monthly_updates || 0,
            yearly_updates: row.yearly_updates || 0,
            avg_rating_points: row.avg_rating_points || 0
        } as ShowWithAnalytics,
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
    
    // Sort the filtered watchlist data if a sort option is provided
    if (filters.sortBy) {
        const sortField = filters.sortBy.split('-')[0];
        const sortDirection = filters.sortBy.split('-')[1] || 'desc';
        const isAscending = sortDirection === 'asc';
        
        filteredShows.sort((a, b) => {
            if (sortField === 'alphabetical') {
                // Sort alphabetically by show name
                return isAscending ? 
                    a.show.name.localeCompare(b.show.name) : 
                    b.show.name.localeCompare(a.show.name);
            } else if (sortField === 'rating' && a.userShowData.rating && b.userShowData.rating) {
                // Sort by user's rating
                const aRating = a.userShowData.rating ? RatingPoints[a.userShowData.rating] || 0 : 0;
                const bRating = b.userShowData.rating ? RatingPoints[b.userShowData.rating] || 0 : 0;
                return isAscending ? aRating - bRating : bRating - aRating;
            } else if (sortField === 'weekly_popularity') {
                // Sort by weekly popularity
                const aUpdates = a.show.weekly_updates || 0;
                const bUpdates = b.show.weekly_updates || 0;
                return isAscending ? aUpdates - bUpdates : bUpdates - aUpdates;
            } else if (sortField === 'monthly_popularity') {
                // Sort by monthly popularity
                const aUpdates = a.show.monthly_updates || 0;
                const bUpdates = b.show.monthly_updates || 0;
                return isAscending ? aUpdates - bUpdates : bUpdates - aUpdates;
            } else if (sortField === 'yearly_popularity') {
                // Sort by yearly popularity
                const aUpdates = a.show.yearly_updates || 0;
                const bUpdates = b.show.yearly_updates || 0;
                return isAscending ? aUpdates - bUpdates : bUpdates - aUpdates;
            } else if (sortField === 'avg_rating') {
                // Sort by average rating
                const aRating = a.show.avg_rating_points || 0;
                const bRating = b.show.avg_rating_points || 0;
                return isAscending ? aRating - bRating : bRating - aRating;
            }
            // Default sort by name
            return a.show.name.localeCompare(b.show.name);
        });
    }
    
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
