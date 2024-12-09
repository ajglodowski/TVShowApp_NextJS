import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/utils/loadingSpinner";

export default async function LoadingShowPage() {

    return (
        <div className='w-full h-full'>
          <div className=''>
            <div className='w-full'>
                <div className="mx-auto">
                    <Skeleton className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] mx-auto object-contain rounded-md" />
                </div>
            </div>
            <h1 className='text-7xl sm:text-9xl font-extrabold tracking-tighter text-center -mt-16'>Loading show...</h1>
            <h2 className='text-2xl tracking-tight text-center'>Your show info will be available shortly</h2>
          </div>
    
        </div>
    
      );
}