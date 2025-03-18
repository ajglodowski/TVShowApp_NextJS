'use client'
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useEffect, ReactNode } from "react";
import { getServices } from "../ShowSearchService";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Rating } from "@/app/models/rating";
import { Status } from "@/app/models/status";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, User, X } from "lucide-react";
import { backdropBackground } from "@/utils/stylingConstants";

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
}

export default function ShowSearchCurrentUserFilters(props: ShowSearchCurrentUserFiltersProps) {
    const { filters, setFilters } = props;

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
        return 'undefined';
    }

    const clearUserFilters = () => {
        setFilters(defaultCurrentUserFilters);
    };

    const hasActiveUserFilters = () => {
        return Object.values(filters).some(value => 
            (Array.isArray(value) && value.length > 0) || 
            (typeof value === 'boolean' && value)
        );
    };

    const selectedBubbleStyle = 'rounded-full py-1 px-2 mx-2 outline outline-1 outline-white hover:bg-white hover:text-black bg-white text-black'
    const unselectedBubbleStyle = 'rounded-full py-1 px-2 mx-2 outline outline-1 outline-white hover:bg-white hover:text-black text-white'

    const RatingButtons = () => {
        const allRatings = Object.values(Rating);
        const unselectedRatings = allRatings.filter((rating) => !filters.ratings.includes(rating));

        return (
            <div className="grid grid-cols-2 gap-2">
                {filters.ratings.map((rating) => (
                    <button
                        key={rating}
                        className={selectedBubbleStyle}
                        onClick={() => setFilters({ ...filters, ratings: filters.ratings.filter((r) => r !== rating) })}
                    >
                        {rating}
                    </button>
                ))}

                {unselectedRatings.map((rating) => (
                    <button
                        key={rating}
                        className={unselectedBubbleStyle}
                        onClick={() => setFilters({ ...filters, ratings: [...filters.ratings, rating] })}
                    >
                        {rating}
                    </button>
                ))}
            </div>
        )
    }

    const RatingsRow = () => {
        return (
            <div className="p-6 pb-0">
                <div className="text-lg font-medium">Filter by Rating</div>
                <RatingButtons />
            </div>
        )
    }

    const StatusButtons = () => {
        const allStatuses: Status[] = [];
        const unselectedStatuses = allStatuses.filter((status) => !filters.statuses.includes(status));

        return (
            <div className="grid grid-cols-2 gap-2">
                {filters.statuses.map((status) => (
                    <button
                        key={status.name}
                        className={selectedBubbleStyle}
                        onClick={() => setFilters({ ...filters, statuses: filters.statuses.filter((s) => s !== status) })}
                    >
                        {status.name}
                    </button>
                ))}

                {unselectedStatuses.map((status) => (
                    <button
                        key={status.name}
                        className={unselectedBubbleStyle}
                        onClick={() => setFilters({ ...filters, statuses: [...filters.statuses, status] })}
                    >
                        {status.name}
                    </button>
                ))}
            </div>
        )
    }

    const StatusesRow = () => {
        return (
            <div className="p-6 pb-0">
                <div className="text-lg font-medium">Filter by Status</div>
                <StatusButtons />
            </div>
        )
    }

    const WatchListRow = () => {
        return (
            <div className="p-6 pb-0">
                <div className="text-lg font-medium">Filter by Watch List</div>
                <RadioGroup defaultValue={getStringFromBool(filters.addedToWatchlist)}
                     onValueChange={(value) => {
                        setFilters({ ...filters, addedToWatchlist: getBoolFromString(value) })
                     }}
                >
                    <div className="flex items-center space-x-2 mt-2">
                        <RadioGroupItem value="undefined" id="all" />
                        <Label htmlFor="all">All</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="inWatchlist" />
                        <Label htmlFor="inWatchlist">In My Watch List</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="notInWatchlist" />
                        <Label htmlFor="notInWatchlist">Not In My Watch List</Label>
                    </div>
                </RadioGroup>
            </div>
        )
    }

    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className={`${backdropBackground} text-white`}>
                        <User className="mr-2 h-4 w-4" />
                        Your Filters
                    </Button>
                </SheetTrigger>
                <SheetContent className={`${backdropBackground} text-white`}>
                    <SheetHeader>
                        <span className="flex justify-between items-center">
                            <SheetTitle className="text-white">My Show Filters</SheetTitle>
                            <Button 
                                    variant="outline" 
                                    className={`${backdropBackground} text-white me-2 hover:bg-white hover:text-black`}
                                    onClick={clearUserFilters}
                                >
                                    Reset Filters
                            </Button>
                        </span>
                        <SheetDescription className="text-white/70">
                            Filter shows based on your personal data.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <RatingsRow />
                        <StatusesRow />
                        <WatchListRow />
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}