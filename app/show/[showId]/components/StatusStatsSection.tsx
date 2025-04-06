'use client'

import { StatusCount } from '@/app/models/statusCount';
import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export default function StatusStatsSection ({ statusCounts }: { statusCounts: StatusCount[]| null }) {

    if (!statusCounts) {
        return (
            <h4>Error Loading Rating Counts</h4>
        );
    }

    const data = ():{name: string, total: number}[] => {
        const out = [];
        for (const statusCount of statusCounts) {
            out.push({name: statusCount.status.name, total: statusCount.count});
        }
        return out;
    };




    return (
        <div className='text-left'>
            <div>
                <h1 className='text-7xl font-bold tracking-tighter'>Status Counts</h1>
            </div>
            <div className='min-w-48'>
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
        </div>
    );
};
