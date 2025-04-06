'use client'
import { backdropBackground } from "@/app/utils/stylingConstants";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export default function ShowSearchFilterButtonSkeleton() {
    return (
        <Button variant="outline" className={`${backdropBackground} outline-white hover:bg-white hover:text-black`}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
        </Button>
    );
}