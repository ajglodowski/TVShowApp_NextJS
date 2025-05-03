'use client'
import { backdropBackground } from "@/app/utils/stylingConstants";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";

export default function ShowSearchTagsButtonSkeleton() {
    return (
        <Button variant="outline" className={`${backdropBackground} outline-white hover:bg-white hover:text-black`}>
            <Tag className="h-4 w-4 mr-2" />
            Tags
        </Button>
    );
}