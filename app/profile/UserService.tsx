import { getUserImageURL } from "@/utils/userService";

export async function getProfilePic (username: string): Promise<string|null> {
    return getUserImageURL(username);
}