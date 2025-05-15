import { ComingSoonStatusId, CurrentlyAiringStatusId, WatchlistStatusId } from '@/app/models/status';
import { createClient } from '@/app/utils/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
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
                                        <CardTitle>{row.header}</CardTitle>
                                        <ChevronRight className="w-6 h-6" />
                                    </span>
                                </Link> 
                            }
                            {
                                !row.link &&
                                <CardTitle>{row.header}</CardTitle>
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
                    <h3 className='text-xl font-bold mt-1'>{row.header}</h3>
                    {row.component}
                </div>
            ))}
        </div>
    )
    
}