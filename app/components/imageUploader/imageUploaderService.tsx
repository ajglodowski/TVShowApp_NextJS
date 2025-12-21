import { createClient, getCurrentUserId } from "@/app/utils/supabase/client";
import { upload, UploadOptions as _UploadOptions } from "@vercel/blob/client";

export async function updateCurrentUserProfilePic(imageUrl: string): Promise<boolean> {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
        console.error("User not found");
        return false;
    }
    const userId = currentUserId;
    const supabase = await createClient();
    const { data: _data, error } = await supabase
        .from('user')
        .update({ profilePhotoURL: imageUrl })
        .eq('id', userId);
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

export async function updateCurrentShowImage(showId: number, imageUrl: string): Promise<boolean> {
    
    const strippedImageUrl = imageUrl.replace(".jpeg", "");
    const supabase = await createClient();
    const { data: _data, error } = await supabase
        .from('show')
        .update({ pictureUrl: strippedImageUrl })
        .eq('id', showId);
    if (error) {
        console.error(error);
        return false;
    }
    return true;
}

export async function uploadImageToVercelBlob(imagePath: string, imageData: Blob): Promise<boolean> {
    try {
        const _newBlob = await upload(imagePath, imageData, {
            access: 'public',
            handleUploadUrl: '/api/vercelBlobUpload',
          });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}