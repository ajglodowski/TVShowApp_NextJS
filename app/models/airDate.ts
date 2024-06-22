export enum AirDate {
    SUNDAY = "Sunday",
    MONDAY = "Monday",
    TUESDAY = "Tuesday",
    WEDNESDAY = "Wednesday",
    THURSDAY = "Thursday",
    FRIDAY = "Friday",
    SATURDAY = "Saturday"
}

const AirDateNumber = {
    [AirDate.SUNDAY]: 0,
    [AirDate.MONDAY]: 1,
    [AirDate.TUESDAY]: 2,
    [AirDate.WEDNESDAY]: 3,
    [AirDate.THURSDAY]: 4,
    [AirDate.FRIDAY]: 5,
    [AirDate.SATURDAY]: 6
}

export type CurrentlyAiringDTO = {
    id: number,
    name: number,
    airdate: AirDate
}