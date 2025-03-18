'use client'
import { AirDate } from "@/app/models/airDate";
import { Service } from "@/app/models/service";
import { ShowLength } from "@/app/models/showLength";
import { Input } from "@/components/ui/input";
import ShowSearchCurrentUserFilters, { CurrentUserFilters, defaultCurrentUserFilters } from "./ShowSearchCurrentUserFilters";
import { Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShowSearchFilterButton from "./ShowSearchFilterButton";
import ShowSearchFiltersRow from "./ShowSearchFiltersRow";
import ShowSearchCurrentUserFiltersRow from "./ShowSearchCurrentUserFiltersRow";
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
            <div className="text-white px-4 py-1">
                <div className="flex justify-between space-x-2 items-center mt-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2  h-4 w-4" />
                        <Input
                            className={`pl-10 bg-white/5 text-white`}
                            type="text"
                            placeholder="Search through results" 
                            value={props.searchResults} 
                            onChange={(e) => props.setSearchResults(e.target.value)}
                        />
                        {props.searchResults && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                                onClick={() => props.setSearchResults('')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <div className="flex space-x-2">
                        <ShowSearchCurrentUserFilters 
                            filters={props.currentUserFilters} 
                            setFilters={props.setCurrentUserFilters} 
                        />
                        <ShowSearchFilterButton filters={props.filters} setFilters={props.setFilters} />
                    </div>
                </div>

                <ShowSearchFiltersRow filters={props.filters} setFilters={props.setFilters} />
                <ShowSearchCurrentUserFiltersRow filters={props.currentUserFilters} setFilters={props.setCurrentUserFilters} />
                
            </div>
        </div>
    );

};