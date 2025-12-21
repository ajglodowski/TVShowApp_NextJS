import { ComingSoonStatusId, CurrentlyAiringStatusId, Status, WatchlistStatusId } from '@/app/models/status';
import { StatusIcon } from '@/app/utils/StatusIcon';
import { getCurrentUserId } from '@/app/utils/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartNoAxesCombined, ChevronRight, History, Hourglass, Play, Repeat, Sparkles, Tv } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import CheckInRow, { LoadingCheckInRow } from './CheckInRow';
import ComingSoonRow, { LoadingComingSoonRow } from './ComingSoonRow';
import CurrentlyAiringLoading from './CurrentlyAiringRow/CurrentlyAiringLoading';
import CurrentlyAiringRow from './CurrentlyAiringRow/CurrentlyAiringRow';
import RecommendationsRow, { LoadingRecommendationsRow } from './RecommendationsRow';
import StaleShowsRow, { LoadingStaleShowsRow } from './StaleShowsRow';
import Top10Row, { LoadingTop10Row } from './Top10Row';
import WatchListRow, { LoadingWatchlistRow } from './WatchlistRow';
import WelcomeBanner from './WelcomeBanner';
import { LoadingYourShowsRow } from './YourShowsRow/LoadingYourShowsRow';
import YourShowsRow from './YourShowsRow/YourShowsRow';
import YourUpdatesRow, { LoadingYourUpdatesRow } from './YourUpdatesRow';
const getHeaderIcon = (header: string): React.ReactNode => {
    // Create a mock status object for StatusIcon function
    const createMockStatus = (name: string): Status => ({
        id: 0,
        created_at: new Date(),
        update_at: new Date(),
        name: name
    });

    switch (header) {
        case 'Your Recent Updates':
            return <History className="w-5 h-5" />;
        case 'Your shows':
            return <Tv className="w-5 h-5" />;
        case 'Recommended for You':
            return <Sparkles className="w-5 h-5" />;
        case 'Currently Airing':
            return StatusIcon(createMockStatus('Currently Airing'), 5);
        case 'Top 10 this week':
            return <ChartNoAxesCombined className="w-5 h-5" />;
        case 'Coming Soon':
            return StatusIcon(createMockStatus('Coming Soon'), 5);
        case 'Shows for you to start':
            return <Play className="w-5 h-5" />;
        case 'Stale Shows':
            return <Hourglass className="w-5 h-5" />;
        case 'Check In On':
            return <Repeat className="w-5 h-5" />;
        default:
            return null;
    }
};

export default async function Home () {
    
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
        return (
            <div>Login Please</div>
        )
    }

    type HomeRow = {
        header: string;
        component: React.ReactNode;
        loadingComponent: React.ReactNode;
        link?: string;
    }

    
    const rows: HomeRow[] = [
        {header: "Your Recent Updates", component: <YourUpdatesRow userId={currentUserId}/>, loadingComponent: <LoadingYourUpdatesRow />},
        {header: "Your shows", component: <YourShowsRow userId={currentUserId}/>, loadingComponent: <LoadingYourShowsRow />, link: "/watchlist"}, 
        {header: "Recommended for You", component: <RecommendationsRow userId={currentUserId}/>, loadingComponent: <LoadingRecommendationsRow />},
        {header: "Currently Airing", component: <CurrentlyAiringRow userId={currentUserId}/>, loadingComponent: <CurrentlyAiringLoading />, link: "/watchlist?statuses=" + CurrentlyAiringStatusId}, 
        {header: "Top 10 this week", component: <Top10Row/>, loadingComponent: <LoadingTop10Row />},
        {header: "Coming Soon", component: <ComingSoonRow userId={currentUserId}/>, loadingComponent: <LoadingComingSoonRow />, link: "/watchlist?statuses=" + ComingSoonStatusId}, 
        {header: "Stale Shows", component: <StaleShowsRow userId={currentUserId}/>, loadingComponent: <LoadingStaleShowsRow />},
        {header: "Check In On", component: <CheckInRow userId={currentUserId}/>, loadingComponent: <LoadingCheckInRow />},
        {header: "Shows for you to start", component: <WatchListRow userId={currentUserId}/>, loadingComponent: <LoadingWatchlistRow />, link: "/watchlist?statuses=" + WatchlistStatusId}, 
    ]

    return (
        <div className="px-2 space-y-2">
            <WelcomeBanner />
            {rows.map((row) => (
                <Card key={row.header} className="!bg-black/50 rounded-md text-white !border-none py-0 gap-0 shadow-none">
                    <CardHeader className="px-4 pt-3 pb-1">
                        {row.link ? (
                            <Link href={row.link} className="flex items-center justify-between gap-3 hover:underline">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    {getHeaderIcon(row.header)}
                                    {row.header}
                                </CardTitle>
                                <ChevronRight className="w-6 h-6" />
                            </Link>
                        ) : (
                            <CardTitle className="flex items-center gap-2 text-xl">
                                {getHeaderIcon(row.header)}
                                {row.header}
                            </CardTitle>
                        )}
                    </CardHeader>
                    <CardContent className="p-0 pb-2">
                        <Suspense fallback={row.loadingComponent}>
                            {row.component}
                        </Suspense>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
};

export async function LoadingHome() {

    const rows = [
        {header: "Your Recent Updates", component: <LoadingYourUpdatesRow />},
        {header: "Your shows", component: <LoadingYourShowsRow />}, 
        {header: "Recommended for You", component: <LoadingRecommendationsRow />},
        {header: "Currently Airing", component: <CurrentlyAiringLoading />}, 
        {header: "Top 10 this week", component: <LoadingTop10Row />},
        {header: "Coming Soon", component: <LoadingComingSoonRow />}, 
        {header: "Stale Shows", component: <LoadingStaleShowsRow />},
        {header: "Check In On", component: <LoadingCheckInRow />},
        {header: "Shows for you to start", component: <LoadingWatchlistRow />}, 
    ]

    return (
        <div className="px-2 space-y-2">
            <WelcomeBanner />
            {rows.map((row) => (
                <Card key={row.header} className="!bg-black/50 rounded-md text-white !border-none py-0 gap-0 shadow-none">
                    <CardHeader className="px-4 pt-3 pb-1">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            {getHeaderIcon(row.header)}
                            {row.header}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 pb-2">
                        {row.component}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
    
}