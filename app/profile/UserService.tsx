import { getUserImageURL } from "@/app/utils/userService";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cache } from "react";
import { serverBaseURL } from "../envConfig";
import { ProfileFormValues } from "../components/editProfile/EditProfileClient";
import { createClient } from "../utils/supabase/server";
import { cookies } from "next/headers";
import { UserFollowRelationship } from "../models/userFollowRelationship";
import { generatePresignedUrlAction } from "@/app/actions/imageActions";

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

export const updateUserProfile = async (userId: string, profileData: ProfileFormValues): Promise<boolean> => {
  const supabase = await createClient();
  const { data, error } = await supabase
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