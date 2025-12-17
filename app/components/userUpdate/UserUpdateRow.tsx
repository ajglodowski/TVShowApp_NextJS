import Image from "next/image";
import Link from "next/link";
import { getShowImageUrlAction } from "@/app/(main)/show/[showId]/ShowImageService";
import { getUserUpdateMessage } from "@/app/utils/getUserUpdateMessage";
import { LocalizedDate } from "@/app/components/LocalizedDate";
import { Skeleton } from "@/components/ui/skeleton";
import { UserUpdateTileDTO } from "./UserUpdateService";
import { EyeOff } from "lucide-react";

type UserUpdateRowProps = {
    updateDto: UserUpdateTileDTO;
};

export default function UserUpdateRow({ updateDto }: UserUpdateRowProps) {
    const update = updateDto.userUpdate;
    const showName = updateDto.showName;
    const showImageUrl = updateDto.showPictureUrl 
        ? getShowImageUrlAction(updateDto.showPictureUrl) 
        : null;

    const message = getUserUpdateMessage(update);
    const isHidden = update.hidden;

    return (
        <Link href={`/show/${update.showId}`} className="block group">
            <div className={`
                rounded-xl bg-white/5 border border-white/10 p-4 
                transition-all duration-200 
                hover:bg-white/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5
                ${isHidden ? 'opacity-60' : ''}
            `}>
                <div className="flex items-center gap-4">
                    {/* Show Image */}
                    <div className="relative w-14 h-[72px] rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                        {showImageUrl ? (
                            <Image
                                src={showImageUrl}
                                alt={showName}
                                fill
                                sizes="56px"
                                className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/30">
                                <span className="text-xl">📺</span>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white truncate group-hover:text-primary transition-colors">
                                {showName}
                            </h3>
                            {isHidden && (
                                <EyeOff className="w-4 h-4 text-white/40 flex-shrink-0" />
                            )}
                        </div>
                        <p className="text-sm text-white/70 truncate">
                            {message}
                        </p>
                        <p className="text-xs text-white/50 mt-1">
                            <LocalizedDate date={update.updateDate} />
                        </p>
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex-shrink-0 text-white/30 group-hover:text-primary group-hover:translate-x-1 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export function LoadingUserUpdateRow() {
    return (
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 animate-pulse">
            <div className="flex items-center gap-4">
                <Skeleton className="w-14 h-[72px] rounded-lg bg-white/10 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4 bg-white/10" />
                    <Skeleton className="h-4 w-1/2 bg-white/10" />
                    <Skeleton className="h-3 w-1/4 bg-white/10" />
                </div>
            </div>
        </div>
    );
}

