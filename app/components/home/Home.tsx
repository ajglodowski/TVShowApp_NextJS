
import { createClient } from '@/app/utils/supabase/server'
import WatchListRow from './WatchlistRow';
import Top10Row from './Top10Row';
import YourShowsRow from './YourShowsRow/YourShowsRow';
import { ClientSearch } from '../search/ClientSearch';
import CurrentlyAiringRow from './CurrentlyAiringRow/CurrentlyAiringRow';
import ComingSoonRow from './ComingSoonRow';
import YourUpdatesRow from './YourUpdatesRow';
import WelcomeBanner from './WelcomeBanner';

export default async function Home () {

    const supabase = await createClient();
    const { data: { user }, } = await supabase.auth.getUser();
    const currentUserId = user?.id;
    if (!currentUserId) {
        return (
            <div>Login Please</div>
        )
    }

    const rows = [
        {header: "Search", component: <ClientSearch/>}, 
        {header: "Your Recent Updates", component: <YourUpdatesRow userId={currentUserId}/>},
        {header: "Your shows", component: <YourShowsRow userId={currentUserId}/>}, 
        {header: "Currently Airing", component: <CurrentlyAiringRow userId={currentUserId}/>}, 
        {header: "Top 10 this week", component: <Top10Row/>},
        {header: "Coming Soon", component: <ComingSoonRow userId={currentUserId}/>}, 
        {header: "Shows for you to start", component: <WatchListRow userId={currentUserId}/>}, 
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
};