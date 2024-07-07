'use client'

import { getShow, updateShow } from "@/app/components/show/ClientShowService";
import { AirDate } from "@/app/models/airDate";
import { Service } from "@/app/models/service";
import { NewShow, Show } from "@/app/models/show";
import { ShowLength } from "@/app/models/showLength";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getServices } from "../showSearch/ShowSearchService";

function ShowNotFound() {
  return (
    <div className='text-center my-auto mx-auto'>
        <h1 className='text-4xl font-bold'>Uh oh</h1>
        <h2 className='text-2xl'>Show not found</h2>
        <h2 className='text-5xl'>😞</h2>
    </div>
  );
}

function LoadingShow() {
  return (
    <div className='text-center my-auto mx-auto'>
        <h1 className='text-4xl font-bold'>Hold On...</h1>
        <h2 className='text-2xl'>Loading Show</h2>
    </div>
  );
}

export default function EditShowPage({showId}: {showId?: string|undefined}) {

  const [originalShowData, setOriginalShowData] = useState<Show | null | undefined>(undefined);
  const [showData, setShowData] = useState<Show | null | undefined>(undefined);
  const [services, setServices] = useState<Service[] | null | undefined>(undefined);

  const { toast } = useToast();

  async function submitChanges() {
    if (!showData) return;
    const response = await updateShow(showData!);
    if (!response) toast({variant: 'destructive',description: 'Error Updating Show', title: 'Failure'});
    else toast({description: 'Show Updated', title: 'Success'});
  }

  useEffect(() => {
    getServices().then((services) => {
        if (services) setServices(services);
        else setServices(null);
    });
  }, []);

  useEffect(() => {
    if (showId) {
        getShow(showId).then((show) => {
            if (!show) setShowData(null);
            else {
              setOriginalShowData(show);
              setShowData(show);
            }
        });
    } else {
        setShowData(NewShow);
    }
  }, [showId]);

  if (showData === undefined) {
    return <LoadingShow />
  }

  if (showData === null) {
    return <ShowNotFound />
  }

  /*
  function logFunction() {
    console.log(showData?.length);
    console.log(showData);
  }

  function convertAirDate(value: string): AirDate | undefined {
    if (value === 'None') return undefined;
    return value as AirDate;
  }
  */

  function getAirDateString(airdate: AirDate | undefined | null): string {
    if (!airdate) return 'None';
    return airdate;
  }

  function convertLength(value: string): ShowLength {
    if (value === 'None') return ShowLength.NONE;
    return value as ShowLength;
  }

  function resetShow() {
    if (originalShowData) setShowData(originalShowData);
  }

  const ReleaseDatePicker = () => {
    return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className= "w-[280px] justify-start text-left font-normal text-black text"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {showData.releaseDate ? format(showData.releaseDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={showData.releaseDate}
              onSelect={(e) => setShowData({...showData, releaseDate: e})}
              initialFocus
            />
          </PopoverContent>
        </Popover>
    );
  };

  const ServiceRow = () => {
    const findService = (id: string): Service | undefined => {
      return services?.find((service) => service.id.toString() === id);
    }
    return (
      <div className="">
        <Label>Service</Label>
        { services &&
          <Select value={showData.service.id.toString()} 
            onValueChange={(value) => setShowData({...showData, service: findService(value) as Service})} >
            <SelectTrigger className="bg-black w-[180px]">
              <SelectValue defaultValue={showData.service.id.toString()} />
            </SelectTrigger>
            <SelectContent>
              { services?.map((service) => (
                <SelectItem key={service.id} value={service.id.toString()}>{service.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
        { services === null && <span>Error Loading Services</span>}
        { services === undefined && <span>Loading Services...</span>}
      </div>
    );
  }

  return (
    <div className='w-full h-full'>
      <h1 className="text-2xl font-bold mx-4">Editing {showData.name}</h1>
      <Card className="bg-black text-white m-8">
        <CardHeader>
          <CardTitle>
            <span className="md:flex-wrap md:flex items-center justify-between">
              <h1>Show Info</h1>
              <span className="flex-wrap md:flex items-center md:space-x-2">
                { showData !== originalShowData &&
                  <Button
                    variant="destructive"
                    className= "text-xl bg-transparent"
                    onClick={() => resetShow()}
                  >
                    Reset Changes
                  </Button>
                }
                <Button
                  variant="ghost"
                  className= "text-xl hover:bg-green-300"
                  onClick={() => submitChanges()}
                >
                  Submit Changes
                </Button>
                <Link href={`/show/${showId}`}>
                  <Button
                    variant="ghost"
                    className= "text-xl"
                  >
                    Return to Show
                  </Button>
                </Link>
              </span>
            </span>
        </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5 py-2">
            <Label>Show Name</Label>
            <Input
              className="bg-black"
              type="text" 
              value={showData.name} 
              onChange={(e) => setShowData({...showData, name: e.target.value})}
            />
          </div>
          <ServiceRow />
          <div className="flex items-center space-x-2 py-2">
            <Label>Running?</Label>
            <Switch checked={showData.running} 
              onCheckedChange={(changed) => setShowData({...showData, running: changed})} />
          </div>
          <div className="flex items-center space-x-2 py-2">
            <Label>Show Length</Label>
            <Select value={showData.length} 
              onValueChange={(value) => setShowData({...showData, length: convertLength(value)}) } >
              <SelectTrigger className="bg-black w-[180px]">
                <SelectValue defaultValue={typeof showData.length} />
              </SelectTrigger>
              <SelectContent>
                { Object.values(ShowLength).map((length) => (
                  <SelectItem key={length} value={length}>{length} {length !== ShowLength.NONE && 'minutes'}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 py-2">
            <Label>Limited Series?</Label>
            <Switch checked={showData.limitedSeries} 
              onCheckedChange={(changed) => setShowData({...showData, limitedSeries: changed})} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5 py-2">
            <Label>Total Seasons</Label>
            <Input
              className="bg-black"
              type="number" 
              value={showData.totalSeasons} 
              onChange={(e) => setShowData({...showData, totalSeasons: Number(e.target.value)})}
            />
          </div>
          <div className="flex items-center space-x-2 py-2">
            <Label>Release Date:</Label>
            <ReleaseDatePicker />
            { showData.releaseDate &&
              <Button
                variant="destructive"
                className= "text-xl bg-transparent"
                onClick={() => setShowData({...showData, releaseDate: undefined})}
              >
                Remove Release Date
              </Button>
            }
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black text-white m-8">
        <CardHeader>
          <CardTitle>
            <span className="flex">
              <h1>Currently Airing</h1>
            </span>
          </CardTitle>
          <CardDescription>Info about if the show is currently airing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 py-2">
            <Label>Currently Airing</Label>
            <Switch checked={showData!.currentlyAiring} 
              onCheckedChange={(changed) => setShowData({...showData, currentlyAiring: changed})} />
          </div>
          <div className="flex items-center space-x-2 py-2">
            <Label>Airdate</Label>
            <Select value={getAirDateString(showData.airdate)}
              onValueChange={(value) => {
                if (value !== 'None') setShowData({...showData, airdate: value as AirDate});
                else setShowData({...showData, airdate: undefined});
              }}
            >
              <SelectTrigger className="bg-black w-[180px]">
                <SelectValue placeholder={getAirDateString(showData.airdate)}/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"None"}>None</SelectItem>
                { Object.values(AirDate).map((airDate) => (
                  <SelectItem key={airDate} value={airDate}>{airDate}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>


    </div>

  );
}