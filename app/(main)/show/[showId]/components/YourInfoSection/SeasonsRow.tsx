'use client'

import { UserUpdateCategory } from "@/app/models/userUpdateType";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState } from "react";

export default function SeasonsRow({ userId, currentSeason, totalSeasons, showId, updateFunction }:
    { userId: string | undefined, currentSeason: number | undefined, totalSeasons: number | undefined, showId: string, updateFunction: Function }) {

  const [currentSeasonState, setCurrentSeasonState] = useState(currentSeason);

  async function changeCurrentSeason(season: number){
    const updateResponse = await updateFunction({ updateType: UserUpdateCategory.ChangedSeason, userId: userId, showId: showId, newValue: season });
    if (updateResponse) setCurrentSeasonState(season);
    else console.log(`Error updating season to ${season} for user ${userId} show ${showId}`);
  };

  const notCurrentSeasonStyle = `w-10 h-10 m-1 rounded-full text-sm font-medium transition-all duration-200 border-2 border-white hover:bg-white hover:text-black flex items-center justify-center`;
  const currentSeasonStyle = `w-10 h-10 m-1 rounded-full text-sm font-medium bg-white text-black border-2 border-white flex items-center justify-center`;

  if (userId === undefined) return (<div>Login to change current season</div>);
  if (currentSeason === undefined) return (<div>Error Loading current season</div>);
  if (totalSeasons === undefined) return (<div>Error Loading total seasons</div>);
  
  const renderSeasonButtons = () => {
    const buttons = [];
    for (let season = 1; season <= totalSeasons; season++) {
      buttons.push(
        <button
            key={season}
            onClick={() => changeCurrentSeason(season)}
            disabled={season === currentSeasonState}
            className={season === currentSeasonState ? currentSeasonStyle : notCurrentSeasonStyle}
        >
            {season}
        </button>
      );
    }
    return buttons;
  };


  const progressPercentage = ((currentSeasonState || 0) / (totalSeasons || 1)) * 100;
  const ProgressBar = () => {
    return (
      <div className="flex flex-row w-full">
        <Progress value={progressPercentage} max={100} className="w-1/2 my-auto bg-black/40" indicatorClassName="bg-white" />
        <div className="px-2 text-white">{progressPercentage.toFixed(0)}%</div>
      </div>
    );
  };

  return (
    <div>
      <div className="">
        <h2 className='text-xl tracking-tight text-left'>Your Progress</h2>
        <div className="flex flex-row"><ProgressBar /></div>
      </div>
      <div className="">
        <h2 className='text-xl tracking-tight text-left'>Current Season</h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border-2 p-2">
          <div className="flex flex-row flex-nowrap">
            {renderSeasonButtons()}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

