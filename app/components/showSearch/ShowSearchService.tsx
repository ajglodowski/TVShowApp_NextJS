"use server";

import { AirDate } from "@/app/models/airDate";
import { Rating, RatingPoints } from "@/app/models/rating";
import { Service } from "@/app/models/service";
import { convertRawShowAnalyticsToShowWithAnalytics, ShowAnalytics, ShowAnalyticsProperties, ShowPropertiesWithService, ShowWithAnalytics } from "@/app/models/show";
import { ShowSearchType } from "@/app/models/showSearchType";
import { Status } from "@/app/models/status";
import { UserBasicInfo } from "@/app/models/user";
import { UserShowDataWithUserInfo, UserShowDataWithUserInfoParams } from "@/app/models/userShowData";
import { createClient, publicClient } from "@/app/utils/supabase/server";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cache } from "react";
import { ShowSearchFiltersType } from "./ShowSearchHeader/ShowSearchHeader";
import { ShowTag } from "@/app/models/showTag";
import { UserWatchListData } from './types';

export const getServices = cache(async (): Promise<Service[] | null> => {
    'use cache'
    cacheLife('days');
    const supabase = await publicClient();
    const { data: serviceData } = await supabase.from("service").select();
    return serviceData;
});

export async function fetchShows(filters: ShowSearchFiltersType, searchType: ShowSearchType, otherUserId?: string, currentUserId?: string): Promise<ShowWithAnalytics[] | null> {
    const supabase = await createClient();
    let queryBase;
    
    // Check if we need to filter by tags
    const hasTagFilters = filters.tags && filters.tags.length > 0;
    
    // First, determine if we're filtering to a specific set of shows (like a watchlist)
    let filterShowIds: number[] | null = null;
    
    // Get show IDs for watchlist filtering if needed
    if (searchType === ShowSearchType.WATCHLIST) {
        if (!currentUserId) return null;
        const watchlistShowData = await getUserShowData({showIds: [], userId: currentUserId});
        if (!watchlistShowData) return null;
        filterShowIds = watchlistShowData.map(showData => Number(showData.showId));
    } 
    else if (searchType === ShowSearchType.OTHER_USER_WATCHLIST) {
        if (!otherUserId) return null;
        const watchlistShowData = await getUserShowData({showIds: [], userId: otherUserId});
        if (!watchlistShowData) return null;
        filterShowIds = watchlistShowData.map(showData => Number(showData.showId));
    }
    
    // If we have tag filters, get shows that match the tags
    let tagFilteredShowIds: number[] | null = null;
    if (hasTagFilters) {
        const tagIds = filters.tags.map(tag => tag.id);
        
        if (tagIds && tagIds.length > 0) {
            try {
                const supabase = await createClient();
                // Fetch shows with these tags from the ShowTagRelationship table
                const { data: taggedShows, error: tagError } = await supabase
                    .from('ShowTagRelationship')
                    .select('showId')
                    .in('tagId', tagIds);
                
                if (tagError) {
                    console.error("Error fetching tagged shows:", tagError);
                } else {
                    if (taggedShows && taggedShows.length > 0) {
                        // Extract unique show IDs
                        const showIdMap = new Map();
                        taggedShows.forEach(item => {
                            showIdMap.set(Number(item.showId), true);
                        });
                        
                        tagFilteredShowIds = Array.from(showIdMap.keys());
                        
                        if (tagFilteredShowIds.length === 0) {
                            // If no shows have these tags, return empty array
                            return [];
                        }
                    } else {
                        // No shows match the selected tags
                        return [];
                    }
                }
            } catch (err) {
                console.error("Exception in tag filtering:", err);
            }
        }
    }
    
    // Determine if we should use the analytics view based on sort field
    const sortField = filters.sortBy?.split('-')[0];
    const sortDirection = filters.sortBy?.split('-')[1] || 'desc';
    const useAnalyticsView = sortField === 'weekly_popularity' || 
                            sortField === 'monthly_popularity' || 
                            sortField === 'yearly_popularity' ||
                            sortField === 'avg_rating';
    
    // Now set up the main query with correct show ID filters
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
        if (filters.currentlyAiring !== undefined && filters.currentlyAiring !== null) queryBase = queryBase.eq('currentlyAiring', filters.currentlyAiring);
        if (filters.running !== undefined && filters.running !== null) queryBase = queryBase.eq('running', filters.running);
        if (filters.limitedSeries !== undefined && filters.limitedSeries !== null) queryBase = queryBase.eq('"limitedSeries"', filters.limitedSeries);
        if (filters.service.length > 0) queryBase = queryBase.in('service_id', filters.service.map((service) => service.id));
        if (filters.airDate.length > 0) queryBase = queryBase.in('airdate', filters.airDate);
        if (filters.length.length > 0) queryBase = queryBase.in('length', filters.length);

        if (filters.totalSeasons && filters.totalSeasons.length > 0) {
            const exactSeasons: number[] = [];
            const ranges: string[] = [];
            
            filters.totalSeasons.forEach(s => {
                if (s.includes('-') || s.includes('+')) {
                    ranges.push(s);
                } else {
                    const num = parseInt(s);
                    if (!isNaN(num)) exactSeasons.push(num);
                }
            });
            
            const column = '"totalSeasons"';
            const conditions = [];
            
            if (exactSeasons.length > 0) {
                conditions.push(`${column}.in.(${exactSeasons.join(',')})`);
            }
            
            ranges.forEach(range => {
                if (range === '5-10') {
                     conditions.push(`and(${column}.gte.5,${column}.lte.10)`);
                } else if (range === '11-20') {
                     conditions.push(`and(${column}.gte.11,${column}.lte.20)`);
                } else if (range === '21+') {
                     conditions.push(`${column}.gte.21`);
                }
            });
            
            if (conditions.length > 0) {
                queryBase = queryBase.or(conditions.join(','));
            }
        }
        
        // Apply show ID filters from watchlist/tags
        if (tagFilteredShowIds) {
            // If we have tag filters, use those IDs
            queryBase = queryBase.in('show_id', tagFilteredShowIds);
        } else if (filterShowIds) {
            // Otherwise use watchlist IDs if available
            queryBase = queryBase.in('show_id', filterShowIds);
        }
    } else {
        // Use the regular show table for other sorts
        queryBase = supabase.from("show").select(ShowPropertiesWithService);
        
        // Apply filters to the regular show table
        if (filters.currentlyAiring !== undefined && filters.currentlyAiring !== null) queryBase = queryBase.eq('currentlyAiring', filters.currentlyAiring);
        if (filters.running !== undefined && filters.running !== null) queryBase = queryBase.eq('running', filters.running);
        if (filters.limitedSeries !== undefined && filters.limitedSeries !== null) queryBase = queryBase.eq('limitedSeries', filters.limitedSeries);
        if (filters.service.length > 0) queryBase = queryBase.in('service', filters.service.map((service) => service.id));
        if (filters.airDate.length > 0) queryBase = queryBase.in('airdate', filters.airDate);
        if (filters.length.length > 0) queryBase = queryBase.in('length', filters.length);
        
        if (filters.totalSeasons && filters.totalSeasons.length > 0) {
            const exactSeasons: number[] = [];
            const ranges: string[] = [];
            
            filters.totalSeasons.forEach(s => {
                if (s.includes('-') || s.includes('+')) {
                    ranges.push(s);
                } else {
                    const num = parseInt(s);
                    if (!isNaN(num)) exactSeasons.push(num);
                }
            });
            
            const column = 'totalSeasons';
            const conditions = [];
            
            if (exactSeasons.length > 0) {
                conditions.push(`${column}.in.(${exactSeasons.join(',')})`);
            }
            
            ranges.forEach(range => {
                if (range === '5-10') {
                     conditions.push(`and(${column}.gte.5,${column}.lte.10)`);
                } else if (range === '11-20') {
                     conditions.push(`and(${column}.gte.11,${column}.lte.20)`);
                } else if (range === '21+') {
                     conditions.push(`${column}.gte.21`);
                }
            });
            
            if (conditions.length > 0) {
                queryBase = queryBase.or(conditions.join(','));
            }
        }

        // Apply show ID filters from watchlist/tags
        if (tagFilteredShowIds) {
            // If we have tag filters, use those IDs
            queryBase = queryBase.in('id', tagFilteredShowIds);
        } else if (filterShowIds) {
            // Otherwise use watchlist IDs if available
            queryBase = queryBase.in('id', filterShowIds);
        }
        
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
    
    // Handle special case for DISCOVER_NEW (shows not in user's watchlist)
    if (searchType === ShowSearchType.DISCOVER_NEW && currentUserId) {
        const userShowData = await getUserShowData({showIds: [], userId: currentUserId});
        
        const showIds = userShowData?.map((showData) => showData.showId);
        
        if (showIds && showIds.length > 0) {
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

    const { data: showData, error } = await queryBase;
    
    if (error) {
        console.error("Error fetching shows:", error);
        return null;
    }
    
    if (!showData) return null;
    
    const shows: ShowWithAnalytics[] = showData.map((show: any) => {
        if (useAnalyticsView) {
            // Map analytics view fields to ShowWithAnalytics type
            return convertRawShowAnalyticsToShowWithAnalytics(show);
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

export async function filterWatchlist(UserWatchListData: UserWatchListData[] | null, filters: ShowSearchFiltersType): Promise<UserWatchListData[] | null> {
    if (!UserWatchListData) return null;
    let filteredShows = [...UserWatchListData];
    
    // Apply tag filters first
    if (filters.tags && filters.tags.length > 0) {
        // Get the tag IDs from the filters
        const tagIds = filters.tags.map(tag => tag.id);
        
        // Access the correct show ID from the data structure 
        const showIds = filteredShows.map(item => item.show.id);
        
        // If no shows in watchlist, return empty array
        if (showIds.length === 0) {
            return [];
        }
        
        // Query tag relationships for all shows in the watchlist
        const supabase = await createClient();
        const { data: taggedShowsData, error } = await supabase
            .from('ShowTagRelationship')
            .select('showId, tagId')
            .in('showId', showIds) // Only get relationships for shows in the watchlist
            .in('tagId', tagIds);  // Only get relationships for the selected tags
        
        if (taggedShowsData && taggedShowsData.length > 0) {
            // Get unique show IDs that have any of the selected tags
            const showIdsWithTags = Array.from(new Set(taggedShowsData.map(relation => relation.showId)));
            
            // Filter the watchlist to only include shows with matching tags
            filteredShows = filteredShows.filter(item => showIdsWithTags.includes(item.show.id));
        } else {
            // If no shows match the tags, return empty array
            return [];
        }
    }
    
    // Apply standard filters after tag filtering
    if (filters.currentlyAiring !== undefined && filters.currentlyAiring !== null) {
        filteredShows = filteredShows.filter((show) => show.show.currentlyAiring === filters.currentlyAiring);
    }
    
    if (filters.running !== undefined && filters.running !== null) {
        filteredShows = filteredShows.filter((show) => show.show.running === filters.running);
    }
    
    if (filters.limitedSeries !== undefined && filters.limitedSeries !== null) {
        filteredShows = filteredShows.filter((show) => show.show.limitedSeries === filters.limitedSeries);
    }
    
    if (filters.service.length > 0) {
        filteredShows = filteredShows.filter((show) => filters.service.map((service) => service.id).includes(show.show.service.id));
    }
    
    if (filters.airDate.length > 0) {
        filteredShows = filteredShows.filter((show) => filters.airDate.includes(show.show.airdate as AirDate));
    }
    
    if (filters.length.length > 0) {
        filteredShows = filteredShows.filter((show) => filters.length.includes(show.show.length));
    }
    
    if (filters.totalSeasons && filters.totalSeasons.length > 0) {
        filteredShows = filteredShows.filter((show) => {
            const seasons = show.show.totalSeasons;
            
            // Check if matches any exact number
            if (filters.totalSeasons.includes(seasons.toString())) {
                return true;
            }
            
            // Check if matches any range
            if (filters.totalSeasons.includes('5-10') && seasons >= 5 && seasons <= 10) return true;
            if (filters.totalSeasons.includes('11-20') && seasons >= 11 && seasons <= 20) return true;
            if (filters.totalSeasons.includes('21+') && seasons >= 21) return true;
            
            return false;
        });
    }

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
