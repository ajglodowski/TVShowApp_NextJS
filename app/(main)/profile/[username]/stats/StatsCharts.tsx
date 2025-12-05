"use client"

import { ShowServiceCountDTO, ShowTagCountDTO, TagRatingDTO, ServiceRatingDTO, ActorCountDTO, ActorRatingDTO } from "@/app/utils/userService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { backdropBackground } from "@/app/utils/stylingConstants";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type GeneralStats = {
    showsLogged: number | null;
    updatesCreated: number | null;
    listsCreated: number | null;
    listsLiked: number | null;
    listLikes: number | null;
}

interface StatsChartsProps {
    generalStats: GeneralStats;
    topTags: ShowTagCountDTO[] | null;
    topServices: ShowServiceCountDTO[] | null;
    tagRatings: TagRatingDTO[] | null;
    serviceRatings: ServiceRatingDTO[] | null;
    topActors: ActorCountDTO[] | null;
    highestRatedActors: ActorRatingDTO[] | null;
    lowestRatedActors: ActorRatingDTO[] | null;
}

const COLORS = ['hsl(220, 70%, 50%)', 'hsl(160, 60%, 45%)', 'hsl(30, 80%, 55%)', 'hsl(280, 65%, 60%)', 'hsl(340, 75%, 55%)', '#8884d8', '#82ca9d'];

