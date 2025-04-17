import { Button } from "@/components/ui/button";
import { ArrowDownWideNarrow, ArrowDownAZ, ArrowUpAZ, Star, TrendingUp, ArrowDownZA, ArrowUpZA, Calendar, Clock, Heart, ThumbsDown, ThumbsUp } from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { backdropBackground } from "@/app/utils/stylingConstants";

export type SortDirection = "asc" | "desc";
export type SortField = "alphabetical" | "weekly_popularity" | "monthly_popularity" | "yearly_popularity" | "rating" | "avg_rating";
export type SortOption = `${SortField}-${SortDirection}`;

type SortButtonProps = {
    currentSort?: SortOption | undefined;
    pathname: string;
    currentFilters: Record<string, any>;
}

export default function SortButton({ currentSort, pathname, currentFilters }: SortButtonProps) {
    const createSortUrl = (sortOption: SortOption | undefined) => {
        const params = new URLSearchParams();
        
        // Add all current filter params except page and sortBy
        Object.entries(currentFilters).forEach(([key, value]) => {
            if (key !== 'sortBy' && key !== 'page' && value !== undefined) {
                // Handle arrays (like service, length, airDate)
                if (Array.isArray(value) && value.length > 0) {
                    if (key === 'service') {
                        params.set(key, value.map((s: any) => s.id).join(','));
                    } else {
                        params.set(key, value.join(','));
                    }
                }
                // Handle booleans
                else if (typeof value === 'boolean') {
                    params.set(key, value.toString());
                }
            }
        });
        
        // Add the sort option if it's defined
        if (sortOption) {
            params.set('sortBy', sortOption);
        }
        
        return `${pathname}?${params.toString()}`;
    };
    
    // Extract the sort field and direction from the current sort option
    const currentSortField = currentSort?.split('-')[0] as SortField | undefined;
    const currentSortDirection = currentSort?.split('-')[1] as SortDirection | undefined;
    
    // Format display text
    const getDisplayText = () => {
        if (!currentSort) return "Alphabetical (A-Z)";
        
        const field = currentSortField || "alphabetical";
        const direction = currentSortDirection || "asc";
        
        switch(field) {
            case "alphabetical":
                return `Alphabetical (${direction === "asc" ? "A-Z" : "Z-A"})`;
            case "weekly_popularity":
                return "Popularity (Weekly)";
            case "monthly_popularity":
                return "Popularity (Monthly)";
            case "yearly_popularity":
                return "Popularity (Yearly)";
            case "rating":
                return `Your Rating (${direction === "asc" ? "Low-High" : "High-Low"})`;
            case "avg_rating":
                return `Average Rating (${direction === "asc" ? "Low-High" : "High-Low"})`;
            default:
                return "Alphabetical (A-Z)";
        }
    };
    
    // Get icon based on current sort
    const getIcon = () => {
        if (!currentSort) return <ArrowDownAZ className="h-4 w-4 mr-2" />;
        
        const field = currentSortField || "alphabetical";
        const direction = currentSortDirection || "asc";
        
        switch(field) {
            case "alphabetical":
                return direction === "asc" 
                    ? <ArrowDownAZ className="h-4 w-4 mr-2" /> 
                    : <ArrowUpAZ className="h-4 w-4 mr-2" />;
            case "weekly_popularity":
                return <Clock className="h-4 w-4 mr-2" />;
            case "monthly_popularity":
                return <Calendar className="h-4 w-4 mr-2" />;
            case "yearly_popularity":
                return <TrendingUp className="h-4 w-4 mr-2" />;
            case "rating":
                return direction === "asc" 
                    ? <ThumbsDown className="h-4 w-4 mr-2" /> 
                    : <ThumbsUp className="h-4 w-4 mr-2" />;
            case "avg_rating":
                return direction === "asc" 
                    ? <ThumbsDown className="h-4 w-4 mr-2" /> 
                    : <Heart className="h-4 w-4 mr-2 text-red-500" />;
            default:
                return <ArrowDownAZ className="h-4 w-4 mr-2" />;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="outline" 
                    className={`${backdropBackground} text-white`}
                >
                    {getIcon()}
                    <span>{getDisplayText()}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black border border-white/20">
                <DropdownMenuItem className="focus:bg-white/10 focus:text-white text-white">
                    <Link href={createSortUrl("alphabetical-asc")} className="w-full flex items-center">
                        <ArrowDownAZ className="h-4 w-4 mr-2" />
                        <span className="capitalize font-medium">Alphabetical (A-Z)</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-white/10 focus:text-white text-white">
                    <Link href={createSortUrl("alphabetical-desc")} className="w-full flex items-center">
                        <ArrowUpAZ className="h-4 w-4 mr-2" />
                        <span className="capitalize font-medium">Alphabetical (Z-A)</span>
                    </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-white/20" />
                
                <DropdownMenuItem className="focus:bg-white/10 focus:text-white text-white">
                    <Link href={createSortUrl("weekly_popularity-desc")} className="w-full flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="capitalize font-medium">Popularity (Weekly)</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-white/10 focus:text-white text-white">
                    <Link href={createSortUrl("monthly_popularity-desc")} className="w-full flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="capitalize font-medium">Popularity (Monthly)</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-white/10 focus:text-white text-white">
                    <Link href={createSortUrl("yearly_popularity-desc")} className="w-full flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        <span className="capitalize font-medium">Popularity (Yearly)</span>
                    </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-white/20" />
                
                <DropdownMenuItem className="focus:bg-white/10 focus:text-white text-white">
                    <Link href={createSortUrl("rating-desc")} className="w-full flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        <span className="capitalize font-medium">Rating (High-Low)</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-white/10 focus:text-white text-white">
                    <Link href={createSortUrl("rating-asc")} className="w-full flex items-center">
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        <span className="capitalize font-medium">Rating (Low-High)</span>
                    </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-white/20" />
                
                <DropdownMenuItem className="focus:bg-white/10 focus:text-white text-white">
                    <Link href={createSortUrl("avg_rating-desc")} className="w-full flex items-center">
                        <Heart className="h-4 w-4 mr-2 text-red-500" />
                        <span className="capitalize font-medium">Average Rating (High-Low)</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-white/10 focus:text-white text-white">
                    <Link href={createSortUrl("avg_rating-asc")} className="w-full flex items-center">
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        <span className="capitalize font-medium">Average Rating (Low-High)</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 