import { Show, ShowPropertiesWithService } from "@/app/models/show";
import { ShowSearchFilters } from "./ShowSearchHeader";
import { createClient } from "@/utils/supabase/client";
import { Service } from "@/app/models/service";

export async function fetchShows(filters: ShowSearchFilters): Promise<Show[] | null> {
    const supabase = createClient();
    let queryBase = supabase.from("show").select(ShowPropertiesWithService);

    console.log(filters);
    if (filters.currentlyAiring !== undefined) queryBase = queryBase.eq('currentlyAiring', filters.currentlyAiring);
    if (filters.running !== undefined) queryBase = queryBase.eq('running', filters.running);
    if (filters.limitedSeries !== undefined) queryBase = queryBase.eq('limitedSeries', filters.limitedSeries);
    if (filters.service.length > 0) queryBase = queryBase.in('service', filters.service.map((service) => service.id));
    if (filters.airDate.length > 0) queryBase = queryBase.in('airdate', filters.airDate);

    queryBase = queryBase.limit(30);

    const { data: showData } = await queryBase;
    
    if (!showData) return null;

    const shows: Show[] = showData.map((show) => {
        return {
            ...show,
            service: show.service as unknown as Service
        };
    });
    
    
    return shows;
}

export async function getServices(): Promise<Service[] | null> {
    const supabase = createClient();
    const { data: serviceData } = await supabase.from("service").select();
    if (!serviceData) return null;
    const services: Service[] = serviceData;
    return services;
}