export default function StatsCharts({ generalStats, topTags, topServices, tagRatings, serviceRatings, topActors, highestRatedActors, lowestRatedActors }: StatsChartsProps) {

    const activityData = [
        { name: 'Shows Logged', value: generalStats.showsLogged || 0 },
        { name: 'Updates', value: generalStats.updatesCreated || 0 },
        { name: 'Lists', value: generalStats.listsCreated || 0 },
        { name: 'Lists Liked', value: generalStats.listsLiked || 0 },
        { name: 'List Likes Received', value: generalStats.listLikes || 0 },
    ];

    // Sort data by count descending to make bar charts look better
    const tagData = (topTags || [])
        .map(t => ({ name: t.tag.name, value: t.count }))
        .sort((a, b) => b.value - a.value);
        
    const serviceData = (topServices || [])
        .map(s => ({ name: s.service.name, value: s.count }))
        .sort((a, b) => b.value - a.value);

    const tagRatingData = (tagRatings || [])
        .map(t => ({ name: t.tag.name, value: parseFloat(t.avgRating.toFixed(2)), count: t.count }))
        .sort((a, b) => b.value - a.value);

    const serviceRatingData = (serviceRatings || [])
        .map(s => ({ name: s.service.name, value: parseFloat(s.avgRating.toFixed(2)), count: s.count }))
        .sort((a, b) => b.value - a.value);
    
    const actorData = (topActors || [])
        .map(a => ({ name: a.actor.name, value: a.count }))
        .sort((a, b) => b.value - a.value);

    const highestRatedActorData = (highestRatedActors || [])
        .map(a => ({ name: a.actor.name, value: parseFloat(a.avgRating.toFixed(2)), count: a.count }))
        .sort((a, b) => b.value - a.value);

    const lowestRatedActorData = (lowestRatedActors || [])
        .map(a => ({ name: a.actor.name, value: parseFloat(a.avgRating.toFixed(2)), count: a.count }))
        .sort((a, b) => a.value - b.value); // Sort lowest rated by value ascending

    interface CustomTooltipProps {
        active?: boolean;
        payload?: { payload: { name: string; count?: number }; value: number }[];
        label?: string;
    }

    const CustomTooltip = ({ active, payload, label: _label }: CustomTooltipProps) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/80 border border-white/10 p-2 rounded text-white text-sm z-50">
                    <p className="font-medium">{payload[0].payload.name}</p>
                    <p>{`Value: ${payload[0].value}`}</p>
                    {payload[0].payload.count !== undefined && <p className="text-xs text-gray-400">{`Based on ${payload[0].payload.count} shows`}</p>}
                </div>
            );
        }
        return null;
    };

    // Dynamic width calculation based on number of items for horizontal scroll
    const calculateWidth = (itemCount: number) => Math.max(100, itemCount * 60);

    return (
        <div className="space-y-6">
            {/* General Activity Chart */}
            <Card className={`${backdropBackground} text-white border-2 border-white/10`}>
                <CardHeader>
                    <CardTitle>User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#ccc" 
                                    tick={{fontSize: 12}}
                                    interval={0}
                                />
                                <YAxis 
                                    stroke="#ccc" 
                                    tick={{fontSize: 12}}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.1)'}} />
                                <Bar dataKey="value" fill="hsl(220, 70%, 50%)" radius={[4, 4, 0, 0]} barSize={50}>
                                    {activityData.map((entry, index) => (
                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Top Tags Chart */}
                <Card className={`${backdropBackground} text-white border-2 border-white/10`}>
                    <CardHeader>
                        <CardTitle>Tag Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {tagData.length > 0 ? (
                            <ScrollArea className="w-full whitespace-nowrap rounded-md pb-4">
                                <div style={{ width: `${calculateWidth(tagData.length)}px` }} className="h-[300px] min-w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={tagData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                                            <XAxis 
                                                dataKey="name" 
                                                stroke="#ccc" 
                                                tick={{fontSize: 11}}
                                                interval={0}
                                            />
                                            <YAxis 
                                                stroke="#ccc" 
                                                tick={{fontSize: 11}}
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.1)'}} />
                                            <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={40}>
                                                {tagData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                No tag data available
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Top Services Chart */}
                <Card className={`${backdropBackground} text-white border-2 border-white/10`}>
                    <CardHeader>
                        <CardTitle>Service Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {serviceData.length > 0 ? (
                            <ScrollArea className="w-full whitespace-nowrap rounded-md pb-4">
                                <div style={{ width: `${calculateWidth(serviceData.length)}px` }} className="h-[300px] min-w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={serviceData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                                            <XAxis 
                                                dataKey="name" 
                                                stroke="#ccc" 
                                                tick={{fontSize: 11}}
                                                interval={0}
                                            />
                                            <YAxis 
                                                stroke="#ccc" 
                                                tick={{fontSize: 11}}
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.1)'}} />
                                            <Bar dataKey="value" fill="#82ca9d" radius={[4, 4, 0, 0]} barSize={40}>
                                                {serviceData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                No service data available
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Avg Rating by Tag Chart */}
                <Card className={`${backdropBackground} text-white border-2 border-white/10`}>
                    <CardHeader>
                        <CardTitle>Highest Rated Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {tagRatingData.length > 0 ? (
                            <ScrollArea className="w-full whitespace-nowrap rounded-md pb-4">
                                <div style={{ width: `${calculateWidth(tagRatingData.length)}px` }} className="h-[300px] min-w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={tagRatingData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                                            <XAxis 
                                                dataKey="name" 
                                                stroke="#ccc" 
                                                tick={{fontSize: 11}}
                                                interval={0}
                                            />
                                            <YAxis 
                                                stroke="#ccc" 
                                                tick={{fontSize: 11}}
                                                domain={[-2, 3]}
                                                ticks={[-2, -1, 0, 1, 2, 3]}
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.1)'}} />
                                            <Bar dataKey="value" fill="#FF8042" radius={[4, 4, 0, 0]} barSize={40}>
                                                {tagRatingData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                Not enough rating data
                            </div>
                        )}
                    </CardContent>
                </Card>

                 {/* Avg Rating by Service Chart */}
                 <Card className={`${backdropBackground} text-white border-2 border-white/10`}>
                    <CardHeader>
                        <CardTitle>Highest Rated Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {serviceRatingData.length > 0 ? (
                            <ScrollArea className="w-full whitespace-nowrap rounded-md pb-4">
                                <div style={{ width: `${calculateWidth(serviceRatingData.length)}px` }} className="h-[300px] min-w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={serviceRatingData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                                            <XAxis 
                                                dataKey="name" 
                                                stroke="#ccc" 
                                                tick={{fontSize: 11}}
                                                interval={0}
                                            />
                                            <YAxis 
                                                stroke="#ccc" 
                                                tick={{fontSize: 11}}
                                                domain={[-2, 3]}
                                                ticks={[-2, -1, 0, 1, 2, 3]}
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.1)'}} />
                                            <Bar dataKey="value" fill="#0088FE" radius={[4, 4, 0, 0]} barSize={40}>
                                                {serviceRatingData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                Not enough rating data
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Top Actors Chart */}
                <Card className={`${backdropBackground} text-white border-2 border-white/10`}>
                    <CardHeader>
                        <CardTitle>Most Watched Actors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {actorData.length > 0 ? (
                            <ScrollArea className="w-full whitespace-nowrap rounded-md pb-4">
                                <div style={{ width: `${calculateWidth(actorData.length)}px` }} className="h-[300px] min-w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={actorData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                                            <XAxis 
                                                dataKey="name" 
                                                stroke="#ccc" 
                                                tick={{fontSize: 11}}
                                                interval={0}
                                            />
                                            <YAxis 
                                                stroke="#ccc" 
                                                tick={{fontSize: 11}}
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.1)'}} />
                                            <Bar dataKey="value" fill="#FFBB28" radius={[4, 4, 0, 0]} barSize={40}>
                                                {actorData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                No actor data available
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Highest Rated Actors Chart */}
                <Card className={`${backdropBackground} text-white border-2 border-white/10`}>
                    <CardHeader>
                        <CardTitle>Highest Rated Actors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {highestRatedActorData.length > 0 ? (
                            <ScrollArea className="w-full whitespace-nowrap rounded-md pb-4">
                                <div style={{ width: `${calculateWidth(highestRatedActorData.length)}px` }} className="h-[300px] min-w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={highestRatedActorData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                                            <XAxis 
                                                dataKey="name" 
                                                stroke="#ccc" 
                                                tick={{fontSize: 11}}
                                                interval={0}
                                            />
                                            <YAxis 
                                                stroke="#ccc" 
                                                tick={{fontSize: 11}}
                                                domain={[-2, 3]}
                                                ticks={[-2, -1, 0, 1, 2, 3]}
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.1)'}} />
                                            <Bar dataKey="value" fill="#00C49F" radius={[4, 4, 0, 0]} barSize={40}>
                                                {highestRatedActorData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                Not enough rating data
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Lowest Rated Actors Chart */}
                <Card className={`${backdropBackground} text-white border-2 border-white/10`}>
                    <CardHeader>
                        <CardTitle>Lowest Rated Actors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {lowestRatedActorData.length > 0 ? (
                            <ScrollArea className="w-full whitespace-nowrap rounded-md pb-4">
                                <div style={{ width: `${calculateWidth(lowestRatedActorData.length)}px` }} className="h-[300px] min-w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={lowestRatedActorData} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                                            <XAxis 
                                                dataKey="name" 
                                                stroke="#ccc" 
                                                tick={{fontSize: 11}}
                                                interval={0}
                                            />
                                            <YAxis 
                                                stroke="#ccc" 
                                                tick={{fontSize: 11}}
                                                domain={[-2, 3]}
                                                ticks={[-2, -1, 0, 1, 2, 3]}
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.1)'}} />
                                            <Bar dataKey="value" fill="#FF4D4D" radius={[4, 4, 0, 0]} barSize={40}>
                                                {lowestRatedActorData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                                Not enough rating data
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
