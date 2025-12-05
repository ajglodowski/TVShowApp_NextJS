import { backdropTabs } from "@/app/utils/stylingConstants";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShowTileSkeleton from "../../show/ShowTile/ShowTileSkeleton";

export default function CurrentlyAiringLoading() {
    return (
        <div className="w-full">
      <Tabs
        className="w-full"
      >
        <TabsList className={`${backdropTabs} my-2`}>
          {Array.from({ length: 7 }).map((_, index) => (
            <TabsTrigger key={index} value={index.toString()}>
                <Skeleton className="w-24 h-6" />
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="m-2">
                        <ShowTileSkeleton />
                    </div>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Tabs>
    </div>
    );
}