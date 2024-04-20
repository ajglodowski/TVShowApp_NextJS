'use client'

import { UserUpdateCategory } from "@/app/models/userUpdateType";
import { useState } from "react";

export default function SeasonsRow({ userId, currentSeason, totalSeasons, showId, updateFunction }:
    { userId: string | undefined, currentSeason: number | undefined, totalSeasons: number | undefined, showId: string, updateFunction: Function }) {

  const [currentSeasonState, setCurrentSeasonState] = useState(currentSeason);

  async function changeCurrentSeason(season: number){
    let updateResponse = await updateFunction({ updateType: UserUpdateCategory.ChangedSeason, userId: userId, showId: showId, newValue: season });
    if (updateResponse) setCurrentSeasonState(season);
    else console.log(`Error updating season to ${season} for user ${userId} show ${showId}`);
  };

  const notCurrentSeasonStyle = `py-2 px-4 m-1 rounded-lg outline outline-white hover:bg-white hover:text-black`;
  const currentSeasonStyle = `py-2 px-4 m-1 rounded-lg bg-white text-black`;

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

  return (
    <div>
      <h2 className='text-2xl tracking-tight text-left'>Current Season</h2>
      <div>{renderSeasonButtons()}</div>
    </div>
  );
};

