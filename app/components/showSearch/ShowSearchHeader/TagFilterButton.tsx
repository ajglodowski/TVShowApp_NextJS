'use client'
import { ShowTag } from "@/app/models/showTag";
import { backdropBackground } from "@/app/utils/stylingConstants";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tag, Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { ShowSearchFiltersType } from "./ShowSearchHeader";

type TagFilterButtonProps = {
    filters: ShowSearchFiltersType;
    pathname: string;
    tags: ShowTag[] | null;
}

export default function TagFilterButton({ 
    filters, 
    pathname, 
    tags 
}: TagFilterButtonProps) {
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
        // Remove tags param before adding new ones to avoid duplication
        params.delete('tags');
        params.delete('page'); // Reset pagination when changing filters
        
        // Only add tags parameter if there are selected tags
        if (updatedFilters.tags.length > 0) {
            params.set('tags', updatedFilters.tags.map(t => t.id).join(','));
        }
        
        const basePathname = currentPathname || '/';
        const queryString = params.toString();
        return basePathname + (queryString ? `?${queryString}` : '');
    };
    
    const handleAddTag = (tag: ShowTag) => {
        const newTags = [...optimisticFilters.tags, tag];
        const updatedFilters = { ...optimisticFilters, tags: newTags };
        startTransition(() => {
            updateOptimisticFilters({ tags: newTags });
            router.push(createFilterUrl(updatedFilters), { scroll: false });
        });
    };

    const handleRemoveTag = (tag: ShowTag) => {
        const newTags = optimisticFilters.tags.filter(t => t.id !== tag.id);
        const updatedFilters = { ...optimisticFilters, tags: newTags };
        startTransition(() => {
            updateOptimisticFilters({ tags: newTags });
            router.push(createFilterUrl(updatedFilters), { scroll: false });
        });
    };
    
    const selectedBubbleStyle = 'rounded-full py-1 px-2 mx-2 my-auto outline outline-1 outline-white hover:bg-white hover:text-black bg-white text-black text-center cursor-pointer';
    const unselectedBubbleStyle = 'rounded-full py-1 px-2 mx-2 my-auto outline outline-1 outline-white hover:bg-white hover:text-black text-white text-center cursor-pointer';

    const TagButtons = () => {
        if (!tags || tags.length === 0) return <div className="text-sm text-gray-400">No tags available</div>;
        
        // Get tags that aren't currently selected
        const unselectedTags = tags.filter(tag => 
            !optimisticFilters.tags.some(selectedTag => selectedTag.id === tag.id)
        );
        
        return (
            <div className="grid grid-cols-2 gap-2">
                {/* Selected tags */}
                {optimisticFilters.tags.map((tag) => (
                    <div key={tag.id}>
                        <div 
                            className={selectedBubbleStyle}
                            onClick={() => handleRemoveTag(tag)}
                            style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                        >
                            {tag.name}
                        </div>
                    </div>
                ))}
                
                {/* Unselected tags */}
                {unselectedTags.map((tag) => (
                    <div key={tag.id}>
                        <div 
                            className={unselectedBubbleStyle}
                            onClick={() => handleAddTag(tag)}
                            style={{ pointerEvents: isPending ? 'none' : 'auto' }}
                        >
                            {tag.name}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Show loading if tags are loading
    if (!tags) {
        return (
            <Button
                className="bg-transparent text-zinc-200 hover:bg-opacity-10 hover:bg-white hover:text-zinc-50"
                type="button"
                disabled
            >
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Loading Tags...</span>
            </Button>
        );
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className={`${backdropBackground} text-white relative ${optimisticFilters.tags.length > 0 ? 'border-zinc-600' : ''}`}
                    type="button"
                    disabled={isPending}
                >
                    <Tag className="h-4 w-4 mr-2" />
                    <span>Tags</span>
                    {isPending && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                    {optimisticFilters.tags.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {optimisticFilters.tags.length}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent
                className={`${backdropBackground} text-white border-zinc-800 ${isPending ? 'opacity-75' : ''}`}
                side="right"
            >
                <SheetHeader>
                    <SheetTitle className="text-white">Filter by Tags</SheetTitle>
                    <SheetDescription className="text-zinc-400">
                        Select tags to filter shows.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-full py-4">
                    <div className="pb-4 space-y-4">
                        <div className="flex flex-col">
                            <div className="py-2">
                                <Label className="font-medium text-sm">Tags</Label>
                                <div className="mt-2">
                                    <TagButtons />
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
} 