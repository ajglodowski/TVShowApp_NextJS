'use client'
import { AirDate } from "@/app/models/airDate";
import { Service } from "@/app/models/service";
import { ShowLength } from "@/app/models/showLength";
import { backdropBackground } from "@/app/utils/stylingConstants";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter, Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { ShowSearchFiltersType } from "./ShowSearchHeader";

type ShowSearchFilterButtonProps = {
    filters: ShowSearchFiltersType;
    pathname: string;
    services: Service[] | null;
}

export default function ShowSearchFilterButton({ 
    filters, 
    pathname, 
    services 
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
    
    const createFilterUrl = (updatedFilters: ShowSearchFiltersType) => {
        const params = new URLSearchParams(searchParams?.toString() || "");
        params.delete('service');
        params.delete('length');
        params.delete('airDate');
        params.delete('running');
        params.delete('limitedSeries');
        params.delete('currentlyAiring');
        params.delete('page');
        
        if (updatedFilters.service.length > 0) params.set('service', updatedFilters.service.map(s => s.id).join(','));
        if (updatedFilters.length.length > 0) params.set('length', updatedFilters.length.join(','));
        if (updatedFilters.airDate.length > 0) params.set('airDate', updatedFilters.airDate.join(','));
        if (updatedFilters.limitedSeries !== null) params.set('limitedSeries', updatedFilters.limitedSeries.toString());
        if (updatedFilters.running !== null) params.set('running', updatedFilters.running.toString());
        if (updatedFilters.currentlyAiring !== null) params.set('currentlyAiring', updatedFilters.currentlyAiring.toString());
        
        const basePathname = currentPathname || '/';
        const queryString = params.toString();
        return basePathname + (queryString ? `?${queryString}` : '');
    };
    
    const handleAddService = (service: Service) => {
        const newServices = [...optimisticFilters.service, service];
        const updatedFilters = { ...optimisticFilters, service: newServices };
        startTransition(() => {
            updateOptimisticFilters({ service: newServices });
            router.push(createFilterUrl(updatedFilters), { scroll: false });
        });
    };

    const handleAddLength = (length: ShowLength) => {
        const newLengths = [...optimisticFilters.length, length];
        const updatedFilters = { ...optimisticFilters, length: newLengths };
        startTransition(() => {
            updateOptimisticFilters({ length: newLengths });
            router.push(createFilterUrl(updatedFilters), { scroll: false });
        });
    };

    const handleAddAirDate = (airDate: AirDate) => {
        const newAirDates = [...optimisticFilters.airDate, airDate];
        const updatedFilters = { ...optimisticFilters, airDate: newAirDates };
        startTransition(() => {
            updateOptimisticFilters({ airDate: newAirDates });
            router.push(createFilterUrl(updatedFilters), { scroll: false });
        });
    };

    const handleRemoveService = (service: Service) => {
        const newServices = optimisticFilters.service.filter(s => s.id !== service.id);
        const updatedFilters = { ...optimisticFilters, service: newServices };
        startTransition(() => {
            updateOptimisticFilters({ service: newServices });
            router.push(createFilterUrl(updatedFilters), { scroll: false });
        });
    };

    const handleRemoveLength = (length: ShowLength) => {
        const newLengths = optimisticFilters.length.filter(l => l !== length);
        const updatedFilters = { ...optimisticFilters, length: newLengths };
        startTransition(() => {
            updateOptimisticFilters({ length: newLengths });
            router.push(createFilterUrl(updatedFilters), { scroll: false });
        });
    };

    const handleRemoveAirDate = (airDate: AirDate) => {
        const newAirDates = optimisticFilters.airDate.filter(a => a !== airDate);
        const updatedFilters = { ...optimisticFilters, airDate: newAirDates };
        startTransition(() => {
            updateOptimisticFilters({ airDate: newAirDates });
            router.push(createFilterUrl(updatedFilters), { scroll: false });
        });
    };

    const handleSetFilter = (key: 'running' | 'limitedSeries' | 'currentlyAiring', value: boolean | null) => {
        const updatedFilters = { ...optimisticFilters, [key]: value };
        startTransition(() => {
            updateOptimisticFilters({ [key]: value });
            router.push(createFilterUrl(updatedFilters), { scroll: false });
        });
    };
    
    const selectedBubbleStyle = 'rounded-full py-1 px-2 mx-2 my-auto outline outline-1 outline-white hover:bg-white hover:text-black bg-white text-black text-center cursor-pointer'
    const unselectedBubbleStyle = 'rounded-full py-1 px-2 mx-2 my-auto outline outline-1 outline-white hover:bg-white hover:text-black text-white text-center cursor-pointer'

    const ServiceButtons = () => {
        if (!services) return (<></>);
        const unselectedServices = services?.filter((service) => !optimisticFilters.service.map(s => s.id).includes(service.id));
        return (
            <div className="grid grid-cols-2 gap-2">
                {optimisticFilters.service.map((service) => (
                    <div key={service.id}>
                        <div 
                            className={selectedBubbleStyle}
                            onClick={() => handleRemoveService(service)}
                            style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                        >
                            {service.name}
                        </div>
                    </div>
                ))}
                {unselectedServices?.map((service) => (
                    <div key={service.id}>
                        <div 
                            className={unselectedBubbleStyle}
                            onClick={() => handleAddService(service)}
                            style={{ pointerEvents: isPending ? 'none' : 'auto' }}
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
                        style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                    >
                        {airdate}
                    </div>
                ))}
                {unselectedAirdates?.map((airdate) => (
                    <div
                        key={airdate}
                        className={unselectedBubbleStyle}
                        onClick={() => handleAddAirDate(airdate)}
                        style={{ pointerEvents: isPending ? 'none' : 'auto' }}
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
                        style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                    >
                        {length}{length === ShowLength.NONE ? '' : 'm'}
                    </div>
                ))}
                {unselectLengths?.map((length) => (
                    <div
                        key={length}
                        className={unselectedBubbleStyle}
                        onClick={() => handleAddLength(length)}
                        style={{ pointerEvents: isPending ? 'none' : 'auto' }}
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
            <div className="pb-4 space-y-4">
                <div className="flex flex-col">
                    <div className="py-2">
                        <Label className="font-medium text-sm">Running?</Label>
                        <div className="flex flex-col gap-2 mt-2">
                            <div 
                                onClick={() => handleSetFilter('running', null)}
                                className={optimisticFilters.running === null ? selectedBubbleStyle : unselectedBubbleStyle}
                                style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                            >
                                Not Applied
                            </div>
                            <div 
                                onClick={() => handleSetFilter('running', true)}
                                className={optimisticFilters.running === true ? selectedBubbleStyle : unselectedBubbleStyle}
                                style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                            >
                                Yes
                            </div>
                            <div 
                                onClick={() => handleSetFilter('running', false)}
                                className={optimisticFilters.running === false ? selectedBubbleStyle : unselectedBubbleStyle}
                                style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                            >
                                No
                            </div>
                        </div>
                    </div>
                    <div className="py-2">
                        <Label className="font-medium text-sm">Limited Series?</Label>
                        <div className="flex flex-col gap-2 mt-2">
                            <div 
                                onClick={() => handleSetFilter('limitedSeries', null)}
                                className={optimisticFilters.limitedSeries === null ? selectedBubbleStyle : unselectedBubbleStyle}
                                style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                            >
                                Not Applied
                            </div>
                            <div 
                                onClick={() => handleSetFilter('limitedSeries', true)}
                                className={optimisticFilters.limitedSeries === true ? selectedBubbleStyle : unselectedBubbleStyle}
                                style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                            >
                                Yes
                            </div>
                            <div 
                                onClick={() => handleSetFilter('limitedSeries', false)}
                                className={optimisticFilters.limitedSeries === false ? selectedBubbleStyle : unselectedBubbleStyle}
                                style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                            >
                                No
                            </div>
                        </div>
                    </div>
                    <div className="py-2">
                        <Label className="font-medium text-sm">Currently Airing?</Label>
                        <div className="flex flex-col gap-2 mt-2">
                            <div 
                                onClick={() => handleSetFilter('currentlyAiring', null)}
                                className={optimisticFilters.currentlyAiring === null ? selectedBubbleStyle : unselectedBubbleStyle}
                                style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                            >
                                Not Applied
                            </div>
                            <div 
                                onClick={() => handleSetFilter('currentlyAiring', true)}
                                className={optimisticFilters.currentlyAiring === true ? selectedBubbleStyle : unselectedBubbleStyle}
                                style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                            >
                                Yes
                            </div>
                            <div 
                                onClick={() => handleSetFilter('currentlyAiring', false)}
                                className={optimisticFilters.currentlyAiring === false ? selectedBubbleStyle : unselectedBubbleStyle}
                                style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                            >
                                No
                            </div>
                        </div>
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

    const badgeCount = [
        filters.service.length,
        filters.length.length,
        filters.airDate.length,
        filters.limitedSeries !== null ? 1 : 0,
        filters.running !== null ? 1 : 0,
        filters.currentlyAiring !== null ? 1 : 0,
        // Exclude tags from the count - they're handled by the TagFilterButton
    ].reduce((acc, count) => acc + count, 0);


    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className={`${backdropBackground} text-white relative`} disabled={isPending}>
                    <Filter className="h-4 w-4 mr-2" />
                    <span>Filters</span>
                    {isPending && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                    {badgeCount > 0 && (
                         <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {badgeCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className={`overflow-y-auto bg-black border-l border-l-white/20 ${isPending ? 'opacity-75' : ''}`}>
                <SheetHeader>
                    <SheetTitle className="text-white">Show Filters</SheetTitle>
                    <SheetDescription>
                        Refine the results based on show characteristics.
                    </SheetDescription>
                </SheetHeader>
                
                <ScrollArea className="h-[calc(100vh-150px)] pr-4">
                    <FilterRows />
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}