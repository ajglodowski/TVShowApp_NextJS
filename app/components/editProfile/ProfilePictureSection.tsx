"use client"

import { User } from "@/app/models/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, ImagePlus, X } from "lucide-react";
import { useState } from "react";
import ImageUploader, { ImageUploadType } from "../imageUploader/imageUploader";

export default function ProfilePictureSection({ userData, presignedImageUrl }: { userData: User, presignedImageUrl: string | null }) {
    const [isUploading, setIsUploading] = useState(false);

    // Get initials for avatar fallback
    const initials = userData.name
        ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : userData.username?.slice(0, 2).toUpperCase() || '?';

    if (isUploading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Update Profile Picture</h2>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 bg-transparent text-white/70 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400"
                        onClick={() => setIsUploading(false)}
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                    <ImageUploader uploadType={ImageUploadType.PROFILE} path="profilePics" />
                </div>
            </div>
        );
    }

    // No picture set state
    if (!userData.profilePhotoURL || !presignedImageUrl) {
        return (
            <div className="flex flex-col items-center text-center py-4">
                <div className="relative mb-4">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border-4 border-white/10">
                        <span className="text-3xl font-bold text-white/60">{initials}</span>
                    </div>
                    <button
                        onClick={() => setIsUploading(true)}
                        className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
                    >
                        <ImagePlus className="w-5 h-5" />
                    </button>
                </div>
                <h3 className="text-white font-medium mb-1">No Profile Picture</h3>
                <p className="text-white/50 text-sm mb-4">Add a photo to personalize your profile</p>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 bg-white/5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                    onClick={() => setIsUploading(true)}
                >
                    <Camera className="w-4 h-4 mr-2" />
                    Upload Photo
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar with edit overlay */}
            <div className="relative group">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 blur-xl scale-105 opacity-50" />
                <Avatar className="relative h-28 w-28 border-4 border-white/20 shadow-2xl ring-2 ring-primary/20">
                    <AvatarImage src={presignedImageUrl} alt={userData.username} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-2xl font-bold">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <button
                    onClick={() => setIsUploading(true)}
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
                >
                    <Camera className="w-5 h-5" />
                </button>
            </div>
            
            {/* Info and action */}
            <div className="text-center sm:text-left">
                <h3 className="text-white font-medium mb-1">Profile Picture</h3>
                <p className="text-white/50 text-sm mb-3">Click the camera icon or button below to change</p>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all"
                    onClick={() => setIsUploading(true)}
                >
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                </Button>
            </div>
        </div>
    );
}