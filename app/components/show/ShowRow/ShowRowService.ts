import { Rating } from "@/app/models/rating";
import { Status } from "@/app/models/status";
import { UserBasicInfo } from "@/app/models/user";
import { UserShowDataWithUserInfo, UserShowDataWithUserInfoParams } from "@/app/models/userShowData";
import { createClient } from "@/app/utils/supabase/server";

export const getFriendsUserDetails = async (showId: number): Promise<UserShowDataWithUserInfo[] | undefined> => {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) {
        console.error("User not found");
        return undefined;
    }
    const userId = userData.user.id;

    const { data, error } = await supabase
        .rpc('get_following_user_details_for_show', { inputuserid: userId, inputshowid: showId });
    
    if (error) {
        console.error(error);
        return undefined;
    }

    const shows: UserShowDataWithUserInfo[] = data.map((row: any) => ({
        user: {
            id: row.userid,
            username: row.username,
            profilePhotoURL: row.profilephotourl
        },
        status: {
            id: row.status,
            name: row.statusname
        },
        showId: row.showid,
        updated: row.updated,
        currentSeason: row.currentseason,
        rating: row.rating,
        createdAt: row.created_at
    }));

    return shows;
}

export const getCurrentUsersShowDetails = async (showId: number): Promise<UserShowDataWithUserInfo | undefined> => {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) {
        console.error("User not found");
        return undefined;
    }
    const userId = userData.user.id;

    const { data, error } = await supabase
        .from('UserShowDetails')
        .select(UserShowDataWithUserInfoParams)
        .match({ userId: userId, showId: showId })
        .single();
    
    if (error) {
        console.error(error);
        return undefined;
    }

    const output: UserShowDataWithUserInfo = {
        ...data,
        user: data.user as unknown as UserBasicInfo,
        status: data.status as unknown as Status,
        rating: data.rating as unknown as Rating
    };

    return output;
}