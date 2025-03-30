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
import { useRouter } from "next/navigation";
import { use, useOptimistic, useTransition } from "react";

type ShowSearchFilterButtonProps = {
    filters: ShowSearchFiltersType;
    pathname: string;
    getServicesFunction: Promise<Service[] | null>;
}

export default function ShowSearchFilterButtonSkeleton() {
    return (
        <Button variant="outline" className={`${backdropBackground} outline-white hover:bg-white hover:text-black`}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
        </Button>
    );
}