
import { createClient } from '@/utils/supabase/server'
import { Watch } from '@mui/icons-material';
import { cookies } from 'next/headers'
import WatchListRow from './WatchlistRow';
import Top10Row from './Top10Row';
import YourShowsRow from './YourShowsRow/YourShowsRow';
import { ClientSearch } from '../search/ClientSearch';
import CurrentlyAiringRow from './CurrentlyAiringRow';
import ComingSoonRow from './ComingSoonRow';
import YourUpdatesRow from './YourUpdatesRow';

export default async function Home () {

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: { user }, } = await supabase.auth.getUser();
    const currentUserId = user?.id;
    if (!currentUserId) {
        return (
            <div>Login Please</div>
        )
    }

    const rows = [

        {header: "Search:", component: <ClientSearch/>}, 
        {header: "Your Recent Updates:", component: <YourUpdatesRow userId={currentUserId}/>},
        {header: "Your shows:", component: <YourShowsRow userId={currentUserId}/>}, 
        {header: "Currently Airing:", component: <CurrentlyAiringRow userId={currentUserId}/>}, 
        {header: "Top 10 this week:", component: <Top10Row/>}, 
        {header: "Coming Soon:", component: <ComingSoonRow userId={currentUserId}/>}, 
        {header: "Shows for you to start:", component: <WatchListRow userId={currentUserId}/>}, 
    ]

    return (
        <div className="px-2">
            <div className="flex">
                <h1 className="text-4xl font-bold">Welcome to TV Show App</h1>
            </div>
            {rows.map((row) => (
                <div className="w-full overflow-x-auto">
                    <h3 className='text-4xl font-bold'>{row.header}</h3>
                    {row.component}
                </div>
            ))}
        </div>
    )
};