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
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex-shrink-0">
            <ShowTileSkeleton />
          </div>
        ))}
        </div>
        <ScrollBar orientation="horizontal" className="opacity-0" />
      </ScrollArea>
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
        <div className="pb-3">
          <LoadingStatusFilters />
        </div>
        <LoadingShows />
      </div>
    )
  }