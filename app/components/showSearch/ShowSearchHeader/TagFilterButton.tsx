'use client'
import { ShowTag } from "@/app/models/showTag";
import { TagCategory, getTagCategoryIcon } from "@/app/models/tagCategory";
import { backdropBackground } from "@/app/utils/stylingConstants";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tag, Loader2, X, ChevronDown, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition, useState } from "react";
import { ShowSearchFiltersType } from "./ShowSearchHeader";

type TagFilterButtonProps = {
    filters: ShowSearchFiltersType;
    pathname: string;
    tags: ShowTag[] | null;
    tagCategories: TagCategory[] | null;
}

export default function TagFilterButton({ 
    filters, 
    pathname: _pathname, 
    tags,
    tagCategories
}: TagFilterButtonProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
    
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

    const toggleCategory = (categoryId: number) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    const getUnselectedTags = () => {
        if (!tags) return [];
        return tags.filter(tag => 
            !optimisticFilters.tags.some(selectedTag => selectedTag.id === tag.id)
        );
    };

    const TagsContent = () => {
        if (!tags || tags.length === 0) {
            return <div className="text-sm text-gray-400">No tags available</div>;
        }

        if (!tagCategories || tagCategories.length === 0) {
            return <div className="text-sm text-gray-400">No tag categories available</div>;
        }

        const unselectedTags = getUnselectedTags();

        return (
            <div className="space-y-6">
                {/* Header with Tag icon */}
                <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">Tags</h3>
                </div>

                {/* Selected tags (horizontal scroll) */}
                {optimisticFilters.tags.length > 0 && (
                    <div className="space-y-2">
                        <ScrollArea className="w-full">
                            <div className="flex flex-wrap gap-2 pb-2">
                                {optimisticFilters.tags.map((tag) => (
                                    <Button
                                        key={tag.id}
                                        variant="outline"
                                        size="sm"
                                        className="bg-primary/10 hover:bg-white hover:text-black text-foreground border-border whitespace-nowrap"
                                        onClick={() => handleRemoveTag(tag)}
                                        disabled={isPending}
                                    >
                                        {tag.name}
                                        <X className="ml-1 h-3 w-3" />
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                )}

                {/* Available tags grouped by category */}
                {unselectedTags.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-sm text-gray-400">Add tags:</h4>
                        
                        {tagCategories.map((category) => {
                            const categoryTags = unselectedTags.filter(tag => tag.category.id === category.id);
                            if (categoryTags.length === 0) return null;

                            const isExpanded = expandedCategories.has(category.id);

                            return (
                                <Collapsible key={category.id} open={isExpanded} onOpenChange={() => toggleCategory(category.id)}>
                                    <CollapsibleTrigger
                                        className="flex items-center justify-between w-full p-3 text-left hover:bg-white/5 rounded-md"
                                    >
                                        <div className="flex items-center gap-2">
                                            {(() => {
                                                const Icon = getTagCategoryIcon(category.name);
                                                return <Icon className="h-4 w-4" />;
                                            })()}
                                            <span className="font-medium text-sm">{category.name}</span>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="pt-2">
                                        <ScrollArea className="w-full">
                                            <div className="flex flex-wrap gap-2 pb-2 px-4">
                                                {categoryTags.map((tag) => (
                                                    <Button
                                                        key={tag.id}
                                                        variant="outline"
                                                        size="sm"
                                                        className="bg-primary/10 hover:bg-white hover:text-black text-foreground border-border whitespace-nowrap"
                                                        onClick={() => handleAddTag(tag)}
                                                        disabled={isPending}
                                                    >
                                                        {tag.name}
                                                    </Button>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </CollapsibleContent>
                                </Collapsible>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    // Show loading if tags are loading
    if (!tags || !tagCategories) {
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
                        Select tags to filter shows. Tags are organized by category.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-full py-4">
                    <div className="pb-4">
                        <TagsContent />
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
} 