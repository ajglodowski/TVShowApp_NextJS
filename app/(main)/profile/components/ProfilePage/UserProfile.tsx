import ProfilePageCardSkeleton from "@/app/(main)/profile/components/ProfilePage/ProfilePageCardSkeleton"
import ServiceCountCard from "@/app/(main)/profile/components/ProfilePage/ServiceCountCard"
import TagCountCard from "@/app/(main)/profile/components/ProfilePage/TagCountCard"
import UserProfileHeader, { LoadingUserProfileHeader } from "@/app/(main)/profile/components/ProfilePage/UserProfileHeader"
import UserStatsCard from "@/app/(main)/profile/components/ProfilePage/UserStatsCard/UserStatsCard"
import ShowsListTile from "@/app/components/showList/ShowListTile"
import ShowListTileSkeleton from "@/app/components/showList/ShowListTileSkeleton"
import { backdropBackground, backdropTabs, backdropTabsTrigger } from "@/app/utils/stylingConstants"
import { getListsForUser, getUserByUsername } from "@/app/utils/userService"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListChecks } from "lucide-react"
import { Suspense } from "react"
import UserUpdatesRow from "../UserUpdatesRow"
export default async function UserProfile({username}: {username: string}) {

  //const wait = await new Promise((resolve) => setTimeout(resolve, 5000));

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
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
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
                  <ShowsListTile key={listId} listId={listId}/>
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

export async function LoadingUserProfile() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

      <div className="space-y-6">
            <Card className={`${backdropBackground} text-white border-2 border-white/10 shadow-lg rounded-lg`}>
                <CardContent className="p-4">
                <LoadingUserProfileHeader />
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
                <h2 className="text-xl font-semibold"><Skeleton className="h-4 w-full" /></h2>
                <Button variant="outline" className={`${backdropTabs}`} size="sm">
                  <ListChecks className="mr-2 h-4 w-4" />
                  Create List
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <ShowListTileSkeleton key={index} listId={index} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="updates" className="mt-6 w-full">
              <div className="w-full overflow-x-auto">
                  <Skeleton className="h-24 w-full" />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <ProfilePageCardSkeleton cardTitle="User Stats" />
          <ProfilePageCardSkeleton cardTitle="Top Tags" />
          <ProfilePageCardSkeleton cardTitle="Top Services" />
        </div>
      </div>
    </div>
  )
}

