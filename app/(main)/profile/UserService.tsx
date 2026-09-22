import { ProfileFormValues } from "@/app/components/editProfile/EditProfileClient";
import { createClient } from "@/app/utils/supabase/server";

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