'use client'
import { Show } from '@/app/models/show';
import { Skeleton } from '@/components/ui/skeleton';
import { ShowRow } from '../show/ShowRow';
import Divider from '../Divider';
import { ScrollArea } from '@radix-ui/react-scroll-area';


export default function ShowSearchShows({ shows }: { shows: Show[] | null | undefined }) {

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

    return (
        <div className='px-2'>
            <ScrollArea className='rounded-md border-2 h-96 overflow-auto'>
                <div className='py-2'>
                    {shows.map((show: Show) => (
                        <div className='px-4' key={show.id}>
                            <ShowRow show={show} />
                            <Divider />
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
        
    );
};