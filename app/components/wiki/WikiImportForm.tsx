'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Service } from '@/app/models/service';
import { ShowTag } from '@/app/models/showTag';
import { TagCategory, getTagCategoryIcon } from '@/app/models/tagCategory';
import { WikidataDraft, createShowFromWikidataAction } from '@/app/(main)/newShow/import/actions';
import { Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { backdropBackground } from '@/app/utils/stylingConstants';

interface WikiImportFormProps {
    draft: WikidataDraft;
    allServices: Service[];
    allTags: ShowTag[];
    allTagCategories: TagCategory[] | null;
    initialServiceIds: number[];
    initialTagIds: number[];
}

export function WikiImportForm({ 
    draft, 
    allServices, 
    allTags, 
    allTagCategories,
    initialServiceIds, 
    initialTagIds 
}: WikiImportFormProps) {
    const [name, setName] = useState(draft.name);
    // Format date to YYYY-MM-DD for input[type=date]
    const defaultDate = draft.releaseDate ? new Date(draft.releaseDate).toISOString().split('T')[0] : '';
    const [releaseDate, setReleaseDate] = useState(defaultDate);
    const [totalSeasons, setTotalSeasons] = useState(draft.totalSeasons);
    const [running, setRunning] = useState(draft.running);
    
    const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>(initialServiceIds);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>(initialTagIds);
    
    // Initialize expanded categories with those that have selected tags
    const getInitialExpandedCategories = () => {
        const expanded = new Set<number>();
        if (allTagCategories && initialTagIds.length > 0) {
            allTagCategories.forEach(category => {
                const categoryHasSelectedTag = allTags.some(
                    tag => tag.category.id === category.id && initialTagIds.includes(tag.id)
                );
                if (categoryHasSelectedTag) {
                    expanded.add(category.id);
                }
            });
        }
        return expanded;
    };
    
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(getInitialExpandedCategories());
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleService = (id: number) => {
        setSelectedServiceIds(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const toggleTag = (id: number) => {
        const isCurrentlySelected = selectedTagIds.includes(id);
        
        setSelectedTagIds(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
        
        // If selecting a tag, expand its category
        if (!isCurrentlySelected) {
            const tag = allTags.find(t => t.id === id);
            if (tag) {
                setExpandedCategories(prev => {
                    const newSet = new Set(prev);
                    newSet.add(tag.category.id);
                    return newSet;
                });
            }
        }
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

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const result = await createShowFromWikidataAction({
                name,
                releaseDate: releaseDate || undefined,
                running,
                totalSeasons,
                serviceIds: selectedServiceIds,
                tagIds: selectedTagIds,
                externalRefs: draft.externalRefs
            });

            if (result && 'error' in result) {
                toast.error(result.error);
                setIsSubmitting(false);
            } else {
                toast.success('Show created successfully!');
                // Redirect happens in server action
            }
        } catch (error) {
            console.error(error);
            toast.error('An unexpected error occurred');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Core Info */}
                <Card className={`${backdropBackground} text-white border-white/20`}>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Show Name</Label>
                            <Input 
                                id="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                className={`${backdropBackground} text-white border-gray-700`}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="releaseDate">Release Date</Label>
                            <Input 
                                id="releaseDate" 
                                type="date"
                                value={releaseDate} 
                                onChange={(e) => setReleaseDate(e.target.value)}
                                className={`${backdropBackground} text-white border-gray-700`}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="seasons">Total Seasons</Label>
                            <Input 
                                id="seasons" 
                                type="number"
                                min={1}
                                value={totalSeasons} 
                                onChange={(e) => setTotalSeasons(parseInt(e.target.value) || 1)}
                                className={`${backdropBackground} text-white border-gray-700`}
                            />
                        </div>

                        <div className="flex items-center justify-between border border-gray-700 rounded-lg p-3">
                            <Label htmlFor="running">Still Running?</Label>
                            <Switch 
                                id="running" 
                                checked={running} 
                                onCheckedChange={setRunning} 
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Services */}
                <Card className={`${backdropBackground} text-white border-white/20`}>
                    <CardContent className="pt-6">
                        <Label className="mb-4 block">Services ({selectedServiceIds.length})</Label>
                        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 h-64 overflow-y-auto border border-gray-700 rounded-md p-2 ${backdropBackground}`}>
                            {allServices.map(service => (
                                <div key={service.id} className="flex items-center space-x-2">
                                    <Checkbox 
                                        id={`srv-${service.id}`} 
                                        checked={selectedServiceIds.includes(service.id)}
                                        onCheckedChange={() => toggleService(service.id)}
                                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                                    />
                                    <Label htmlFor={`srv-${service.id}`} className="cursor-pointer text-sm font-normal">
                                        {service.name}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tags */}
            <Card className={`${backdropBackground} text-white border-white/20`}>
                <CardContent className="pt-6">
                    <Label className="mb-4 block">Tags ({selectedTagIds.length})</Label>
                    <div className={`h-96 overflow-y-auto border border-gray-700 rounded-md p-4 ${backdropBackground}`}>
                        {allTagCategories && allTagCategories.length > 0 ? (
                            <div className="space-y-2">
                                {allTagCategories.map((category) => {
                                    const categoryTags = allTags.filter(tag => tag.category.id === category.id);
                                    if (categoryTags.length === 0) return null;

                                    const isExpanded = expandedCategories.has(category.id);

                                    return (
                                        <Collapsible key={category.id} open={isExpanded} onOpenChange={() => toggleCategory(category.id)}>
                                            <CollapsibleTrigger
                                                className="flex items-center justify-between w-full p-3 text-left hover:bg-white/10 rounded-md"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {(() => {
                                                        const Icon = getTagCategoryIcon(category.name);
                                                        return <Icon className="h-4 w-4" />;
                                                    })()}
                                                    <span className="font-medium text-sm">{category.name}</span>
                                                    <span className="text-xs text-gray-400">
                                                        ({categoryTags.filter(tag => selectedTagIds.includes(tag.id)).length}/{categoryTags.length})
                                                    </span>
                                                </div>
                                                {isExpanded ? (
                                                    <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4" />
                                                )}
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="pt-2">
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 px-4 pb-2">
                                                    {categoryTags.map(tag => (
                                                        <div key={tag.id} className="flex items-center space-x-2">
                                                            <Checkbox 
                                                                id={`tag-${tag.id}`} 
                                                                checked={selectedTagIds.includes(tag.id)}
                                                                onCheckedChange={() => toggleTag(tag.id)}
                                                                className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                                                            />
                                                            <Label htmlFor={`tag-${tag.id}`} className="cursor-pointer text-sm font-normal truncate">
                                                                {tag.name}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    );
                                })}
                            </div>
                        ) : (
                            // Fallback to non-categorized view if categories aren't available
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {allTags.map(tag => (
                                    <div key={tag.id} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`tag-${tag.id}`} 
                                            checked={selectedTagIds.includes(tag.id)}
                                            onCheckedChange={() => toggleTag(tag.id)}
                                            className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                                        />
                                        <Label htmlFor={`tag-${tag.id}`} className="cursor-pointer text-sm font-normal truncate">
                                            {tag.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button 
                    variant="ghost"
                    size="lg" 
                    onClick={handleSubmit} 
                    disabled={isSubmitting || !name}
                    className="hover:bg-green-300 text-xl"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        'Create Show'
                    )}
                </Button>
            </div>
        </div>
    );
}
