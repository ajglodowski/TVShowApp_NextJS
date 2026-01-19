"use client"
import { Show } from "@/app/models/show"
import type { Status } from "@/app/models/status"
import { StatusIcon } from "@/app/utils/StatusIcon"
import { backdropTabs } from "@/app/utils/stylingConstants"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import ClientShowTile from "../../show/ShowTile/ClientShowTile"
import { getYourShows } from "../HomeClientService"
import { LoadingShows, LoadingStatusFilters } from "./LoadingYourShowsRow"

type YourShowsRowClientProps = {
  userId: string
  allStatuses: Status[] | null
  isHero?: boolean
}

export default function YourShowsRowClient({ userId, allStatuses, isHero = false }: YourShowsRowClientProps) {
  const [selectedStatus, setSelectedStatus] = useState<Status[]>([])
  const [displayedShows, setDisplayedShows] = useState<Show[] | null | undefined>(undefined)

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
    setDisplayedShows(undefined)
    getYourShows({userId, selectedStatuses: selectedStatus}).then((shows) => {
      if (!shows) setDisplayedShows(null)
      else setDisplayedShows(shows)
    });
  }, [selectedStatus, userId])

  function ShowRow() {
    if (displayedShows === undefined) return <LoadingShows />;
    if (displayedShows === null) return <div className="py-4 text-center text-sm text-white/40">Error loading your shows</div>;
    if (displayedShows.length === 0) return <div className="py-4 text-center text-sm text-white/40">No shows match this criteria</div>;
    return (
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-3">
          {displayedShows.map((showData) => (
            <div key={showData.id} className="flex-shrink-0">
              <ClientShowTile showDto={showData} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="opacity-0" />
      </ScrollArea>
    )
  }

  function StatusFilters() {
    if (!allStatuses) return <LoadingStatusFilters />

    return (
      <div className="space-y-2">
        {selectedStatus.length > 0 && (
          <div className="flex items-center flex-wrap gap-2 min-h-8">
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllSelections}
              className="flex items-center gap-1 h-8 border border-white/10 bg-transparent hover:bg-white/[0.06] hover:border-primary/50 text-white/70 hover:text-white rounded-md transition-all duration-200"
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
                  className="flex font-medium items-center gap-1 h-8 px-3 bg-white/[0.12] text-white rounded-md hover:bg-white/[0.18] transition-colors duration-150"
                >
                  {status.name}
                  <X className="h-3 w-3" />
                </Badge>
              </button>
            ))}
          </div>
        )}

        <div className="relative">
          <Tabs defaultValue="all" className="w-full">
            <ScrollArea className="w-full">
              <TabsList className={backdropTabs}>
                {allStatuses.map((status) => (
                  <TabsTrigger
                    key={status.id}
                    value={status.id.toString()}
                    onClick={() => handleStatusChange(status)}
                    className={
                      selectedStatus.includes(status)
                        ? "bg-white/[0.12] text-white rounded-md font-medium border border-transparent transition-all duration-200"
                        : "text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-primary/50 rounded-md transition-all duration-200"
                    }
                  >
                    <div className="flex items-center gap-1">
                      <StatusIcon {...status} />
                      {status.name}
                    </div> 
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
      <div className={isHero ? "pb-3" : "px-1 pb-3"}>
        <StatusFilters />
      </div>
      <ShowRow />
    </div>
  )
}



