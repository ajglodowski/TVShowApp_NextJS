'use client'

import { Rating, RatingPoints } from '@/app/models/rating';
import { RatingCounts } from '@/app/models/ratingCounts';
import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export default function RatingsStatsSection ({ ratingCounts }: { ratingCounts: RatingCounts| null }) {

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
    const data = ():{name: string, total: number}[] => {
        let out = [];
        for (const rating in ratingCounts) {
            out.push({name: rating, total: ratingCounts[rating as Rating]});
        }
        return out;
    };




    return (
        <div className='text-left flex'>
            <div>
                <h1 className='text-7xl font-bold tracking-tighter'>Ratings</h1>
                <h2 className='text-lg'>Average Rating Score: {averageRating().toFixed(2)}</h2>
            </div>
            {data().length > 0 &&
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data()}>
                        <XAxis
                            dataKey="name"
                            stroke="#FFFFFF"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#FFFFFF"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Bar
                            dataKey="total"
                            fill="#FFFFFF"
                            radius={[4, 4, 0, 0]}
                            className="fill-primary"
                        />
                    </BarChart>
                </ResponsiveContainer>
            }
        </div>
    );
};
