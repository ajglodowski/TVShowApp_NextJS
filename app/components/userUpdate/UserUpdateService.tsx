import { UserUpdate, UserUpdatePropertiesWithShowName } from "@/app/models/userUpdate";
import { publicClient } from '@/app/utils/supabase/server';
import { Status } from "@/app/models/status";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

export type UserUpdateTileDTO = {
    userUpdate: UserUpdate,
    showName: string,
    showPictureUrl: string | null,
}

export async function getUserUpdate(updateId: number): Promise<UserUpdateTileDTO|null> { // TODO
    'use cache'
    cacheLife('hours');
    const supabase = await publicClient();
    const { data: updateData } = await supabase.from("UserUpdate").select(UserUpdatePropertiesWithShowName).match({id: updateId}).single();

    if (!updateData) return null;
    const showInfo = updateData.show as unknown as {id: number, name: string, pictureUrl: string | null};

    const formatted = {
        ...updateData,
        showId: showInfo.id as unknown as string,
        statusChange: updateData.status as unknown as Status,
        updateDate: new Date(updateData.updateDate),
        status: undefined,
    } as unknown as UserUpdate;

    const update = {userUpdate: formatted, showName: showInfo.name, showPictureUrl: showInfo.pictureUrl};
   
    return update as unknown as UserUpdateTileDTO;
}