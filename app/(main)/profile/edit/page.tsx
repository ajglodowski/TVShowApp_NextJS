import { EditProfileForm, ProfileFormValues } from "@/app/components/editProfile/EditProfileClient";
import { backdropBackground } from "@/app/utils/stylingConstants";
import { createClient } from "@/app/utils/supabase/server";
import { getUser } from "@/app/utils/userService";
import { Card, CardContent } from "@/components/ui/card";
import { getUserImageUrlAction, updateUserProfile } from "../UserService";

export default async function EditProfilePage() {

    const supabase = await createClient();
    const authData = (await supabase.auth.getUser()).data.user;

    if (!authData) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold">Not Logged In</h1>
                <p className="text-muted-foreground text-center">Please log in to edit your profile.</p>
            </div>
        );
    }

    const UserNotFound = () => {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold">User Not Found</h1>
                <p className="text-muted-foreground text-center">The user you are looking for does not exist or has been deleted.</p>
            </div>
        );
    }
    const user = await getUser(authData?.id);
    if (!user) return <UserNotFound />;

    let presignedImageUrl: string | null = null;
    // if (user.profilePhotoURL) presignedImageUrl = await getPresignedUserImageURL(user.profilePhotoURL);
    presignedImageUrl = user.profilePhotoURL ? getUserImageUrlAction(user.profilePhotoURL) : null;

    async function submitChanges(data: ProfileFormValues): Promise<boolean> {
        'use server';
        if (!user) return false;
        const saveSuccess = await updateUserProfile(user.id, data);
        return saveSuccess;
    }

    return (
        <div className="m-2 flex flex-col items-center justify-center space-y-4">
            <Card className="bg-black">
                <CardContent className={`${backdropBackground} text-white m-1`}>
                    <EditProfileForm userData={user} email={authData.email} presignedImageUrl={presignedImageUrl} saveFunction={submitChanges} />
                </CardContent>
            </Card> 
        </div>  
    );

}