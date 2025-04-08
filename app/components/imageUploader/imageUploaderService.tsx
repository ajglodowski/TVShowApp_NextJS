import { createClient } from "@/app/utils/supabase/client";

export async function updateCurrentUserProfilePic(imageUrl: string): Promise<boolean> {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData || !userData.user) {
        console.error("User not found");
        return false;
    }
    const userId = userData.user.id;
    const { data, error } = await supabase
        .from('user')
        .update({ profilePhotoURL: imageUrl })
        .eq('id', userId);
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}