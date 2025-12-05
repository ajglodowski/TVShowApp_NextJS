import { serverBaseURL } from "@/app/envConfig";
import { createClient, publicClient } from "./supabase/server";
import { User, UserBasicInfo } from "@/app/models/user";
import { UserFollowRelationship } from "@/app/models/userFollowRelationship";
import { ShowTag } from "@/app/models/showTag";
import { cache } from 'react';
import { Service } from "../models/service";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { Actor } from "../models/actor";

export const getUser = cache(async (userId: string): Promise<User | null> => {
    'use cache'
    cacheLife('minutes');
    const supabase = await publicClient();
    const { data: userData } = await supabase.from("user").select().match({id: userId}).single();
    if (!userData) return null;
    return userData as User;
});

export const isAdmin = cache(async (userId: string | undefined): Promise<boolean> => {
    'use cache'
    cacheLife('days');
    if (!userId) return false;
    const supabase = await publicClient();
    const { data: userData } = await supabase.from("user").select("role").eq("id", userId).single();
    return userData?.role === 'admin';
});

export const getUserByUsername = cache(async (username: string): Promise<User | null> => {
    'use cache'
    cacheLife('hours');
    const supabase = await publicClient();
    const { data: userData } = await supabase.from("user").select().match({username: username}).single();
    if (!userData) return null;
    return userData as User;
  });

export async function getShowsLogged( userId: string ): Promise<number | null> {
    const supabase = await createClient();
    const { count: count } = await supabase.from("UserShowDetails").select('*', { count: 'exact', head: true }).match({userId: userId});
    
    if (!count) return null;   
    
    return count as number;
}

export function getUserImageURL(username: string): string {
  const apiURL = `${serverBaseURL}/api/imageFetcher?path=profilePics&imageName=`;
  const transformedName = encodeURIComponent(username);
  //const dimensions = tile ? "200x200" : "640x640";
  const showNameURL = `${apiURL}${transformedName}`;
  return showNameURL;
}

export async function getUserFollowRelationship(followingUser: string, followerUser: string): Promise<UserFollowRelationship | null> {
    const supabase = await createClient();
    const { data: relationshipData } = await supabase.from("UserFollowRelationship").select().match({followingUserId: followingUser, followerUser: followerUser}).single();
    if (!relationshipData) return null;

    return relationshipData as UserFollowRelationship;
}

export type ShowTagCountDTO = {
    tag: ShowTag;
    count: number;
}

export async function getUserTopTags(userId: string): Promise<ShowTagCountDTO[] | null> {
    'use cache'
    cacheLife('minutes');
    const supabase = await publicClient();
    const { data, error } = await supabase
        .rpc('get_user_tag_counts', { user_id: userId })
    
    if (error) {
        console.error(error);
        return null;
    }
    type RawTagData = {
        tag_id: number;
        tag_name: string;
        tag_count: number;
    }
    const mappedData = data.map((rawData: RawTagData) => {
        return {
            tag: {
                name: rawData.tag_name,
                id: rawData.tag_id
            },
            count: rawData.tag_count
        };
    });
    return mappedData;
}

export type ShowServiceCountDTO = {
    service: Service;
    count: number;
}
export async function getUserTopServices(userId: string): Promise<ShowServiceCountDTO[] | null> {
    'use cache'
    cacheLife('minutes');
    const supabase = await publicClient();
    const { data, error } = await supabase
        .rpc('get_user_service_counts', { user_id: userId })
    
    if (error) {
        console.error(error);
        return null;
    }
    type RawServiceData = {
        service_id: number;
        service_name: string;
        service_count: number;
    }
    const mappedData: ShowServiceCountDTO[] = data.map((rawData: RawServiceData) => {
        return {
            service: {
                name: rawData.service_name,
                id: rawData.service_id
            },
            count: rawData.service_count
        } as ShowServiceCountDTO;
    });
    return mappedData;
}

export type TagRatingDTO = {
    tag: ShowTag;
    avgRating: number;
    count: number;
}

export async function getUserTagRatings(userId: string): Promise<TagRatingDTO[] | null> {
    'use cache'
    cacheLife('minutes');
    const supabase = await publicClient();
    const { data, error } = await supabase
        .rpc('get_user_avg_rating_by_tag', { user_id: userId })
    
    if (error) {
        console.error(error);
        return null;
    }
    type RawTagRatingData = {
        tag_id: number;
        tag_name: string;
        avg_rating: number;
        show_count: number;
    }
    const mappedData = data.map((rawData: RawTagRatingData) => {
        return {
            tag: {
                name: rawData.tag_name,
                id: rawData.tag_id
            },
            avgRating: Number(rawData.avg_rating),
            count: rawData.show_count
        };
    });
    return mappedData;
}

export type ServiceRatingDTO = {
    service: Service;
    avgRating: number;
    count: number;
}

export async function getUserServiceRatings(userId: string): Promise<ServiceRatingDTO[] | null> {
    'use cache'
    cacheLife('minutes');
    const supabase = await publicClient();
    const { data, error } = await supabase
        .rpc('get_user_avg_rating_by_service', { user_id: userId })
    
    if (error) {
        console.error(error);
        return null;
    }
    type RawServiceRatingData = {
        service_id: number;
        service_name: string;
        avg_rating: number;
        show_count: number;
    }
    const mappedData = data.map((rawData: RawServiceRatingData) => {
        return {
            service: {
                name: rawData.service_name,
                id: rawData.service_id
            },
            avgRating: Number(rawData.avg_rating),
            count: rawData.show_count
        };
    });
    return mappedData;
}

