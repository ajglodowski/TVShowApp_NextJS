import { Skeleton } from '@/components/ui/skeleton';
import Divider from '../Divider';
import ShowRowSkeleton from '../show/ShowRow/ShowRowSkeleton';

// Number of items per page
const ITEMS_PER_PAGE = 20;

export default function ShowSearchShowsLoading() {

    return (
        <div className='w-full'>
            {/* Content Container */}
            <div className='py-4 space-y-1'>
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                    <div className='px-4' key={index}>
                        <ShowRowSkeleton />
                        <Divider />
                    </div>
                ))}
            </div>
        </div>
    );
}