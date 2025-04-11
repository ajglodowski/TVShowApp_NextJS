'use client'
import { AirDate } from "@/app/models/airDate";
import { Service } from "@/app/models/service";
import { ShowLength } from "@/app/models/showLength";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ShowSearchFiltersType } from "./ShowSearchHeader";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { backdropBackground } from "@/app/utils/stylingConstants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { use, useOptimistic, useTransition } from "react";

type ShowSearchFilterButtonProps = {
    filters: ShowSearchFiltersType;
    pathname: string;
    getServicesFunction: Promise<Service[] | null>;
}

export default function ShowSearchFilterButton({ 
    filters, 
    pathname, 
    getServicesFunction
}: ShowSearchFilterButtonProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const [optimisticFilters, updateOptimisticFilters] = useOptimistic(
        filters,
        (state, update: Partial<ShowSearchFiltersType>) => ({
            ...state,
            ...update
        })
    );

    // Helper function to safely update URL
    const updateURL = (updatedFilters: ShowSearchFiltersType) => {
        // Create a URLSearchParams object to build the query string
        const params = new URLSearchParams(searchParams?.toString() || "");
        
        // Remove show filter parameters we're going to update
        params.delete('service');
        params.delete('length');
        params.delete('airDate');
        params.delete('running');
        params.delete('limitedSeries');
        params.delete('currentlyAiring');
        
        // Add or update filter params
        if (updatedFilters.service.length > 0) {
            params.set('service', updatedFilters.service.map(s => s.id).join(','));
        }
        
        if (updatedFilters.length.length > 0) {
            params.set('length', updatedFilters.length.join(','));
        }
        
        if (updatedFilters.airDate.length > 0) {
            params.set('airDate', updatedFilters.airDate.join(','));
        }
        
        if (updatedFilters.limitedSeries !== undefined) {
            params.set('limitedSeries', updatedFilters.limitedSeries.toString());
        }
        
        if (updatedFilters.running !== undefined) {
            params.set('running', updatedFilters.running.toString());
        }
        
        if (updatedFilters.currentlyAiring !== undefined) {
            params.set('currentlyAiring', updatedFilters.currentlyAiring.toString());
        }
        
        // Build the new URL
        const basePathname = currentPathname || '/';
        const queryString = params.toString();
        return basePathname + (queryString ? `?${queryString}` : '');
    };

    const handleAddService = (service: Service) => {
        const newServices = [...optimisticFilters.service, service];
        const updatedFilters = { ...optimisticFilters, service: newServices };
        startTransition(() => {
            updateOptimisticFilters({ service: newServices });
            router.replace(updateURL(updatedFilters));
        });
    };

    const handleAddLength = (length: ShowLength) => {
        const newLengths = [...optimisticFilters.length, length];
        const updatedFilters = { ...optimisticFilters, length: newLengths };
        startTransition(() => {
            updateOptimisticFilters({ length: newLengths });
            router.replace(updateURL(updatedFilters));
        });
    };

    const handleAddAirDate = (airDate: AirDate) => {
        const newAirDates = [...optimisticFilters.airDate, airDate];
        const updatedFilters = { ...optimisticFilters, airDate: newAirDates };
        startTransition(() => {
            updateOptimisticFilters({ airDate: newAirDates });
            router.replace(updateURL(updatedFilters));
        });
    };

    const handleRemoveService = (service: Service) => {
        const newServices = optimisticFilters.service.filter(s => s.id !== service.id);
        const updatedFilters = { ...optimisticFilters, service: newServices };
        startTransition(() => {
            updateOptimisticFilters({ service: newServices });
            router.replace(updateURL(updatedFilters));
        });
    };

    const handleRemoveLength = (length: ShowLength) => {
        const newLengths = optimisticFilters.length.filter(l => l !== length);
        const updatedFilters = { ...optimisticFilters, length: newLengths };
        startTransition(() => {
            updateOptimisticFilters({ length: newLengths });
            router.replace(updateURL(updatedFilters));
        });
    };

    const handleRemoveAirDate = (airDate: AirDate) => {
        const newAirDates = optimisticFilters.airDate.filter(a => a !== airDate);
        const updatedFilters = { ...optimisticFilters, airDate: newAirDates };
        startTransition(() => {
            updateOptimisticFilters({ airDate: newAirDates });
            router.replace(updateURL(updatedFilters));
        });
    };

    const handleSetFilter = (key: 'running' | 'limitedSeries' | 'currentlyAiring', value: boolean | undefined) => {
        const updatedFilters = { ...optimisticFilters, [key]: value };
        startTransition(() => {
            updateOptimisticFilters({ [key]: value });
            router.replace(updateURL(updatedFilters));
        });
    };

    const services = use(getServicesFunction);

    const selectedBubbleStyle = 'rounded-full py-1 px-2 mx-2 outline outline-1 outline-white hover:bg-white hover:text-black bg-white text-black text-center cursor-pointer'
    const unselectedBubbleStyle = 'rounded-full py-1 px-2 mx-2 outline outline-1 outline-white hover:bg-white hover:text-black text-white text-center cursor-pointer'

    const ServiceButtons = () => {
        if (!services) return (<></>);
        const unselectedStatuses = services?.filter((service) => !optimisticFilters.service.map(s => s.id).includes(service.id));
        return (
            <div className="grid grid-cols-2 gap-2">
                {optimisticFilters.service.map((service) => (
                    <div key={service.id}>
                        <div 
                            className={selectedBubbleStyle}
                            onClick={() => handleRemoveService(service)}
                        >
                            {service.name}
                        </div>
                    </div>
                ))}
                {unselectedStatuses?.map((service) => (
                    <div key={service.id}>
                        <div 
                            className={unselectedBubbleStyle}
                            onClick={() => handleAddService(service)}
                        >
                            {service.name}
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const ServicesRow = () => {
        return (
            <div className="">
                <Label className="font-medium text-sm">Services</Label>
                <ServiceButtons />
            </div>
        );
    }

    const AirdateButtons = () => {
        const airdates = Object.values(AirDate);
        const unselectedAirdates = airdates?.filter((airdate) => !optimisticFilters.airDate.includes(airdate));
        return (
            <div className="grid grid-cols-2 gap-2">
                {optimisticFilters.airDate.map((airdate) => (
                    <div
                        key={airdate}
                        className={selectedBubbleStyle}
                        onClick={() => handleRemoveAirDate(airdate)}
                    >
                        {airdate}
                    </div>
                ))}
                {unselectedAirdates?.map((airdate) => (
                    <div
                        key={airdate}
                        className={unselectedBubbleStyle}
                        onClick={() => handleAddAirDate(airdate)}
                    >
                        {airdate}
                    </div>
                ))}
            </div>
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
        const unselectLengths = lengths?.filter((length) => !optimisticFilters.length.includes(length));
        return (
            <div className="grid grid-cols-2 gap-2">
                {optimisticFilters.length.map((length) => (
                    <div
                        key={length}
                        className={selectedBubbleStyle}
                        onClick={() => handleRemoveLength(length)}
                    >
                        {length}{length === ShowLength.NONE ? '' : 'm'}
                    </div>
                ))}
                {unselectLengths?.map((length) => (
                    <div
                        key={length}
                        className={unselectedBubbleStyle}
                        onClick={() => handleAddLength(length)}
                    >
                        {length}{length === ShowLength.NONE ? '' : 'm'}
                    </div>
                ))}
            </div>
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

    const FilterRows = () => {
        return (
            <div>
                <div className="flex space-x-4">
                    <div className="items-center space-x-2 py-2">
                        <Label>Running?</Label>
                        <RadioGroup 
                            value={optimisticFilters.running === undefined ? "undefined" : String(optimisticFilters.running)} 
                            defaultValue="compact"
                            onValueChange={(value) => {
                                const boolValue = value === "undefined" ? undefined : value === "true";
                                handleSetFilter('running', boolValue);
                            }}
                        >
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
                        <RadioGroup 
                            value={optimisticFilters.limitedSeries === undefined ? "undefined" : String(optimisticFilters.limitedSeries)} 
                            defaultValue="compact"
                            onValueChange={(value) => {
                                const boolValue = value === "undefined" ? undefined : value === "true";
                                handleSetFilter('limitedSeries', boolValue);
                            }}
                        >
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
                        <RadioGroup 
                            value={optimisticFilters.currentlyAiring === undefined ? "undefined" : String(optimisticFilters.currentlyAiring)} 
                            defaultValue="compact"
                            onValueChange={(value) => {
                                const boolValue = value === "undefined" ? undefined : value === "true";
                                handleSetFilter('currentlyAiring', boolValue);
                            }}
                        >
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
            </div>
        );
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className={`${backdropBackground} outline-white hover:bg-white hover:text-black`}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                </Button>
            </SheetTrigger>

            <SheetContent className={`${backdropBackground} h-full pb-32`}>
                <SheetHeader className="my-1">
                    <SheetTitle className="text-white">
                        <span className="flex justify-between my-auto items-center">
                            Filter Shows
                            <div className="my-auto mx-2">
                                <Button 
                                    onClick={() => {
                                        startTransition(() => {
                                            updateOptimisticFilters({
                                                service: [],
                                                length: [],
                                                airDate: [],
                                                running: undefined,
                                                limitedSeries: undefined,
                                                currentlyAiring: undefined
                                            });
                                            
                                            // Create a URLSearchParams object to build the query string
                                            const params = new URLSearchParams(searchParams?.toString() || "");
                                            
                                            // Remove show filter parameters
                                            params.delete('service');
                                            params.delete('length');
                                            params.delete('airDate');
                                            params.delete('running');
                                            params.delete('limitedSeries');
                                            params.delete('currentlyAiring');
                                            
                                            // Build the new URL
                                            const basePathname = currentPathname || '/';
                                            const queryString = params.toString();
                                            router.replace(basePathname + (queryString ? `?${queryString}` : ''));
                                        });
                                    }}
                                    className={`${backdropBackground} me-2 outline outline-white hover:bg-white hover:text-black px-4 py-2 rounded-md`}
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        </span>
                    </SheetTitle>
                    <SheetDescription className="text-white/80">Apply filters to find shows that match your preferences.</SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-full">
                    <FilterRows />
                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}