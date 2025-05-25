import { Show } from "@/app/models/show";
import { backdropBackground } from "@/app/utils/stylingConstants";
import { Button } from "@/components/ui/button";
import ImageUploader, { ImageUploadType } from "../imageUploader/imageUploader";
import { useState } from "react";
import Image from "next/image";

export default function ShowImageSection({ showData, presignedImageUrl }: { showData: Show, presignedImageUrl: string | null }) {
    const [isUploading, setIsUploading] = useState(false);

    const NoImageSet = () => {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold">No Show Image Set</h1>
                <p className="text-muted-foreground text-center">Please set an image for this show.</p>
                <Button
                    variant="outline"
                    className={`${backdropBackground} hover:bg-white hover:text-black cursor-pointer mt-4`}
                    onClick={() => setIsUploading(true)}
                >
                    Upload Show Image
                </Button>
            </div>
        );
    };

    if (isUploading) {
        return (
            <div className="space-y-2 ">
                <h2 className="text-xl font-semibold">Update Show Image</h2>
                <ImageUploader uploadType={ImageUploadType.SHOW} path="showImages" showId={showData.id}  />
                <Button
                    variant="outline"
                    className={`bg-red-700 hover:bg-white hover:text-red-700 hover:border-red-700 text-white`}
                    onClick={() => setIsUploading(false)}
                >
                    Cancel Updating Show Image
                </Button>
            </div>
        );
    }

    if (!showData.pictureUrl) {
        return <NoImageSet />;
    }
    
    if (!presignedImageUrl) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold">Error Loading Show Image</h1>
                <p className="text-muted-foreground text-center">Please try again later.</p>
                <Button
                    variant="outline"
                    className={`${backdropBackground} hover:bg-white hover:text-black cursor-pointer mt-4`}
                    onClick={() => setIsUploading(true)}
                >
                    Upload New Image
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-40 h-40 overflow-hidden rounded-lg border-2 border-white/70">
                <Image
                    src={presignedImageUrl}
                    alt={showData.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                />
            </div>
            <div>
                <Button
                    variant="outline"
                    className={`${backdropBackground} hover:bg-white hover:text-black cursor-pointer`}
                    onClick={() => setIsUploading(true)}
                >
                    Change Image
                </Button>
            </div>
        </div>
    );
}