export type ActorCountDTO = {
    actor: Actor;
    count: number;
}

export async function getUserTopActors(userId: string): Promise<ActorCountDTO[] | null> {
    'use cache'
    cacheLife('minutes');
    const supabase = await publicClient();
    const { data, error } = await supabase
        .rpc('get_user_top_actors', { user_id: userId })
    
    if (error) {
        console.error(error);
        return null;
    }
    type RawActorData = {
        actor_id: number;
        actor_name: string;
        show_count: number;
    }
    const mappedData = data.map((rawData: RawActorData) => {
        return {
            actor: {
                name: rawData.actor_name,
                id: rawData.actor_id
            },
            count: rawData.show_count
        };
    });
    return mappedData;
}

export type ActorRatingDTO = {
    actor: Actor;
    avgRating: number;
    count: number;
}

export async function getUserHighestRatedActors(userId: string): Promise<ActorRatingDTO[] | null> {
    'use cache'
    cacheLife('minutes');
    const supabase = await publicClient();
    const { data, error } = await supabase
        .rpc('get_user_highest_rated_actors', { user_id: userId })
    
    if (error) {
        console.error(error);
        return null;
    }
    type RawActorRatingData = {
        actor_id: number;
        actor_name: string;
        avg_rating: number;
        show_count: number;
    }
    const mappedData = data.map((rawData: RawActorRatingData) => {
        return {
            actor: {
                name: rawData.actor_name,
                id: rawData.actor_id
            },
            avgRating: Number(rawData.avg_rating),
            count: rawData.show_count
        };
    });
    return mappedData;
}

export async function getUserLowestRatedActors(userId: string): Promise<ActorRatingDTO[] | null> {
    'use cache'
    cacheLife('minutes');
    const supabase = await publicClient();
    const { data, error } = await supabase
        .rpc('get_user_lowest_rated_actors', { user_id: userId })
    
    if (error) {
        console.error(error);
        return null;
    }
    type RawActorRatingData = {
        actor_id: number;
        actor_name: string;
        avg_rating: number;
        show_count: number;
    }
    const mappedData = data.map((rawData: RawActorRatingData) => {
        return {
            actor: {
                name: rawData.actor_name,
                id: rawData.actor_id
            },
            avgRating: Number(rawData.avg_rating),
            count: rawData.show_count
        };
    });
    return mappedData;
}


export type ShowTagWithId = {
    showId: number;
    tag: ShowTag;
}

export async function getUserWatchedShowsTags(userId: string): Promise<ShowTagWithId[] | null> {
    'use cache'
    cacheLife('minutes');
    const supabase = await publicClient();
    
    // 1. Get shows logged by user
    const { data: userShows, error: userShowsError } = await supabase
        .from("UserShowDetails")
        .select('showId')
        .match({userId: userId});
        
    if (userShowsError || !userShows) return null;
    
    const showIds = userShows.map(s => s.showId);
    
    if (showIds.length === 0) return [];

    // 2. Get tags for these shows
    const { data: tagData, error: tagError } = await supabase
        .from("ShowTagRelationship")
        .select('showId, tag:tagId (id, name, created_at, category:ShowTagCategory (id, name, created_at))')
        .in('showId', showIds);

    if (tagError) {
        console.error(tagError);
        return null;
    }

    // 3. Map to cleaner structure
    const mappedData = tagData.map((item: any) => ({
        showId: item.showId,
        tag: {
            id: item.tag.id,
            name: item.tag.name,
            created_at: item.tag.created_at,
            category: item.tag.category
        }
    }));

    return mappedData;
}

export async function getFollowerCount(userId: string): Promise<number | null> {
    const supabase = await createClient();
    const { count: count } = await supabase.from("UserFollowRelationship").select('*', { count: 'exact', head: true }).match({followingUserId: userId});
    if (count == null) return null;   
    
    return count as number;
}
export async function getFollowingCount(userId: string): Promise<number | null> {
    const supabase = await createClient();
    const { count: count } = await supabase.from("UserFollowRelationship").select('*', { count: 'exact', head: true }).match({followerUser: userId});
    if (count == null) return null;   
    
    return count as number;
}

export async function getListsForUser(userId: string): Promise<number[] | null> {
    'use cache'
    cacheLife('minutes');
    const supabase = await publicClient();
    const { data: listData } = await supabase.from("showList").select('id').match({creator: userId});
    if (listData == null) return null;   
    const lists: number[] = listData.map((list) => list.id);
    return lists;
}

export async function getFollowerList(userId: string): Promise<UserBasicInfo[] | null> {
    const supabase = await createClient();
    const { data: userData } = await supabase.from("UserFollowRelationship").select('user:followerUser(id, name, username, profilePhotoURL)').match({followingUserId: userId});
    if (!userData) return null;
    const followInfo: UserBasicInfo[] = userData.map((item) => {
        return item.user as unknown as UserBasicInfo;
    });
    return followInfo;
}

export async function getFollowingList(userId: string): Promise<UserBasicInfo[] | null> {
    const supabase = await createClient();
    const { data: userData } = await supabase.from("UserFollowRelationship").select('user:followingUserId(id, name, username, profilePhotoURL)').match({followerUser: userId});
    if (!userData) return null;
    const followInfo: UserBasicInfo[] = userData.map((item) => {
        return item.user as unknown as UserBasicInfo;
    });
    return followInfo;
}
