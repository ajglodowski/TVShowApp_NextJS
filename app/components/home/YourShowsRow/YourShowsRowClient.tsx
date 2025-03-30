"use client"
import { useEffect, useState } from "react"
import { getYourShows } from "../HomeClientService"
import ClientShowTile from "../../show/ShowTile/ClientShowTile"
import type { Status } from "@/app/models/status"
import type { UserShowData } from "@/app/models/userShowData"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X } from "lucide-react"
import ShowTileSkeleton from "../../show/ShowTile/ShowTileSkeleton"

export default function YourShowsRowClient({ userId, allStatuses }: { userId: string; allStatuses: Status[] | null }) {
  const [selectedStatus, setSelectedStatus] = useState<Status[]>([])
  const [displayedShows, setDisplayedShows] = useState<UserShowData[] | null | undefined>(undefined)

  const handleStatusChange = (status: Status) => {
    if (selectedStatus.includes(status)) {
      setSelectedStatus(selectedStatus.filter((s) => s !== status))
    } else {
      setSelectedStatus([...selectedStatus, status])
    }
  }

  const clearAllSelections = () => {
    setSelectedStatus([])
  }

  useEffect(() => {
    // On page load
    setDisplayedShows(undefined)
    getYourShows({ userId: userId, selectedStatuses: selectedStatus }).then((shows) => {
      if (!shows) setDisplayedShows(null)
      else setDisplayedShows(shows)
    })
  }, [selectedStatus, userId])

  const LoadingShows = () => {
    return (
      <div className="flex items-center justify-center mx-2">
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

  function ShowRow() {
    if (displayedShows === undefined) return <LoadingShows />;
    if (displayedShows === null) return <div>Error Loading your shows</div>;
    if (displayedShows.length === 0) return <div>No Shows match this criteria</div>;
    return (
      <div className="flex items-center justify-center mx-2">
        <ScrollArea className="w-full whitespace-nowrap rounded-md border-2">
          <div className="flex">
            {displayedShows.map((showData) => (
              <div key={showData.showId} className="m-2">
                <ClientShowTile showId={showData.showId.toString()} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    )
  }

  function StatusFilters() {
    if (!allStatuses) return null

    return (
      <div className="space-y-2">
        <div className="flex items-center flex-wrap gap-2 min-h-8">
          {selectedStatus.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllSelections}
                className="flex items-center gap-1 h-8 border border-white/20 bg-transparent hover:bg-white/10 hover:text-white"
              >
                Clear all <X className="h-3 w-3" />
              </Button>

              {selectedStatus.map((status) => (
                <button
                  key={status.id}
                  onClick={() => handleStatusChange(status)}
                >
                  <Badge
                    variant="secondary"
                    className="flex font-medium items-center gap-1 h-8 px-3 bg-white text-black rounded-lg"
                  >
                    {status.name}
                    <X className="h-3 w-3" />
                  </Badge>
                </button>
              ))}
            </>
          )}
        </div>

        <div className="relative">
          <Tabs defaultValue="all" className="w-full ">
            <ScrollArea className="w-full">
              <TabsList className="bg-white/5 text-white h-auto w-auto gap-1 p-1">
                {allStatuses.map((status) => (
                  <TabsTrigger
                    key={status.id}
                    value={status.id.toString()}
                    onClick={() => handleStatusChange(status)}
                    className={
                      selectedStatus.includes(status)
                        ? "data-[state=active]:bg-white data-[state=active]:text-black hover:bg-gray-200 hover:text-black rounded-lg"
                        : " text-white hover:bg-white hover:text-black rounded-lg"
                    }
                    data-state={selectedStatus.includes(status) ? "active" : "inactive"}
                  >
                    {status.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-2">
        <StatusFilters />
      </div>
      <ShowRow />
    </div>
  )
}

