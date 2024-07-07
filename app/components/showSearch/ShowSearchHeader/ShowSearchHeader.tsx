'use client'
import { AirDate } from "@/app/models/airDate";
import { Service } from "@/app/models/service";
import { ShowLength } from "@/app/models/showLength";
import ShowSearchFilters from "./ShowSearchFilters";
import Divider from "../../Divider";
import { Input } from "@/components/ui/input";
import ShowSearchCurrentUserFilters, { CurrentUserFilters } from "./ShowSearchCurrentUserFilters";

export type ShowSearchFiltersType = {
    service: Service[];
    length: ShowLength[];
    airDate: AirDate[];
    limitedSeries?: boolean;
    running?: boolean;
    currentlyAiring?: boolean;
}

export const defaultFilters: ShowSearchFiltersType = {
    service: [],
    length: [],
    airDate: [],
    limitedSeries: undefined,
    running: undefined,
    currentlyAiring: undefined
}

type ShowSearchHeaderProps = {
    filters: ShowSearchFiltersType;
    setFilters: Function; 
    showingCurrentUserInfo: boolean; 
    setShowCurrentUserInfo: Function
    searchResults: string | undefined;
    setSearchResults: Function;
    currentUserFilters: CurrentUserFilters;
    setCurrentUserFilters: Function;
}

export default function ShowSearchHeader(props: ShowSearchHeaderProps) {

    return (
        <div className="">
            <ShowSearchFilters filters={props.filters} setFilters={props.setFilters} />
            <div className="text-white p-4">
                <span className="flex justify-between">
                    <h1 className="text-5xl font-bold">Result Filters</h1>
                </span>
                <ShowSearchCurrentUserFilters showingCurrentUserInfo={props.showingCurrentUserInfo} filters={props.currentUserFilters} setFilters={props.setCurrentUserFilters} setShowCurrentUserInfo={props.setShowCurrentUserInfo}/>
                <div className="flex items-center space-x-2 py-2">
                    <Input
                        className="bg-black"
                        type="text"
                        placeholder="Search through results" 
                        value={props.searchResults} 
                        onChange={(e) => props.setSearchResults(e.target.value)}
                    />
                </div>
            </div>
            <Divider />
        </div>
    );

};