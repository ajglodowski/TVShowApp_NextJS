'use client'
import { Show } from '@/app/models/show';
import { Skeleton } from '@/components/ui/skeleton';
import { ShowRow } from '../show/ShowRow/ShowRow';
import Divider from '../Divider';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { UserShowDataWithUserInfo } from '@/app/models/userShowData';


export default function ShowSearchShows({ shows, currentUserInfo }: { shows: Show[] | null | undefined, currentUserInfo: UserShowDataWithUserInfo[]| undefined | null}) {

    if (shows === null) {
        return (
            <h4>Error Loading Shows</h4>
        );
    }

    if (shows === undefined) {
        return (
            <Skeleton className='h-12 w-full' />
        );
    }

    const getCurrentUserInfo = (showId: number) => {
        return currentUserInfo?.find((item) => Number(item.showId) === showId);
    }

    return (
        <div className='px-2'>
            <div>
                <span className='flex my-auto space-x-2'>
                    <h3 className='text-2xl font-bold'>Results:</h3>
                    <h5 className='my-auto'>{shows.length} shows</h5>
                </span>
            </div>
            <ScrollArea className='rounded-md border-2 h-96 overflow-auto'>
                <div className='py-2'>
                    {shows.map((show: Show) => (
                        <div className='px-4' key={show.id}>
                            <ShowRow show={show} currentUserInfo={getCurrentUserInfo(show.id)}/>
                            <Divider />
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
        
    );
};