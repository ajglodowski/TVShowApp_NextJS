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

export const ShowProperties = 'id, name, created_at, lastUpdated, length, limitedSeries, currentlyAiring, running, service, totalSeasons, airdate, releaseDate';
export const ShowPropertiesWithService = 'id, name, created_at, lastUpdated, length, limitedSeries, currentlyAiring, running, service (id, name), totalSeasons, airdate, releaseDate, pictureUrl';
export const ShowAnalyticsProperties = 'show_id, show_name, service_id, service_name, "pictureUrl", running, "limitedSeries", "totalSeasons", "releaseDate", weekly_updates, monthly_updates, yearly_updates, avg_rating_points';

export const NewShow: Show = {
    id: 0,
    name: "",
    created_at: new Date(),
    lastUpdated: new Date(),
    length: ShowLength.NONE,
    limitedSeries: false,
    currentlyAiring: false,
    running: false,
    service: OtherService,
    totalSeasons: 1,
    airdate: undefined,
    releaseDate: undefined,
    pictureUrl: null
}