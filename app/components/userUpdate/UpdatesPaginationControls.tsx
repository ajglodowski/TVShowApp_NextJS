'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UpdatesPaginationControlsProps {
    currentPage: number;
    previousPageUrl?: string;
    nextPageUrl?: string;
    totalPages: number;
    resultsCount: number;
}

export default function UpdatesPaginationControls({ 
    currentPage, 
    previousPageUrl, 
    nextPageUrl, 
    totalPages, 
    resultsCount 
}: UpdatesPaginationControlsProps) {
    const router = useRouter();
    
    if (totalPages <= 1 && resultsCount === 0) {
        return null;
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

    const buttonClassName = 'p-2 bg-transparent hover:bg-white/10 text-white';

    return (
        <div className="flex justify-between items-center py-3 px-1">
            {/* Results Count */}
            <div className='flex items-center gap-2 text-sm'>
                <span className='font-semibold text-white'>Results:</span>
                <span className='text-white/60'>{resultsCount} {resultsCount === 1 ? 'update' : 'updates'}</span>
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
                    
                    <div className="text-xs sm:text-sm text-white/60 whitespace-nowrap">
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

