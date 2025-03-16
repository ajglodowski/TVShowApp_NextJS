import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getShowsLogged, getUser, getUserByUsername, getUserFollowRelationship, getUserImageURL, getUserTopTags } from "@/utils/userService"
import { Heart, ListChecks, MessageSquare, Star, Tv, Users } from "lucide-react"
import Image from "next/image"
import FollowButton from "./FollowButton"
import { createClient } from "@/utils/supabase/server"
import TagCountCard from "./TagCountCard"
import UserStatsCard from "./UserStatsCard/UserStatsCard"
import ShowsListTile from "../../../components/showList/ShowListTile"
import { backdropTabs, backdropTabsTrigger } from "@/utils/stylingConstants"

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
    const followInfo = {
        followers: 1248,
        following: 843,
    };

    const showLists: number[] = [1];

    const profilePicUrl = user.profilePhotoURL ? getUserImageURL(user.profilePhotoURL) : "/images/placeholder-user.jpg";

    const supabase = await createClient();
    const userData = (await supabase.auth.getUser()).data.user;
    const currentUserId = userData?.id;
    const loggedIn = currentUserId !== undefined;

    const followRelationship = loggedIn ? await getUserFollowRelationship(userId, currentUserId!) : null;

    const tagData = await getUserTopTags(userId);

    const Header = () => {
        return(
            <div>
                <Avatar className="h-24 w-24 border-4 border-background">
                    <AvatarImage src={profilePicUrl} alt="@username" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <FollowButton currentUserId={currentUserId} followRelationship={followRelationship} userId={userId} />
                    </div>
                    <p className="text-muted-foreground">@{user.username}</p>
                    <div className="flex space-x-1 text-muted-foreground items-center">
                        <Tv className="h-4 w-4" />
                        <span className="">{showsLogged} Shows Logged</span>
                    </div>
                    <p className="text-sm mt-2 max-w-md">
                        {user.bio}
                    </p>
                </div>
                <div className="flex flex-col gap-2 text-sm md:text-right">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 md:order-last" />
                        <span className="font-medium">{followInfo.followers} Followers</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 md:order-last" />
                        <span className="font-medium">{followInfo.following} Following</span>
                    </div>
                    
                </div>
            </div>
        );
    }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px] bg-black">
        <div className="space-y-6">
            <Card className="bg-black text-white">
                <CardContent>
                <Header />
                </CardContent>
            </Card>

          <Tabs defaultValue="lists" className={` w-full`}>
            <TabsList className={`grid grid-cols-3 w-full md:w-[400px] ${backdropTabs}`}>
              <TabsTrigger value="lists" className={`${backdropTabsTrigger}`}>Lists</TabsTrigger>
              <TabsTrigger value="watched" className={`${backdropTabsTrigger}`}>Watched</TabsTrigger>
              <TabsTrigger value="reviews" className={`${backdropTabsTrigger}`}>Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="lists" className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">My Lists</h2>
                <Button variant="outline" className={`${backdropTabs}`} size="sm">
                  <ListChecks className="mr-2 h-4 w-4" />
                  Create List
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {showLists.map((listId) => (
                  <ShowsListTile key={listId} listId={listId}/>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="watched" className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">Recently Watched</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <div className="relative">
                      <Image
                        src={`/placeholder.svg?height=200&width=350`}
                        alt="Show poster"
                        width={350}
                        height={200}
                        className="w-full h-[200px] object-cover rounded-t-lg"
                      />
                      <div className="absolute bottom-2 right-2 bg-background/80 rounded-md px-2 py-1 text-xs font-medium backdrop-blur-sm">
                        Watched 3d ago
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Show Title {i}</h3>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span>4.{i} / 5</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
        </div>
      </div>
    </div>
  )
}

