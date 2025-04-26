import { AirDate } from "@/app/models/airDate";
import { Rating } from "@/app/models/rating";
import { ShowLength } from "@/app/models/showLength";
import { ShowSearchProps } from "./ShowSearch";
import { CurrentUserFilters, defaultCurrentUserFilters } from "./ShowSearchHeader/ShowSearchCurrentUserFilters";
import { defaultFilters, ShowSearchFiltersType } from "./ShowSearchHeader/ShowSearchHeader";
import { SortOption } from "./ShowSearchHeader/SortButton";
import { getServices } from "./ShowSearchService";

export async function parseFiltersFromSearchParams(searchParams: ShowSearchProps['searchParams'] = {}): Promise<ShowSearchFiltersType> {
    const { service, length, airDate, limitedSeries, running, currentlyAiring, sortBy } = searchParams || {};
    const filters: ShowSearchFiltersType = {
        ...defaultFilters
    };

    // Parse services
    if (service) {
        const serviceIds = service.split(',').filter(Boolean); // Remove any empty strings
        if (serviceIds.length > 0) {
            const services = await getServices();
            if (services) {
                filters.service = services.filter(s => serviceIds.includes(s.id.toString()));
            }
        }
    }

    // Parse lengths
    if (length) {
        const lengths = length.split(',').filter(Boolean);
        if (lengths.length > 0) {
            filters.length = lengths.filter(l => Object.values(ShowLength).includes(l as ShowLength)) as ShowLength[];
        }
    }

    // Parse airDates
    if (airDate) {
        const airDates = airDate.split(',').filter(Boolean);
        if (airDates.length > 0) {
            filters.airDate = airDates.filter(a => Object.values(AirDate).includes(a as AirDate)) as AirDate[];
        }
    }

    // Parse boolean fields - handle "true"/"false" strings specifically
    if (limitedSeries === 'true') {
        filters.limitedSeries = true;
    } else if (limitedSeries === 'false') {
        filters.limitedSeries = false;
    }
    
    if (running === 'true') {
        filters.running = true;
    } else if (running === 'false') {
        filters.running = false;
    }
    
    if (currentlyAiring === 'true') {
        filters.currentlyAiring = true;
    } else if (currentlyAiring === 'false') {
        filters.currentlyAiring = false;
    }
    
    // Parse sortBy
    if (sortBy) {
        // Check if it matches our expected format (field-direction)
        const sortMatch = sortBy.match(/^(alphabetical|weekly_popularity|monthly_popularity|yearly_popularity|rating|avg_rating)-(asc|desc)$/);
        if (sortMatch) {
            filters.sortBy = sortBy as SortOption;
        } else if (["alphabetical", "weekly_popularity", "monthly_popularity", "yearly_popularity", "rating", "avg_rating"].includes(sortBy)) {
            // Handle legacy format for backward compatibility
            // Default to ascending for alphabetical, descending for others
            const direction = sortBy === "alphabetical" ? "asc" : "desc";
            filters.sortBy = `${sortBy}-${direction}` as SortOption;
        }
    }

    return filters;
}

export function parseCurrentUserFilters(searchParams: ShowSearchProps['searchParams'] = {}): CurrentUserFilters {
    // Type assertion to include potential statuses property
    const { addedToWatchlist, ratings, statuses } = searchParams as 
        ShowSearchProps['searchParams'] & { statuses?: string };
    const filters: CurrentUserFilters = {
        ...defaultCurrentUserFilters
    };

    // Parse addedToWatchlist
    if (addedToWatchlist) {
        filters.addedToWatchlist = addedToWatchlist === 'true';
    }

    // Parse ratings
    if (ratings) {
        const ratingStrings = ratings.split(',');
        const validRatings: Rating[] = [];
        
        for (const ratingStr of ratingStrings) {
            // Check if the string value matches any enum value
            const matchingRating = Object.values(Rating).find(r => r === ratingStr);
            if (matchingRating) {
                validRatings.push(matchingRating);
            }
        }
        
        filters.ratings = validRatings;
    }

    // Parse statuses
    if (statuses) {
        const statusIds = statuses.split(',');
        if (statusIds.length > 0) {
            // Ensure we're creating numeric IDs
            const validStatusIds = statusIds
                .map(id => parseInt(id))
                .filter(id => !isNaN(id));
            
            if (validStatusIds.length > 0) {
                // Create Status objects with just the ID field (other fields not used in filtering)
                filters.statuses = validStatusIds.map(id => ({ 
                    id,
                    created_at: new Date(), // Required fields by type but not used in comparison
                    update_at: new Date(),  // Required fields by type but not used in comparison
                    name: ""               // Required fields by type but not used in comparison
                }));
            }
        }
    }

    return filters;
}

export function parseWatchlistOwnerFilters(searchParams: ShowSearchProps['searchParams'] = {}): CurrentUserFilters {
    // Type assertion to include the expected properties
    const { ownerWatchlist, ownerRatings, ownerStatuses } = searchParams as 
        ShowSearchProps['searchParams'] & { 
            ownerWatchlist?: string;
            ownerRatings?: string;
            ownerStatuses?: string;
        };
    const filters: CurrentUserFilters = {
        ...defaultCurrentUserFilters
    };

    // Parse owner's watchlist filter
    if (ownerWatchlist) {
        filters.addedToWatchlist = ownerWatchlist === 'true';
    }

    // Parse owner's ratings
    if (ownerRatings) {
        const ratingStrings = ownerRatings.split(',');
        const validRatings: Rating[] = [];
        
        for (const ratingStr of ratingStrings) {
            // Check if the string value matches any enum value
            const matchingRating = Object.values(Rating).find(r => r === ratingStr);
            if (matchingRating) {
                validRatings.push(matchingRating);
            }
        }
        
        filters.ratings = validRatings;
    }

    // Parse owner's statuses if needed
    if (ownerStatuses) {
        const statusIds = ownerStatuses.split(',');
        if (statusIds.length > 0) {
            // Ensure we're creating numeric IDs
            const validStatusIds = statusIds
                .map(id => parseInt(id))
                .filter(id => !isNaN(id));
            
            if (validStatusIds.length > 0) {
                // Create Status objects with just the ID field (other fields not used in filtering)
                filters.statuses = validStatusIds.map(id => ({ 
                    id,
                    created_at: new Date(), // Required fields by type but not used in comparison
                    update_at: new Date(),  // Required fields by type but not used in comparison
                    name: ""               // Required fields by type but not used in comparison
                }));
            }
        }
    }

    return filters;
}