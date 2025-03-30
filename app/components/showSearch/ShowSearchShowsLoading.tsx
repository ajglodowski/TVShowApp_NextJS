import { Skeleton } from '@/components/ui/skeleton';
import Divider from '../Divider';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import ShowRowSkeleton from '../show/ShowRow/ShowRowSkeleton';

// Number of items per page
const ITEMS_PER_PAGE = 20;

export default function ShowSearchShowsLoading() {

    return (
        <div className='px-2'>
            <div>
                <span className='flex my-auto space-x-2 items-center'>
                    <h3 className='text-2xl font-bold'>Results:</h3>
                    <h5 className='w-32 h-6 my-auto'><Skeleton className='w-full h-full' /></h5>
                </span>
            </div>
            <ScrollArea className='rounded-md border-2 h-96 overflow-auto'>
                <div className='py-2'>
                    {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                        <div className='px-4' key={index}>
                            <ShowRowSkeleton />
                            <Divider />
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}