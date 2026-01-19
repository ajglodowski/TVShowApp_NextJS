import type { AirDate, CurrentlyAiringDTO } from "@/app/models/airDate"
import { backdropTabs } from "@/app/utils/stylingConstants"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ShowTile from "../../show/ShowTile/ShowTile"

type AirDateInfo = {
  day: AirDate
  shows: CurrentlyAiringDTO[]
}

export default function CurrentlyAiringRowClient({ currentlyAiringShows }: { currentlyAiringShows: CurrentlyAiringDTO[] | null }) {
  const shows = currentlyAiringShows;

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

  const today = dayToAirdate(new Date().getDay());
  const hasShowsToday = shows?.some((show) => show.airdate === today);

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

  if (shows === null) return <div className="px-1 py-6 text-center text-sm text-white/40">Error loading currently airing shows</div>
  if (shows.length === 0) return <div className="px-1 py-6 text-center text-sm text-white/40">No shows currently airing</div>

  const sortedDays = groupedShows().sort((a, b) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days.indexOf(a.day) - days.indexOf(b.day)
  })

  let initialDefaultDay: AirDate | undefined = undefined;
  if (hasShowsToday) {
    initialDefaultDay = today;
  } else if (sortedDays.length > 0) {
    initialDefaultDay = sortedDays[0].day;
  }

  return (
    <div className="w-full">
      <Tabs
        defaultValue={initialDefaultDay}
        className="w-full"
      >
        <div className="px-1 pb-3">
          <TabsList className={backdropTabs}>
            {sortedDays.map(({ day }) => (
              <TabsTrigger 
                  key={day} 
                  value={day} 
                  className="rounded-md text-white/70 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-primary/50 transition-all duration-200 aria-selected:bg-white/[0.12] aria-selected:text-white aria-selected:font-medium aria-selected:border-transparent"
              >
                  <div className="flex flex-col items-center py-0.5 px-1">
                      <p className="text-sm">{day}</p>
                      {day === today && <p className="text-[10px] font-medium opacity-80">Today</p>}
                  </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {sortedDays.map(({ day, shows }) => (
          <TabsContent key={day} value={day} className="mt-0">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-3 px-1">
                {shows.map((show) => (
                  <div key={show.id} className="flex-shrink-0">
                    <ShowTile showId={show.id.toString()} />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="opacity-0" />
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}