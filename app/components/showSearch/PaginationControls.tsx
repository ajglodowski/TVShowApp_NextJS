'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { backdropBackground } from '@/app/utils/stylingConstants';
import { PaginationControlsProps } from './types';

export default function PaginationControls({ currentPage, previousPageUrl, nextPageUrl, totalPages }: PaginationControlsProps) {
    const router = useRouter();
    
    if (totalPages <= 1) {
        return null; // Don't render pagination if there's only one page
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

    return (
        <div className="flex justify-center items-center py-4 px-4">
            <Button 
                variant="outline"
                onClick={() => handlePreviousPage()}
                className={`px-4 py-2 mr-2 rounded-md ${backdropBackground} ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                disabled={currentPage === 1 || !previousPageUrl}
                size="sm"
            >
                Previous
            </Button>
            
            <div className="mx-4 text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
            </div>
            
            <Button 
                variant="outline"
                onClick={() => handleNextPage()}
                className={`px-4 py-2 ml-2 rounded-md ${backdropBackground} ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                disabled={currentPage === totalPages || !nextPageUrl}
                size="sm"
            >
                Next
            </Button>
        </div>
    );
}