'use client'
import { AirDate } from "@/app/models/airDate";
import { Service } from "@/app/models/service";
import { ShowLength } from "@/app/models/showLength";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { getServices } from "../ShowSearchService";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ShowSearchFilters } from "./ShowSearchHeader";
import { Rating } from "@/app/models/rating";
import { Status } from "@/app/models/status";

export type CurrentUserFilters = {
    addedToWatchlist?: boolean;
    ratings: Rating[];
    statuses: Status[];
}

export const defaultCurrentUserFilters: CurrentUserFilters = {
    addedToWatchlist: undefined,
    ratings: [],
    statuses: []
}

type ShowSearchCurrentUserFiltersProps = {
    filters: CurrentUserFilters;
    setFilters: Function;
    showingCurrentUserInfo: boolean; 
    setShowCurrentUserInfo: Function
}

export default function ShowSearchCurrentUserFilters(props: ShowSearchCurrentUserFiltersProps) {
    const { filters, setFilters } = props;
    const { showingCurrentUserInfo, setShowCurrentUserInfo } = props;

    function fetchServices() {
        getServices().then((services) => {
            //setServices(services);
        });
    }

    function fetchFilterData() {
        fetchServices();
    }

    useEffect(() => {
        fetchFilterData();
    }, []);

    const getBoolFromString = (str: string): boolean | undefined => {
        if (str === 'true') return true;
        if (str === 'false') return false;
        return undefined;
    }

    const getStringFromBool = (bool: boolean | undefined): string => {
        if (bool === true) return 'true';
        if (bool === false) return 'false';
        return 'None';
    }

    const selectedBubbleStyle = 'rounded-full py-1 px-2 mx-2 outline outline-1 outline-white hover:bg-white hover:text-black bg-white text-black'
    const unselectedBubbleStyle = 'rounded-full py-1 px-2 mx-2 outline outline-1 outline-white hover:bg-white hover:text-black bg-black text-white'

    const RatingButtons = () => {
        const ratings = Object.values(Rating);
        const unselectedRatings = ratings.filter((r) => !filters.ratings.includes(r));
        return (
            <ScrollArea className="rounded-md overflow-auto">
                <div className="flex py-1">
                    {filters.ratings.map((r) => (
                        <button
                            key={r}
                            onClick={() => setFilters({...filters, ratings: filters.ratings.filter((s) => s !== r)})}
                            className={selectedBubbleStyle}
                        >
                            {r}
                        </button>
                    ))}
                    {unselectedRatings?.map((r) => (
                        <button
                            key={r}
                            onClick={() => setFilters({...filters, ratings: [...filters.ratings, r]})}
                            className={unselectedBubbleStyle}
                        >
                            {r}
                        </button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        )
    }

    const RatingsRow = () => {
        return (
            <div className="">
                <Label>Ratings</Label>
                <RatingButtons />
            </div>
        );
    }

    return (
        <div className="text-white">
            <div className="">
                <span className="flex justify-between">
                    <div className="items-center space-x-2 py-2">
                        <Label>Show Your Info?</Label>
                        <Switch 
                            checked={showingCurrentUserInfo} 
                            onCheckedChange={(changed) => setShowCurrentUserInfo(changed)} 
                        />
                    </div>
                    <button className='p-1 mx-2 rounded-lg outline outline-white hover:bg-white hover:text-black'
                        onClick={() => setFilters(defaultCurrentUserFilters)}
                    >Reset Filters</button>
                </span>
                {showingCurrentUserInfo && <div>
                    <div className="flex space-x-4">
                        <div className="items-center space-x-2 py-2">
                            <Label>Added to your Watchlist?</Label>
                            <RadioGroup value={String(filters.addedToWatchlist)} defaultValue="compact" onValueChange={(value) => setFilters({...filters, addedToWatchlist: getBoolFromString(value)})}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="undefined" id="r1" />
                                    <Label htmlFor="r1">Not Applied</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id="r2" />
                                    <Label htmlFor="r2">Yes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" id="r3" />
                                    <Label htmlFor="r3">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                    <RatingsRow />
                </div>}
            </div>
        </div>
    );

};