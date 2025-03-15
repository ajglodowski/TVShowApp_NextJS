"use client"
import { useEffect, useState } from "react"
import type { AirDate, CurrentlyAiringDTO } from "@/app/models/airDate"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentlyAiring } from "./HomeClientService"
import ClientShowTile from "../show/ShowTile/ClientShowTile"

type AirDateInfo = {
  day: AirDate
  shows: CurrentlyAiringDTO[]
}

export default function CurrentlyAiringRow({ userId }: { userId: string }) {
  const [shows, setShows] = useState<CurrentlyAiringDTO[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<AirDate | null>(null);

  const dayToAirdate = (day: number): AirDate => {
    switch (day) {
      case 0:
        return "Sunday" as AirDate
      case 1:
        return "Monday" as AirDate
      case 2:
        return "Tuesday" as AirDate
      case 3:
        return "Wednesday" as AirDate
      case 4:
        return "Thursday" as AirDate
      case 5:
        return "Friday" as AirDate
      case 6:
        return "Saturday" as AirDate
      default:
        return "Unknown" as AirDate
    }
  }

  const today = dayToAirdate(new Date().getDay())

  useEffect(() => {
    async function fetchShows() {
      try {
        const data = await getCurrentlyAiring({ userId: userId })
        setShows(data)
        const hasShowsToday = data?.some((show) => show.airdate === today)
        if (hasShowsToday) {
          setActiveDay(today)
        } else if (data && data.length > 0) {
          setActiveDay(data[0].airdate)
        }
      } catch (error) {
        console.error("Error fetching shows:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchShows()
  }, [userId])

  const groupedShows = (): AirDateInfo[] => {
    if (shows === null) return []
    const days = new Set(shows?.map((show) => show.airdate)) as Set<AirDate>
    const output: AirDateInfo[] = []
    days.forEach((day) => {
      const showsForDay = shows?.filter((show) => show.airdate === day)
      const dayInfo = { day: day, shows: showsForDay }
      output.push(dayInfo)
    })
    return output
  }



  if (loading) return <div className="p-4">Loading currently airing shows...</div>
  if (shows === null) return <div className="p-4">Error Loading Currently Airing</div>
  if (shows.length === 0) return <div className="p-4">No shows currently airing</div>

  const sortedDays = groupedShows().sort((a, b) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days.indexOf(a.day) - days.indexOf(b.day)
  })

  return (
    <div className="w-full">
      <Tabs
        defaultValue={activeDay || sortedDays[0]?.day}
        onValueChange={(value) => setActiveDay(value as AirDate)}
        className="w-full"
      >
        <TabsList className="bg-white/5 text-white h-auto w-auto gap-1 p-1">
          {sortedDays.map(({ day }) => (
            <TabsTrigger key={day} value={day} 
                className={
                    activeDay === day
                        ? "data-[state=active]:bg-white data-[state=active]:text-black hover:bg-gray-200 hover:text-black rounded-lg"
                        : "text-white hover:bg-white hover:text-black rounded-lg"
                }>
                <div className="flex-wrap">
                    <p className="flex-row"> {day} </p>
                    { day==today && <p className="flex-row font-bold"> Today </p>}
                </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {sortedDays.map(({ day, shows }) => (
          <TabsContent key={day} value={day} className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {shows.map((show) => (
                <div key={show.id}>
                  <ClientShowTile showId={show.id.toString()} />
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}