import { User } from "@/app/models/user";
import { backdropBackground } from "@/app/utils/stylingConstants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ImageUploader, { ImageUploadType } from "../imageUploader/imageUploader";
import { useState } from "react";

export default function ProfilePictureSection({ userData, presignedImageUrl }: { userData: User, presignedImageUrl: string | null }) {
    const [isUploading, setIsUploading] = useState(false);

    const NoPictureSet = () => {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold">No Profile Picture Set</h1>
                <p className="text-muted-foreground text-center">Please set a profile picture.</p>
                <Button
                    variant="outline"
                    className={`${backdropBackground} hover:bg-white hover:text-black cursor-pointer mt-4`}
                    onClick={() => setIsUploading(true)}
                >
                    Upload Profile Picture
                </Button>
            </div>
        );
    };

    if (isUploading) {
        return (
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Update Profile Picture</h2>
                <ImageUploader uploadType={ImageUploadType.PROFILE} path="profilePics" />
                <Button
                    variant="outline"
                    className={`bg-red-700 hover:bg-white hover:text-red-700 hover:border-red-700 text-white`}
                    onClick={() => setIsUploading(false)}
                >
                    Cancel Updating Profile Picture
                </Button>
            </div>
        );
    }

    if (!userData.profilePhotoURL) {
        return <NoPictureSet />;
    }
    
    if (!presignedImageUrl) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold">Error Loading Profile Picture</h1>
                <p className="text-muted-foreground text-center">Please try again later.</p>
                <Button
                    variant="outline"
                    className={`${backdropBackground} hover:bg-white hover:text-black cursor-pointer mt-4`}
                    onClick={() => setIsUploading(true)}
                >
                    Upload New Picture
                </Button>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center space-x-4">
            <Avatar className="h-24 w-24 border-2 border-white/70">
                <AvatarImage src={presignedImageUrl} alt="@username" />
                <AvatarFallback></AvatarFallback>
            </Avatar>
            <div>
                <Button
                    variant="outline"
                    className={`${backdropBackground} hover:bg-white hover:text-black cursor-pointer`}
                    onClick={() => setIsUploading(true)}
                >
                    Change Picture
                </Button>
            </div>
        </div>
    );
}