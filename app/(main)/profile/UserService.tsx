import { generatePresignedUrlAction } from "@/app/actions/imageActions";
import { ProfileFormValues } from "@/app/components/editProfile/EditProfileClient";
import { createClient } from "@/app/utils/supabase/server";
import { getUserImageURL } from "@/app/utils/userService";
import { cache } from "react";

export async function getProfilePic (username: string): Promise<string|null> {
    return getUserImageURL(username);
}

export const getPresignedUserImageURL = cache(async (picLocation: string): Promise<string | null> => {
    // Construct the image name and path WITHOUT encoding the picLocation
    const imageName = picLocation; // Assuming picLocation is the full file name (e.g., 'some-uuid.jpeg')
    const path = 'profilePics';

    // Call the server action directly
    const presignedUrl = await generatePresignedUrlAction(path, imageName);

    // Return the result from the action
    return presignedUrl;
  });

export function getUserImageUrlAction(imagePath: string): string {
    return `https://1mvtjcpfzmphqyox.public.blob.vercel-storage.com/profilePics/${imagePath}`;
}

export const updateUserProfile = async (userId: string, profileData: ProfileFormValues): Promise<boolean> => {
  const supabase = await createClient();
  const { data: _data, error } = await supabase
      .from("user")
      .update({
          username: profileData.username,
          name: profileData.name,
          bio: profileData.bio,
          private: profileData.isPrivate,
      })
      .eq("id", userId);

  if (error) {
      console.error("Error updating user profile:", error);
      return false;
  }

  return true;
}