'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PaginationControlsProps } from './types';

export default function PaginationControls({ currentPage, previousPageUrl, nextPageUrl, totalPages, resultsCount }: PaginationControlsProps & { resultsCount?: number }) {
    const router = useRouter();
    
    if (totalPages <= 1 && !resultsCount) {
        return null; // Don't render if there's only one page and no results to show
    }

    function handlePreviousPage() {
        if (previousPageUrl) {
            router.push(previousPageUrl);
        }
    }

    function handleNextPage() {
        if (nextPageUrl) {
            router.push(nextPageUrl);
        }
    }

    const buttonClassName = 'p-2 bg-transparent hover:bg-white/10';

    return (
        <div className="flex justify-between items-center py-2">
            {/* Results Count */}
            <div className='flex items-center gap-2 text-sm'>
                <span className='font-semibold'>Results:</span>
                <span className='text-muted-foreground'>{resultsCount || 0} shows</span>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center gap-2">
                    <Button 
                        onClick={() => handlePreviousPage()}
                        className={`${buttonClassName} ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                        disabled={currentPage === 1 || !previousPageUrl}
                        size="sm"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                        <span className="hidden sm:inline">Page {currentPage} of {totalPages}</span>
                        <span className="sm:hidden">{currentPage}/{totalPages}</span>
                    </div>
                    
                    <Button 
                        onClick={() => handleNextPage()}
                        className={`${buttonClassName} ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                        disabled={currentPage === totalPages || !nextPageUrl}
                        size="sm"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}