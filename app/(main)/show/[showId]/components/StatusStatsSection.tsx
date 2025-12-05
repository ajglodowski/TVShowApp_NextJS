'use client'

import { StatusCount } from '@/app/models/statusCount';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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

    const chartConfig = {
        total: {
          label: "Count",
        },
        name: {
            label: "Status"
        }
    } satisfies ChartConfig

    return (
        <div className='text-left'>
            <div>
                <h1 className='text-7xl font-bold tracking-tighter'>Status Counts</h1>
            </div>
            <div className="w-full -mx-4">
                {data().length > 0 &&
                    <ChartContainer config={chartConfig} className="h-52 w-full">
                        <BarChart accessibilityLayer data={data()}>
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            stroke="#FFFFFF"
                            // tickFormatter={(value) => value.slice(0, 3)} // Optional: Shorten labels if needed
                          />
                          <YAxis
                           tickLine={false}
                           tickMargin={10}
                           axisLine={false}
                           stroke="#FFFFFF"
                           />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                          />
                          <Bar dataKey="total" fill="#FFFFFF" radius={4} />
                        </BarChart>
                      </ChartContainer>
                }
            </div>
        </div>
    );
};
