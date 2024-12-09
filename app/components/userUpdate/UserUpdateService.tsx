import { UserUpdate, UserUpdatePropertiesWithShowName } from "@/app/models/userUpdate";
import { createClient } from '@/utils/supabase/server';
import { Status } from "@/app/models/status";

export type UserUpdateTileDTO = {
    userUpdate: UserUpdate,
    showName: string,
}

export async function getUserUpdate(updateId: number): Promise<UserUpdateTileDTO|null> { // TODO
  
    
    const supabase = await createClient();
    const { data: updateData } = await supabase.from("UserUpdate").select(UserUpdatePropertiesWithShowName).match({id: updateId}).single();

    if (!updateData) return null;
    const showInfo = updateData.show as unknown as {id: number, name: string};

    const formatted = {
        ...updateData,
        showId: showInfo.id as unknown as string,
        statusChange: updateData.status as unknown as Status,
        updateDate: new Date(updateData.updateDate),
        status: undefined,
    } as unknown as UserUpdate;

    const update = {userUpdate: formatted, showName: showInfo.name};
   
    return update as unknown as UserUpdateTileDTO;
}