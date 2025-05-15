import { ScrollBar } from "@/components/ui/scroll-area"
import { TabsTrigger } from "@/components/ui/tabs"
import { TabsList } from "@/components/ui/tabs"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs } from "@/components/ui/tabs"
import ShowTileSkeleton from "../../show/ShowTile/ShowTileSkeleton"
import { Skeleton } from "@/components/ui/skeleton"
import { backdropTabs } from "@/app/utils/stylingConstants"

export const LoadingShows = () => {
    return (
      <div className="w-full">
        <ScrollArea className="w-full whitespace-nowrap rounded-md border-2">
          <div className="flex">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="m-2">
              <ShowTileSkeleton />
            </div>
          ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    )
  }
  
export const LoadingStatusFilters = () => {
    return (
      <div className="relative">
      <Tabs defaultValue="all" className="w-full">
        <ScrollArea className="w-full">
          <TabsList className={`h-auto w-auto gap-1 p-1 ${backdropTabs}`}>
            {Array.from({ length: 10 }).map((_, index) => (
              <TabsTrigger
                key={index}
                value={index.toString()}
                className={
                  " text-white hover:bg-white hover:text-black rounded-lg"
                }
                data-state={index === 0 ? "active" : "inactive"}
              >
                <Skeleton className="h-8 w-24" />
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Tabs>
    </div>
    )
  }

export async function LoadingYourShowsRow() {
    return (
      <div className="w-full">
        <div className="mb-2">
          <LoadingStatusFilters />
        </div>
        <LoadingShows />
      </div>
    )
  }