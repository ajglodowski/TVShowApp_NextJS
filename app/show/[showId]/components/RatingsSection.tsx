
import { Rating, RatingPoints } from '@/app/models/rating';
import { RatingCounts } from '@/app/models/ratingCounts';
import React from 'react';

export default function RatingsSection ({ ratingCounts }: { ratingCounts: RatingCounts| null }) {
    console.log(ratingCounts);

    if (!ratingCounts) {
        return (
            <h4>Error Loading Rating Counts</h4>
        );
    }

    const averageRating = (): number => {
        // iterate over the rating counts keys and generate the average rating
        let totalRatings = 0;
        let ratingTotal = 0;
        for (const rating in ratingCounts) {
            const ratingCount = ratingCounts[rating as Rating];
            totalRatings += ratingCount;
            ratingTotal += ratingCount * RatingPoints[rating as Rating];
        }
        return ratingTotal / totalRatings;
    }



    return (
        <div>
            Ratings:
            <h2>Average Rating: {averageRating().toFixed(2)}</h2>
            <h3>{ratingCounts[Rating.LOVED]} Loved</h3>
            <h3>{ratingCounts[Rating.LIKED]} Liked</h3>
            <h3>{ratingCounts[Rating.MEH]} Meh</h3>
            <h3>{ratingCounts[Rating.DISLIKED]} Disliked</h3>
        </div>
    );
};
