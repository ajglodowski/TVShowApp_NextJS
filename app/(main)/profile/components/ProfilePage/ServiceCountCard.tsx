import { getUserTopServices, ShowServiceCountDTO } from "@/app/utils/userService";
import { Tv2 } from "lucide-react";

export default async function ServiceCountCard({ userId }: { userId: string }) {

    const serviceData = await getUserTopServices(userId);

    if (serviceData === null) {
        return (
            <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-5">
                <div className="flex items-center gap-2 text-white/50">
                    <Tv2 className="w-5 h-5" />
                    <span>Error loading service data</span>
                </div>
            </div>
        );
    }

    if (serviceData.length === 0) {
        return (
            <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <Tv2 className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-white">Top Services</h3>
                    </div>
                </div>
                <div className="px-5 py-8 text-center text-white/50 text-sm">
                    No services tracked yet
                </div>
            </div>
        );
    }

    // Calculate max count for progress bar
    const maxCount = Math.max(...serviceData.slice(0, 5).map(s => s.count));

    // Service colors for variety
    const serviceColors = [
        'from-primary to-primary/70',
        'from-emerald-500 to-emerald-500/70',
        'from-blue-500 to-blue-500/70',
        'from-purple-500 to-purple-500/70',
        'from-rose-500 to-rose-500/70',
    ];

    return (
        <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Tv2 className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-white">Top Services</h3>
                </div>
            </div>
            <div className="px-5 py-3 space-y-3">
                {serviceData.slice(0, 5).map((serviceCount: ShowServiceCountDTO, index: number) => (
                    <div key={serviceCount.service.id} className="group">
                        <div className="flex justify-between items-center text-sm mb-1.5">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-xs text-white/70 font-medium">
                                    {index + 1}
                                </div>
                                <span className="text-white/80 group-hover:text-white transition-colors">{serviceCount.service.name}</span>
                            </div>
                            <span className="text-white/50 text-xs tabular-nums">{serviceCount.count} shows</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className={`h-full bg-gradient-to-r ${serviceColors[index % serviceColors.length]} rounded-full transition-all duration-500`}
                                style={{ width: `${(serviceCount.count / maxCount) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}