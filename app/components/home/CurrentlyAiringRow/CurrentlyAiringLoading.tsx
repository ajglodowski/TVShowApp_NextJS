import { backdropTabs } from "@/app/utils/stylingConstants";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShowTileSkeleton from "../../show/ShowTile/ShowTileSkeleton";

export default function CurrentlyAiringLoading() {
    return (
        <div className="w-full">
          <Tabs className="w-full">
            <div className="px-1 pb-3">
              <TabsList className={`${backdropTabs}`}>
                {Array.from({ length: 7 }).map((_, index) => (
                  <TabsTrigger key={index} value={index.toString()}>
                      <Skeleton className="w-20 h-5" />
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-3 px-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex-shrink-0">
                            <ShowTileSkeleton />
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="opacity-0" />
            </ScrollArea>
          </Tabs>
        </div>
    );
}