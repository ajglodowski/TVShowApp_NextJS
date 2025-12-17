import { User } from "@/app/models/user";
import { getFollowerCount, getFollowingCount, getShowsLogged } from "@/app/utils/userService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Tv, Users, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { getUserImageUrlAction } from "../../UserService";
import EditButton from "./EditButton";
import FollowButton from "./FollowButton/FollowButton";

export default async function UserProfileHeader({userId, userData}: {userId: string, userData: User}) {
    const user = userData;

    let profilePicUrl: string | undefined = undefined;
    profilePicUrl = user.profilePhotoURL ? getUserImageUrlAction(user.profilePhotoURL) : undefined;

    const [showsLogged, followersCount, followingCount] = await Promise.all([
        getShowsLogged(userId),
        getFollowerCount(userId),
        getFollowingCount(userId!)
    ]);

    // Get initials for avatar fallback
    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : user.username?.slice(0, 2).toUpperCase() || '?';
    
    return(
        <div className="relative">
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent rounded-t-2xl" />
            
            <div className="relative px-5 pb-6 pt-8 md:px-8">
                {/* Mobile Layout - Stacked */}
                <div className="md:hidden">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/50 to-primary/20 blur-xl scale-110" />
                            <Avatar className="relative h-28 w-28 border-4 border-white/20 shadow-2xl ring-2 ring-primary/30 ring-offset-2 ring-offset-transparent">
                                <AvatarImage src={profilePicUrl} alt={user.username} className="object-cover" />
                                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-2xl font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        
                        <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
                        <p className="text-primary font-medium mb-2">@{user.username}</p>
                        
                        {user.private && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs mb-3">
                                <Lock className="w-3 h-3" />
                                Private Account
                            </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 mt-2">
                            <FollowButton userId={userId} />
                            <EditButton userId={userId} />
                        </div>
                    </div>

                    {/* Bio */}
                    {user.bio && (
                        <p className="text-white/70 text-sm text-center mb-6 max-w-sm mx-auto leading-relaxed">
                            {user.bio}
                        </p>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                            <div className="text-2xl font-bold text-white">{showsLogged || 0}</div>
                            <div className="text-xs text-white/50 uppercase tracking-wide mt-1">Shows</div>
                        </div>
                        <Link href={`/profile/${user.username}/followers`} className="group">
                            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5 group-hover:bg-white/10 group-hover:border-primary/30 transition-all">
                                <div className="text-2xl font-bold text-white">{followersCount ?? 0}</div>
                                <div className="text-xs text-white/50 uppercase tracking-wide mt-1">Followers</div>
                            </div>
                        </Link>
                        <Link href={`/profile/${user.username}/following`} className="group">
                            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5 group-hover:bg-white/10 group-hover:border-primary/30 transition-all">
                                <div className="text-2xl font-bold text-white">{followingCount ?? 0}</div>
                                <div className="text-xs text-white/50 uppercase tracking-wide mt-1">Following</div>
                            </div>
                        </Link>
                    </div>

                    {/* Watchlist Link */}
                    <Link href={`/watchlist/${user.username}`} className="block group">
                        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                </div>
                                <span className="text-white/80 text-sm font-medium">View Watchlist</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                </div>

                {/* Desktop Layout - Horizontal */}
                <div className="hidden md:flex md:items-start gap-8">
                    {/* Avatar Section */}
                    <div className="flex-shrink-0">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/50 to-primary/20 blur-xl scale-110" />
                            <Avatar className="relative h-32 w-32 border-4 border-white/20 shadow-2xl ring-2 ring-primary/30 ring-offset-4 ring-offset-transparent">
                                <AvatarImage src={profilePicUrl} alt={user.username} className="object-cover" />
                                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-3xl font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                            {user.private && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs">
                                    <Lock className="w-3 h-3" />
                                    Private
                                </div>
                            )}
                        </div>
                        
                        <p className="text-primary font-medium text-lg mb-3">@{user.username}</p>
                        
                        {user.bio && (
                            <p className="text-white/70 text-sm max-w-lg leading-relaxed mb-4">
                                {user.bio}
                            </p>
                        )}

                        {/* Stats Row */}
                        <div className="flex items-center gap-6 mb-4">
                            <div className="flex items-center gap-2 text-white/70">
                                <Tv className="w-4 h-4 text-primary" />
                                <span className="font-semibold text-white">{showsLogged || 0}</span>
                                <span className="text-sm">Shows</span>
                            </div>
                            <Link href={`/profile/${user.username}/followers`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
                                <Users className="w-4 h-4 text-primary" />
                                <span className="font-semibold text-white">{followersCount ?? 0}</span>
                                <span className="text-sm group-hover:underline">Followers</span>
                            </Link>
                            <Link href={`/profile/${user.username}/following`} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group">
                                <Users className="w-4 h-4 text-primary" />
                                <span className="font-semibold text-white">{followingCount ?? 0}</span>
                                <span className="text-sm group-hover:underline">Following</span>
                            </Link>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <FollowButton userId={userId} />
                            <EditButton userId={userId} />
                            <Link href={`/watchlist/${user.username}`} className="group">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all text-sm text-white/70 hover:text-white">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    <span>Watchlist</span>
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function LoadingUserProfileHeader() {
    return (
        <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent rounded-t-2xl" />
            
            <div className="relative px-5 pb-6 pt-8 md:px-8">
                {/* Mobile Loading */}
                <div className="md:hidden">
                    <div className="flex flex-col items-center text-center mb-6">
                        <Skeleton className="h-28 w-28 rounded-full bg-white/10 mb-4" />
                        <Skeleton className="h-8 w-40 bg-white/10 mb-2" />
                        <Skeleton className="h-5 w-28 bg-white/10 mb-4" />
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-24 bg-white/10 rounded-lg" />
                        </div>
                    </div>
                    <Skeleton className="h-16 w-full bg-white/10 rounded-lg mb-6" />
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <Skeleton className="h-20 bg-white/10 rounded-xl" />
                        <Skeleton className="h-20 bg-white/10 rounded-xl" />
                        <Skeleton className="h-20 bg-white/10 rounded-xl" />
                    </div>
                </div>

                {/* Desktop Loading */}
                <div className="hidden md:flex md:items-start gap-8">
                    <Skeleton className="h-32 w-32 rounded-full bg-white/10 flex-shrink-0" />
                    <div className="flex-1">
                        <Skeleton className="h-9 w-48 bg-white/10 mb-3" />
                        <Skeleton className="h-6 w-32 bg-white/10 mb-4" />
                        <Skeleton className="h-16 w-full max-w-lg bg-white/10 rounded-lg mb-4" />
                        <div className="flex items-center gap-6 mb-4">
                            <Skeleton className="h-5 w-24 bg-white/10" />
                            <Skeleton className="h-5 w-28 bg-white/10" />
                            <Skeleton className="h-5 w-28 bg-white/10" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-24 bg-white/10 rounded-lg" />
                            <Skeleton className="h-10 w-28 bg-white/10 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
