import { ComingSoonStatusId, CurrentlyAiringStatusId, WatchlistStatusId, Status } from '@/app/models/status';
import { createClient } from '@/app/utils/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Search, History, Tv, TrendingUp, Play, ChartNoAxesColumnIncreasing, ChartNoAxesCombined } from 'lucide-react';
import Link from 'next/link';
import { ClientSearch } from '../search/ClientSearch';
import ComingSoonRow, { LoadingComingSoonRow } from './ComingSoonRow';
import CurrentlyAiringLoading from './CurrentlyAiringRow/CurrentlyAiringLoading';
import CurrentlyAiringRow from './CurrentlyAiringRow/CurrentlyAiringRow';
import Top10Row, { LoadingTop10Row } from './Top10Row';
import WatchListRow, { LoadingWatchlistRow } from './WatchlistRow';
import WelcomeBanner from './WelcomeBanner';
import { LoadingYourShowsRow } from './YourShowsRow/LoadingYourShowsRow';
import YourShowsRow from './YourShowsRow/YourShowsRow';
import YourUpdatesRow, { LoadingYourUpdatesRow } from './YourUpdatesRow';
import { StatusIcon } from '@/app/utils/StatusIcon';

const getHeaderIcon = (header: string): React.ReactNode => {
    // Create a mock status object for StatusIcon function
    const createMockStatus = (name: string): Status => ({
        id: 0,
        created_at: new Date(),
        update_at: new Date(),
        name: name
    });

    switch (header) {
        case 'Search':
            return <Search className="w-5 h-5" />;
        case 'Your Recent Updates':
            return <History className="w-5 h-5" />;
        case 'Your shows':
            return <Tv className="w-5 h-5" />;
        case 'Currently Airing':
            return StatusIcon(createMockStatus('Currently Airing'), 5);
        case 'Top 10 this week':
            return <ChartNoAxesCombined className="w-5 h-5" />;
        case 'Coming Soon':
            return StatusIcon(createMockStatus('Coming Soon'), 5);
        case 'Shows for you to start':
            return <Play className="w-5 h-5" />;
        default:
            return null;
    }
};

export default async function Home () {

    const supabase = await createClient();
    const { data: { user }, } = await supabase.auth.getUser();
    const currentUserId = user?.id;
    if (!currentUserId) {
        return (
            <div>Login Please</div>
        )
    }

    type HomeRow = {
        header: string;
        component: React.ReactNode;
        link?: string;
    }

    
    const rows: HomeRow[] = [
        {header: "Search", component: <ClientSearch/>}, 
        {header: "Your Recent Updates", component: <YourUpdatesRow userId={currentUserId}/>},
        {header: "Your shows", component: <YourShowsRow userId={currentUserId}/>, link: "/watchlist"}, 
        {header: "Currently Airing", component: <CurrentlyAiringRow userId={currentUserId}/>, link: "/watchlist?statuses=" + CurrentlyAiringStatusId}, 
        {header: "Top 10 this week", component: <Top10Row/>},
        {header: "Coming Soon", component: <ComingSoonRow userId={currentUserId}/>, link: "/watchlist?statuses=" + ComingSoonStatusId}, 
        {header: "Shows for you to start", component: <WatchListRow userId={currentUserId}/>, link: "/watchlist?statuses=" + WatchlistStatusId}, 
    ]

    return (
        <div className="px-2 space-y-2">
            <WelcomeBanner />
            {rows.map((row) => (
                <Card key={row.header} className={` bg-black bg-opacity-50 rounded-md text-white border-none`}>
                    <CardHeader className="px-2 mx-2 py-0 pt-4">
                            { row.link && 
                                <Link href={row.link} className="flex-row justify-between hover:underline">
                                    <span className='flex justify-between'>
                                        <CardTitle className="flex items-center gap-2">
                                            {getHeaderIcon(row.header)}
                                            {row.header}
                                        </CardTitle>
                                        <ChevronRight className="w-6 h-6" />
                                    </span>
                                </Link> 
                            }
                            {
                                !row.link &&
                                <CardTitle className="flex items-center gap-2">
                                    {getHeaderIcon(row.header)}
                                    {row.header}
                                </CardTitle>
                            }
                    </CardHeader>
                    <CardContent className="m-0 p-0">
                        {row.component}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
};

export async function LoadingHome() {

    const rows = [
        {header: "Search", component: <ClientSearch/>}, 
        {header: "Your Recent Updates", component: <LoadingYourUpdatesRow />},
        {header: "Your shows", component: <LoadingYourShowsRow />}, 
        {header: "Currently Airing", component: <CurrentlyAiringLoading />}, 
        {header: "Top 10 this week", component: <LoadingTop10Row />},
        {header: "Coming Soon", component: <LoadingComingSoonRow />}, 
        {header: "Shows for you to start", component: <LoadingWatchlistRow />}, 
    ]

    return (
        <div className="px-2">
            <WelcomeBanner />
            {rows.map((row) => (
                <div key={row.header} className="w-full overflow-x-auto">
                    <h3 className='text-xl font-bold mt-1 flex items-center gap-2'>
                        {getHeaderIcon(row.header)}
                        {row.header}
                    </h3>
                    {row.component}
                </div>
            ))}
        </div>
    )
    
}