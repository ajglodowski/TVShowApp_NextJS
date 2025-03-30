'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type PaginationControlsProps = {
    currentPage: number;
    previousPageUrl?: string;
    nextPageUrl?: string;
};

export default function PaginationControls({ currentPage, previousPageUrl, nextPageUrl }: PaginationControlsProps) {
    const router = useRouter();
    const [totalPages, setTotalPages] = useState(1);
    
    useEffect(() => {
        // Read total pages from the hidden div
        const totalPagesElement = document.getElementById('total-pages');
        if (totalPagesElement) {
            const pages = parseInt(totalPagesElement.getAttribute('data-total-pages') || '1');
            setTotalPages(pages);
        }
    }, []);

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
        <div className="flex justify-center items-center mt-6 mb-8">
            <Button 
                onClick={() => handlePreviousPage()}
                className={`px-4 py-2 mr-2 bg-gray-200 rounded ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                disabled={currentPage === 1 || !previousPageUrl}
            >
                Previous
            </Button>
            
            <div className="mx-4">
                Page {currentPage} of {totalPages}
            </div>
            
            <Button 
                onClick={() => handleNextPage()}
                className={`px-4 py-2 ml-2 bg-gray-200 rounded ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                disabled={currentPage === totalPages || !nextPageUrl}
            >
                Next
            </Button>
        </div>
    );
} 