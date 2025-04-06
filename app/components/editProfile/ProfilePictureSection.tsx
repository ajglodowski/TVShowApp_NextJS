import { User } from "@/app/models/user";
import { backdropBackground } from "@/app/utils/stylingConstants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePictureSection({ userData, presignedImageUrl }: { userData: User, presignedImageUrl: string | null }) {

    function handleProfilePictureChange(event: React.ChangeEvent<HTMLInputElement>) {
        // const file = event.target.files?.[0]
        // if (file) {
        //   const reader = new FileReader()
        //   reader.onloadend = () => {
        //     const result = reader.result as string
            
        //   }
        //   reader.readAsDataURL(file)
        // }
    }

    const NoPictureSet = () => {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold">No Profile Picture Set</h1>
                <p className="text-muted-foreground text-center">Please set a profile picture.</p>
            </div>
        );
    };

    if (!userData.profilePhotoURL) {
        return <NoPictureSet />;
    }
    if (!presignedImageUrl) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold">Error Loading Profile Picture</h1>
                <p className="text-muted-foreground text-center">Please try again later.</p>
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
                <Input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="sr-only"
                    id="profile-picture"
                />
                <Button
                    variant="outline"
                    className={`${backdropBackground} hover:bg-white hover:text-black cursor-pointer`}
                    asChild
                >
                    <label htmlFor="profile-picture">Change Picture</label>
                </Button>
            </div>
        </div>
    );
}