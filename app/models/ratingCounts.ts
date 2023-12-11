import { Rating } from "./rating";

export type RatingCounts = {
    [key in Rating]: number;
};