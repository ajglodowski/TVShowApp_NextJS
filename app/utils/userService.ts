import { serverBaseURL } from "@/app/envConfig";
import { createClient, publicClient } from "./supabase/server";
import { User, UserBasicInfo } from "@/app/models/user";
import { UserFollowRelationship } from "@/app/models/userFollowRelationship";
import { ShowTag } from "@/app/models/showTag";
import { cache } from 'react';
import { Service } from "../models/service";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

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
        .rpc('get_user_top_tags', { user_id: userId })
    
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
        .rpc('get_user_top_services', { user_id: userId })
    
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