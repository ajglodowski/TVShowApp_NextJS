import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getFollowerCount, getFollowingCount, getListsForUser, getShowsLogged, getUser, getUserByUsername, getUserFollowRelationship, getUserImageURL, getUserTopServices, getUserTopTags } from "@/app/utils/userService"
import { Heart, ListChecks, MessageSquare, Star, Tv, Users } from "lucide-react"
import Image from "next/image"
import FollowButton from "./FollowButton"
import { createClient } from "@/app/utils/supabase/server"
import TagCountCard from "./TagCountCard"
import UserStatsCard from "./UserStatsCard/UserStatsCard"
import ShowsListTile from "../../../components/showList/ShowListTile"
import { backdropBackground, backdropTabs, backdropTabsTrigger } from "@/app/utils/stylingConstants"
import YourUpdatesRow from "@/app/components/home/YourUpdatesRow"
import ServiceCountCard from "./ServiceCountCard"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import UserUpdatesRow from "../UserUpdatesRow"
import Link from "next/link"

export default async function UserProfile({username}: {username: string}) {

    const user = await getUserByUsername(username);

    const UserNotFound = () => {
        return (
            <div className="flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold">User Not Found</h1>
                <p className="text-muted-foreground text-center">The user you are looking for does not exist or has been deleted.</p>
            </div>
        );
    }

    if (!user) return <UserNotFound />;
    const userId = user.id;
    const showsLogged = getShowsLogged(userId);

    const showLists: number[] | null = await getListsForUser(userId);

    const profilePicUrl = user.profilePhotoURL ? getUserImageURL(user.profilePhotoURL) : "/images/placeholder-user.jpg";

    const supabase = await createClient();
    const userData = (await supabase.auth.getUser()).data.user;
    const currentUserId = userData?.id;
    const loggedIn = currentUserId !== undefined;

    const followersCount = await getFollowerCount(userId);
    const followingCount = await getFollowingCount(userId!);

    const followRelationship = loggedIn ? await getUserFollowRelationship(userId, currentUserId!) : null;

    const tagData = await getUserTopTags(userId);
    const serviceData = await getUserTopServices(userId);

    const Header = () => {
        return(
            <div>
                <Avatar className="h-24 w-24 border-2 border-white/70">
                    <AvatarImage src={profilePicUrl} alt="@username" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <FollowButton currentUserId={currentUserId} followRelationship={followRelationship} userId={userId} />
                    </div>
                    <p className="text-muted-foreground font-bold">@{user.username}</p>
                    <div className="flex space-x-1 text-muted-foreground items-center">
                        <Tv className="h-4 w-4" />
                        <span className="">{showsLogged} Shows Logged</span>
                    </div>
                    <p className="text-sm mt-2 max-w-md pb-2">
                        {user.bio}
                    </p>
                </div>
                <div className="flex flex-col gap-2 text-sm md:text-right">
                    <div className="flex items-center gap-2 hover:underline cursor-pointer">
                        <Users className="h-4 w-4" />
                        { followersCount != null && 
                          <Link href={`/profile/${user.username}/followers`}>
                            <span className="font-medium">{followersCount} Followers</span>
                          </Link>
                        }
                        { followersCount == null && <span className="font-medium">Error loading followers</span>}
                    </div>
                    <div className="flex items-center gap-2 hover:underline cursor-pointer">
                        <Users className="h-4 w-4" />
                        { followingCount != null && 
                          <Link href={`/profile/${user.username}/following`}>
                            <span className="font-medium">{followingCount} Following</span>
                          </Link>
                        }
                        { followingCount == null && <span className="font-medium">Error loading Following</span>}
                    </div>
                    
                </div>
            </div>
        );
    }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px] bg-black">
        <div className="space-y-6">
            <Card className={`${backdropBackground} text-white border-2 border-white/10 shadow-lg rounded-lg`}>
                <CardContent className="p-4">
                <Header />
                </CardContent>
            </Card>

          <Tabs defaultValue="lists" className={`w-full rounded-lg ${backdropBackground} border-2 border-white/10 p-2`}>
            <TabsList className={`grid grid-cols-3 w-full md:w-[400px] rounded-lg ${backdropTabs}`}>
              <TabsTrigger value="lists" className={`${backdropTabsTrigger}`}>Lists</TabsTrigger>
              <TabsTrigger value="updates" className={`${backdropTabsTrigger}`}>Updates</TabsTrigger>
              <TabsTrigger value="reviews" className={`${backdropTabsTrigger}`}>Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="lists" className="space-y-4 mt-6 ">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{user.username}'s Lists</h2>
                <Button variant="outline" className={`${backdropTabs}`} size="sm">
                  <ListChecks className="mr-2 h-4 w-4" />
                  Create List
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {showLists && showLists.map((listId) => (
                  <ShowsListTile key={listId} listId={listId}/>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="updates" className="mt-6 w-full">
              <div className="w-full overflow-x-auto">
                  <UserUpdatesRow userId={userId} />
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">Recent Reviews</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Image
                          src={`/placeholder.svg?height=120&width=80`}
                          alt="Show poster"
                          width={80}
                          height={120}
                          className="rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold">Show Title {i}</h3>
                            <div className="flex items-center">
                              {Array(5)
                                .fill(0)
                                .map((_, j) => (
                                  <Star
                                    key={j}
                                    className={`h-4 w-4 ${j < 5 - i / 2 ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                                  />
                                ))}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Reviewed on {new Date().toLocaleDateString()}
                          </p>
                          <p className="text-sm mt-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris.
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Heart className="mr-1 h-4 w-4" />
                              <span>{12 + i}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="mr-1 h-4 w-4" />
                              <span>{3 + i}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <UserStatsCard userId={userId} />
          <TagCountCard tagData={tagData}/>
          <ServiceCountCard serviceData={serviceData}/>
        </div>
      </div>
    </div>
  )
}

