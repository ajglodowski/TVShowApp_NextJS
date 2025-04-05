import ShowListTileSkeleton from "@/app/components/showList/ShowListTileSkeleton"
import { backdropBackground, backdropTabs, backdropTabsTrigger } from "@/app/utils/stylingConstants"
import { getListsForUser, getUserByUsername } from "@/app/utils/userService"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ListChecks, MessageSquare, Star } from "lucide-react"
import Image from "next/image"
import { Suspense } from "react"
import ShowsListTile from "../../../components/showList/ShowListTile"
import UserUpdatesRow from "../UserUpdatesRow"
import ServiceCountCard from "./ServiceCountCard"
import TagCountCard from "./TagCountCard"
import UserProfileHeader from "./UserProfileHeader"
import UserStatsCard from "./UserStatsCard/UserStatsCard"
import ProfilePageCardSkeleton from "./ProfilePageCardSkeleton"

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

  const showLists: number[] | null = await getListsForUser(userId);
   
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px] bg-black">
        <div className="space-y-6">
            <Card className={`${backdropBackground} text-white border-2 border-white/10 shadow-lg rounded-lg`}>
                <CardContent className="p-4">
                <UserProfileHeader userId={userId} userData={user} />
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
                  <Suspense key={listId} fallback={<ShowListTileSkeleton listId={listId} />}>
                    <ShowsListTile key={listId} listId={listId}/>
                  </Suspense>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="updates" className="mt-6 w-full">
              <div className="w-full overflow-x-auto">
                  <UserUpdatesRow userId={userId} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Suspense fallback={<ProfilePageCardSkeleton cardTitle="User Stats" />}>
            <UserStatsCard userId={userId} />
          </Suspense>
          <Suspense fallback={<ProfilePageCardSkeleton cardTitle="Top Tags" />}>
            <TagCountCard userId={userId}/>
          </Suspense>
          <Suspense fallback={<ProfilePageCardSkeleton cardTitle="Top Services" />}>
            <ServiceCountCard userId={userId}/>
          </Suspense>
        </div>
      </div>
    </div>
  )
}

