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
import ShowSearchFilters from "./ShowSearchFilters";
import Divider from "../../Divider";

export type ShowSearchFilters = {
    service: Service[];
    length: ShowLength[];
    airDate: AirDate[];
    limitedSeries?: boolean;
    running?: boolean;
    currentlyAiring?: boolean;
}

export const defaultFilters: ShowSearchFilters = {
    service: [],
    length: [],
    airDate: [],
    limitedSeries: undefined,
    running: undefined,
    currentlyAiring: undefined
}

export default function ShowSearchHeader({filters, setFilters, showingCurrentUserInfo, setShowCurrentUserInfo}: {filters: ShowSearchFilters, setFilters: Function, showingCurrentUserInfo: boolean, setShowCurrentUserInfo: Function}) {

    return (
        <div className="">
            <ShowSearchFilters filters={filters} setFilters={setFilters} />
            <div className="flex items-center space-x-2 py-2">
                <Label>Show Your Info?</Label>
                <Switch 
                    checked={showingCurrentUserInfo} 
                    onCheckedChange={(changed) => setShowCurrentUserInfo(changed)} 
                />
            </div>
            <Divider />
        </div>
    );

};