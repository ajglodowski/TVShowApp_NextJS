'use client'

import { getShow, updateShow } from "@/app/components/show/ClientShowService";
import { AirDate } from "@/app/models/airDate";
import { Show } from "@/app/models/show";
import { ShowLength } from "@/app/models/showLength";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { CardContent } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

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


export default function EditShowPage({ params }: { params: { showId: string } }) {
  const showId = params.showId;

  const [showData, setShowData] = useState<Show | null | undefined>(undefined);

  const { toast } = useToast();

  async function submitChanges() {
    if (!showData) return;
    const response = await updateShow(showData!);
    if (!response) toast({variant: 'destructive',description: 'Error Updating Show', title: 'Failure'});
    else toast({description: 'Show Updated', title: 'Success'});
  }

  useEffect(() => {
    getShow(showId).then((show) => {
      if (!show) setShowData(null);
      else setShowData(show);
    });
  }, [showId]);

  if (showData === undefined) {
    return <LoadingShow />
  }

  if (showData === null) {
    return <ShowNotFound />
  }

  function logFunction() {
    console.log(showData?.length);
    console.log(showData);
  }

  function convertAirDate(value: string): AirDate | undefined {
    if (value === 'None') return undefined;
    return value as AirDate;
  }

  function getAirDateString(airdate: AirDate | undefined | null): string {
    if (!airdate) return 'None';
    return airdate;
  }

  return (
    <div className='w-full h-full'>
      <button 
        onClick={() => logFunction()}
      >
        Log Data
      </button>
      <Card className="bg-black text-white m-8">
        <CardHeader>
          <CardTitle>
            <span className="flex items-center justify-between">
              <h1>Show Info</h1>
              <span className="flex items-center space-x-2">
                <button onClick={() => submitChanges()} className='p-1 mx-2 text-md rounded-lg outline outline-white hover:bg-white hover:text-black'>
                    Submit Changes
                </button>
                <Link href={`/show/${showId}`}>
                  <button onClick={() => logFunction()} className='p-1 mx-2 text-md rounded-lg outline outline-white hover:bg-white hover:text-black'>
                      Return to Show
                  </button>
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
          <div className="flex items-center space-x-2 py-2">
            <Label>Running?</Label>
            <Switch checked={showData.running} 
              onCheckedChange={(changed) => setShowData({...showData, running: changed})} />
          </div>
          <div className="flex items-center space-x-2 py-2">
            <Label>Show Length</Label>
            <Select value={showData.length} 
              onValueChange={(value) => setShowData({...showData, airdate: convertAirDate(value)})}>
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
                  <SelectItem value={airDate}>{airDate}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>


    </div>

  );
}