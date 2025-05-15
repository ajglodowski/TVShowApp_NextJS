import { AirDate } from "./airDate";
import { OtherService, Service } from "./service";
import { ShowLength } from "./showLength";

export type Show = {
    id: number;
    name: string;
    created_at: Date;
    lastUpdated: Date;
    length: ShowLength;
    limitedSeries: boolean;
    currentlyAiring: boolean;
    running: boolean;
    service: Service;
    totalSeasons: number;
    airdate: AirDate | undefined;
    releaseDate: Date | undefined;
    pictureUrl: string | null;
}

// Type for popularity metrics from show_analytics materialized view
export type ShowAnalytics = {
    show_id: number;
    show_name: string;
    service_id: number;
    service_name: string;
    pictureUrl: string | null;
    running: boolean;
    limitedSeries: boolean;
    totalSeasons: number;
    releaseDate: Date | undefined;
    weekly_updates: number;
    monthly_updates: number;
    yearly_updates: number;
    avg_rating_points: number;
}

// Type that combines Show with analytics data
export type ShowWithAnalytics = Show & {
    weekly_updates?: number;
    monthly_updates?: number;
    yearly_updates?: number;
    avg_rating_points?: number;
}

export const convertRawShowAnalyticsToShowWithAnalytics = (analyticsData: any): ShowWithAnalytics => {
    
    const result: ShowWithAnalytics = {
        id: analyticsData.show_id,
        name: analyticsData.show_name,
        created_at: new Date(8.64e15), // Default value as it's not in the view
        lastUpdated: new Date(8.64e15), // Default value as it's not in the view
        length: analyticsData.length || null,
        limitedSeries: analyticsData.limitedSeries || false,
        currentlyAiring: analyticsData.currentlyAiring || false,
        running: analyticsData.running || false,
        service: {
            id: analyticsData.service_id,
            name: analyticsData.service_name
        },
        totalSeasons: analyticsData.totalSeasons || 1,
        airdate: analyticsData.airdate,
        releaseDate: analyticsData.releaseDate,
        pictureUrl: analyticsData.pictureUrl,
        weekly_updates: typeof analyticsData.weekly_updates === 'number' ? analyticsData.weekly_updates : 0,
        monthly_updates: typeof analyticsData.monthly_updates === 'number' ? analyticsData.monthly_updates : 0,
        yearly_updates: typeof analyticsData.yearly_updates === 'number' ? analyticsData.yearly_updates : 0,
        avg_rating_points: typeof analyticsData.avg_rating_points === 'number' ? analyticsData.avg_rating_points : 0
    };
    return result;
}

export const ShowProperties = 'id, name, created_at, lastUpdated, length, limitedSeries, currentlyAiring, running, service, totalSeasons, airdate, releaseDate';
export const ShowPropertiesWithService = 'id, name, created_at, lastUpdated, length, limitedSeries, currentlyAiring, running, service (id, name), totalSeasons, airdate, releaseDate, pictureUrl';
export const ShowAnalyticsProperties = 'show_id, show_name, service_id, service_name, "pictureUrl", running, "limitedSeries", "totalSeasons", "releaseDate", weekly_updates, monthly_updates, yearly_updates, avg_rating_points';

