import { getShowMatchForCurrentUser } from '@/app/utils/recommendations/RecommendationService';
import { Skeleton } from '@/components/ui/skeleton';

interface ShowMatchBadgeProps {
  showId: number;
}

export async function ShowMatchBadge({ showId }: ShowMatchBadgeProps) {
  const showMatch = await getShowMatchForCurrentUser(showId);
  
  const matchPercent =
    showMatch?.similarityScore !== null && showMatch?.similarityScore !== undefined
      ? Math.max(0, Math.min(100, Math.round(showMatch.similarityScore * 100)))
      : null;

  return (
    <div className='text-center mt-2'>
      <span className='inline-flex items-center rounded-md bg-black/40 px-3 py-1 text-lg font-semibold text-white shadow'>
        Match: {matchPercent !== null ? `${matchPercent}%` : '—'}
      </span>
      {matchPercent === null && showMatch?.reason === 'no_user_embedding' && (
        <div className='text-sm text-white/80 mt-1'>
          Rate a few shows to unlock personalized match scores.
        </div>
      )}
    </div>
  );
}

export function ShowMatchBadgeLoading() {
  return (
    <div className='text-center mt-2'>
      <Skeleton className='inline-flex h-8 w-28 rounded-md bg-black/20' />
    </div>
  );
}

