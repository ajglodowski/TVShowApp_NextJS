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
import { ShowSearchFiltersType, defaultFilters } from "./ShowSearchHeader";

export default function ShowSearchFilters({filters, setFilters}: {filters: ShowSearchFiltersType, setFilters: Function}) {

    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [services, setServices] = useState<Service[]|null|undefined>(undefined);

    function fetchServices() {
        getServices().then((services) => {
            setServices(services);
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

    const selectedBubbleStyle = 'rounded-full py-1 px-2 mx-2 outline outline-1 outline-white hover:bg-white hover:text-black bg-white text-black'
    const unselectedBubbleStyle = 'rounded-full py-1 px-2 mx-2 outline outline-1 outline-white hover:bg-white hover:text-black bg-black text-white'

    function ServiceButtons() {
        if (!services) return (<></>);
        const unselectedStatuses = services?.filter((service) => !filters.service.includes(service));
        return (
            <ScrollArea className="rounded-md overflow-auto">
                <div className="flex py-1">
                    {filters.service.map((service) => (
                        <button
                            key={service.id}
                            onClick={() => setFilters({...filters, service: filters.service.filter((s) => s !== service)})}
                            className={selectedBubbleStyle}
                        >
                            {service.name}
                        </button>
                    ))}
                    {unselectedStatuses?.map((service) => (
                        <button
                            key={service.id}
                            onClick={() => setFilters({...filters, service: [...filters.service, service]})}
                            className={unselectedBubbleStyle}
                        >
                            {service.name}
                        </button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        )
    }

    const ServicesRow = () => {
        return (
            <div className="">
                <Label>Services</Label>
                <ServiceButtons />
            </div>
        );
    }

    const AirdateButtons = () => {
        const airdates = Object.values(AirDate);
        const unselectedAirdates = airdates?.filter((airdate) => !filters.airDate.includes(airdate));
        return (
            <ScrollArea className="rounded-md overflow-auto">
                <div className="flex py-1">
                    {filters.airDate.map((airdate) => (
                        <button
                            key={airdate}
                            onClick={() => setFilters({...filters, airDate: filters.airDate.filter((s) => s !== airdate)})}
                            className={selectedBubbleStyle}
                        >
                            {airdate}
                        </button>
                    ))}
                    {unselectedAirdates?.map((airdate) => (
                        <button
                            key={airdate}
                            onClick={() => setFilters({...filters, airDate: [...filters.airDate, airdate]})}
                            className={unselectedBubbleStyle}
                        >
                            {airdate}
                        </button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        )
    }

    const AirdatesRow = () => {
        return (
            <div className="">
                <Label>Air Dates</Label>
                <AirdateButtons />
            </div>
        );
    }

    const LengthButtons = () => {
        const lengths = Object.values(ShowLength);
        const unselectLengths = lengths?.filter((lengths) => !filters.length.includes(lengths));
        return (
            <ScrollArea className="rounded-md overflow-auto">
                <div className="flex py-1">
                    {filters.length.map((length) => (
                        <button
                            key={length}
                            onClick={() => setFilters({...filters, length: filters.length.filter((s) => s !== length)})}
                            className={selectedBubbleStyle}
                        >
                            {length}{length === ShowLength.NONE ? '' : 'm'}
                        </button>
                    ))}
                    {unselectLengths?.map((length) => (
                        <button
                            key={length}
                            onClick={() => setFilters({...filters, length: [...filters.length, length]})}
                            className={unselectedBubbleStyle}
                        >
                            {length}{length === ShowLength.NONE ? '' : 'm'}
                        </button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        )
    }

    const LengthRow = () => {
        return (
            <div className="">
                <Label>Length</Label>
                <LengthButtons />
            </div>
        );
    }

    return (
        <div className="text-white p-4">
            <span className="flex justify-between">
                <h1 className="text-5xl font-bold">Search Filters</h1>
            </span>
            <div className="border-2 rounded-md p-1">
                <div className="flex justify-between">
                    <div className="items-center space-x-2 py-2">
                        <Label className="my-auto">Show Filters?</Label>
                        <Switch
                            className="my-auto" 
                            checked={showFilters} 
                            onCheckedChange={(changed) => setShowFilters(changed)} 
                        />
                    </div>
                    <div className="my-auto mx-2">
                        <button className='p-1 mx-2 rounded-lg outline outline-white hover:bg-white hover:text-black'
                            onClick={() => setFilters(defaultFilters)}
                        >Reset Filters</button>
                    </div>
                </div>
                {showFilters && <div>
                    <div className="flex space-x-4">
                        <div className="items-center space-x-2 py-2">
                            <Label>Running?</Label>
                            <RadioGroup value={String(filters.running)} defaultValue="compact" onValueChange={(value) => setFilters({...filters, running: getBoolFromString(value)})}>
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
                        <div className="items-center space-x-2 py-2">
                            <Label>Limited Series?</Label>
                            <RadioGroup value={String(filters.limitedSeries)} defaultValue="compact" onValueChange={(value) => setFilters({...filters, limitedSeries: getBoolFromString(value)})}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="undefined" id="l1" />
                                    <Label htmlFor="l1">Not Applied</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id="l2" />
                                    <Label htmlFor="l2">Yes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" id="l3" />
                                    <Label htmlFor="l3">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="items-center space-x-2 py-2">
                            <Label>Currently Airing?</Label>
                            <RadioGroup value={String(filters.currentlyAiring)} defaultValue="compact" onValueChange={(value) => setFilters({...filters, currentlyAiring: getBoolFromString(value)})}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="undefined" id="c1" />
                                    <Label htmlFor="c1">Not Applied</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id="c2" />
                                    <Label htmlFor="c2">Yes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" id="c3" />
                                    <Label htmlFor="c3">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                    <div>
                        {services && <ServicesRow />}
                    </div>
                    <div>
                        <LengthRow />
                    </div>
                    <div>
                        <AirdatesRow />
                    </div>
                </div>}
            </div>
        </div>
    );

};