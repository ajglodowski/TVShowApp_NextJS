import { ComingSoonStatusId, CurrentlyAiringStatusId, Status, WatchlistStatusId } from '@/app/models/status';
import { StatusIcon } from '@/app/utils/StatusIcon';
import { getCurrentUserId } from '@/app/utils/supabase/server';
import { ChartNoAxesCombined, ChevronRight, History, Hourglass, Play, Repeat, Sparkles, Tv } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import CheckInRow, { LoadingCheckInRow } from './CheckInRow';
import ComingSoonRow, { LoadingComingSoonRow } from './ComingSoonRow';
import CurrentlyAiringLoading from './CurrentlyAiringRow/CurrentlyAiringLoading';
import CurrentlyAiringRow from './CurrentlyAiringRow/CurrentlyAiringRow';
import RecommendationsRow, { LoadingRecommendationsRow } from './RecommendationsRow';
import StaleShowsRow, { LoadingStaleShowsRow } from './StaleShowsRow';
import Top10Row, { LoadingTop10Row } from './Top10Row';
import WatchListRow, { LoadingWatchlistRow } from './WatchlistRow';
import WelcomeBanner from './WelcomeBanner';
import { LoadingYourShowsRow } from './YourShowsRow/LoadingYourShowsRow';
import YourShowsRow from './YourShowsRow/YourShowsRow';
import YourUpdatesRow, { LoadingYourUpdatesRow } from './YourUpdatesRow';

const getHeaderIcon = (header: string, size: number = 4): React.ReactNode => {
    const createMockStatus = (name: string): Status => ({
        id: 0,
        created_at: new Date(),
        update_at: new Date(),
        name: name
    });

    const sizeClass = `w-${size} h-${size}`;

    switch (header) {
        case 'Your Recent Updates':
            return <History className={sizeClass} />;
        case 'Your shows':
            return <Tv className={sizeClass} />;
        case 'Recommended for You':
            return <Sparkles className={sizeClass} />;
        case 'Currently Airing':
            return StatusIcon(createMockStatus('Currently Airing'), size);
        case 'Top 10 this week':
            return <ChartNoAxesCombined className={sizeClass} />;
        case 'Coming Soon':
            return StatusIcon(createMockStatus('Coming Soon'), size);
        case 'Shows for you to start':
            return <Play className={sizeClass} />;
        case 'Stale Shows':
            return <Hourglass className={sizeClass} />;
        case 'Check In On':
            return <Repeat className={sizeClass} />;
        default:
            return null;
    }
};

type HomeRow = {
    header: string;
    component: React.ReactNode;
    loadingComponent: React.ReactNode;
    link?: string;
}

function SectionHeader({ row, compact = false }: { row: HomeRow; compact?: boolean }) {
    const HeaderContent = () => (
        <div className="flex items-center gap-2.5">
            <span className="text-primary/90">{getHeaderIcon(row.header)}</span>
            <span className={`font-semibold tracking-tight text-white/95 ${compact ? 'text-sm' : 'text-[15px]'}`}>{row.header}</span>
        </div>
    );

    if (row.link) {
        return (
            <Link 
                href={row.link} 
                className={`group flex items-center justify-between transition-colors ${compact ? 'py-2 px-0.5' : 'py-3 px-1'}`}
            >
                <HeaderContent />
                <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all" />
            </Link>
        );
    }

    return (
        <div className={compact ? 'py-2 px-0.5' : 'py-3 px-1'}>
            <HeaderContent />
        </div>
    );
}

function HeroHeader({ link }: { link: string }) {
    return (
        <Link 
            href={link} 
            className="group flex items-center justify-between mb-3"
        >
            <div className="flex items-center gap-2">
                <span className="text-primary">{getHeaderIcon('Your shows', 4)}</span>
                <span className="home-hero-header text-white">Your Shows</span>
            </div>
            <div className="flex items-center gap-1 text-white/40 group-hover:text-white/70 transition-colors">
                <span className="text-xs font-medium">View all</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
        </Link>
    );
}

type BentoVariant = 'default' | 'featured' | 'secondary' | 'subtle';

function BentoBox({ row, variant = 'default', children }: { row: HomeRow; variant?: BentoVariant; children: React.ReactNode }) {
    const variantClass = {
        default: 'bento-box',
        featured: 'bento-box bento-featured',
        secondary: 'bento-box bento-secondary',
        subtle: 'bento-box bento-subtle',
    }[variant];

    return (
        <div className={`${variantClass} home-section`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className={variant === 'featured' ? 'text-blue-400' : 'text-primary/80'}>
                        {getHeaderIcon(row.header)}
                    </span>
                    <span className={`bento-header text-white/95 ${variant === 'featured' ? 'text-base' : ''}`}>
                        {row.header}
                    </span>
                </div>
                {row.link && (
                    <Link href={row.link} className="flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors">
                        <span className="text-xs">View all</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                )}
            </div>
            {children}
        </div>
    );
}

export default async function Home () {
    
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
        return null;
    }

    // Define all rows
    const rows = {
        updates: {header: "Your Recent Updates", component: <YourUpdatesRow userId={currentUserId}/>, loadingComponent: <LoadingYourUpdatesRow />} as HomeRow,
        currentlyAiring: {header: "Currently Airing", component: <CurrentlyAiringRow userId={currentUserId}/>, loadingComponent: <CurrentlyAiringLoading />, link: "/watchlist?statuses=" + CurrentlyAiringStatusId} as HomeRow,
        top10: {header: "Top 10 this week", component: <Top10Row/>, loadingComponent: <LoadingTop10Row />} as HomeRow,
        showsToStart: {header: "Shows for you to start", component: <WatchListRow userId={currentUserId}/>, loadingComponent: <LoadingWatchlistRow />, link: "/watchlist?statuses=" + WatchlistStatusId} as HomeRow,
        comingSoon: {header: "Coming Soon", component: <ComingSoonRow userId={currentUserId}/>, loadingComponent: <LoadingComingSoonRow />, link: "/watchlist?statuses=" + ComingSoonStatusId} as HomeRow,
        recommendations: {header: "Recommended for You", component: <RecommendationsRow userId={currentUserId}/>, loadingComponent: <LoadingRecommendationsRow />} as HomeRow,
        stale: {header: "Stale Shows", component: <StaleShowsRow userId={currentUserId}/>, loadingComponent: <LoadingStaleShowsRow />} as HomeRow,
        checkIn: {header: "Check In On", component: <CheckInRow userId={currentUserId}/>, loadingComponent: <LoadingCheckInRow />} as HomeRow,
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-[1600px] mx-auto px-3 sm:px-4 pb-8">
                <WelcomeBanner />
                
                {/* Hero Section: Your Shows */}
                <section className="home-hero">
                    <HeroHeader link="/watchlist" />
                    <Suspense fallback={<LoadingYourShowsRow />}>
                        <YourShowsRow userId={currentUserId} isHero />
                    </Suspense>
                </section>

                {/* Your Recent Updates - Full Width */}
                <section className="home-section mb-4">
                    <SectionHeader row={rows.updates} />
                    <Suspense fallback={rows.updates.loadingComponent}>
                        {rows.updates.component}
                    </Suspense>
                </section>

                {/* Coming Soon - Featured Full Width */}
                <BentoBox row={rows.comingSoon} variant="featured">
                    <Suspense fallback={rows.comingSoon.loadingComponent}>
                        {rows.comingSoon.component}
                    </Suspense>
                </BentoBox>

                {/* Primary Bento Grid - 2x2 */}
                <div className="bento-grid mb-2">
                    {/* Currently Airing */}
                    <BentoBox row={rows.currentlyAiring} variant="default">
                        <Suspense fallback={rows.currentlyAiring.loadingComponent}>
                            {rows.currentlyAiring.component}
                        </Suspense>
                    </BentoBox>

                    {/* Top 10 */}
                    <BentoBox row={rows.top10} variant="default">
                        <Suspense fallback={rows.top10.loadingComponent}>
                            {rows.top10.component}
                        </Suspense>
                    </BentoBox>

                    {/* Recommendations */}
                    <BentoBox row={rows.recommendations} variant="secondary">
                        <Suspense fallback={rows.recommendations.loadingComponent}>
                            {rows.recommendations.component}
                        </Suspense>
                    </BentoBox>

                    {/* Stale Shows */}
                    <BentoBox row={rows.stale} variant="subtle">
                        <Suspense fallback={rows.stale.loadingComponent}>
                            {rows.stale.component}
                        </Suspense>
                    </BentoBox>
                </div>

                {/* Check In - Full Width */}
                <div className="mb-4">
                    <BentoBox row={rows.checkIn} variant="subtle">
                        <Suspense fallback={rows.checkIn.loadingComponent}>
                            {rows.checkIn.component}
                        </Suspense>
                    </BentoBox>
                </div>

                {/* Shows to Start - Full Width at bottom */}
                <section className="home-section">
                    <SectionHeader row={rows.showsToStart} />
                    <Suspense fallback={rows.showsToStart.loadingComponent}>
                        {rows.showsToStart.component}
                    </Suspense>
                </section>
            </div>
        </div>
    )
};

export async function LoadingHome() {

    const rows = {
        updates: {header: "Your Recent Updates", component: <LoadingYourUpdatesRow />, loadingComponent: <LoadingYourUpdatesRow />} as HomeRow,
        currentlyAiring: {header: "Currently Airing", component: <CurrentlyAiringLoading />, loadingComponent: <CurrentlyAiringLoading />} as HomeRow,
        top10: {header: "Top 10 this week", component: <LoadingTop10Row />, loadingComponent: <LoadingTop10Row />} as HomeRow,
        showsToStart: {header: "Shows for you to start", component: <LoadingWatchlistRow />, loadingComponent: <LoadingWatchlistRow />} as HomeRow,
        comingSoon: {header: "Coming Soon", component: <LoadingComingSoonRow />, loadingComponent: <LoadingComingSoonRow />} as HomeRow,
        recommendations: {header: "Recommended for You", component: <LoadingRecommendationsRow />, loadingComponent: <LoadingRecommendationsRow />} as HomeRow,
        stale: {header: "Stale Shows", component: <LoadingStaleShowsRow />, loadingComponent: <LoadingStaleShowsRow />} as HomeRow,
        checkIn: {header: "Check In On", component: <LoadingCheckInRow />, loadingComponent: <LoadingCheckInRow />} as HomeRow,
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-[1600px] mx-auto px-3 sm:px-4 pb-8">
                <WelcomeBanner />
                
                {/* Hero Section */}
                <section className="home-hero">
                    <HeroHeader link="/watchlist" />
                    <LoadingYourShowsRow />
                </section>

                {/* Your Recent Updates */}
                <section className="home-section mb-4">
                    <SectionHeader row={rows.updates} />
                    {rows.updates.component}
                </section>

                {/* Coming Soon - Featured */}
                <BentoBox row={rows.comingSoon} variant="featured">
                    {rows.comingSoon.component}
                </BentoBox>

                {/* Primary Bento Grid */}
                <div className="bento-grid mb-2">
                    <BentoBox row={rows.currentlyAiring} variant="default">
                        {rows.currentlyAiring.component}
                    </BentoBox>
                    <BentoBox row={rows.top10} variant="default">
                        {rows.top10.component}
                    </BentoBox>
                    <BentoBox row={rows.recommendations} variant="secondary">
                        {rows.recommendations.component}
                    </BentoBox>
                    <BentoBox row={rows.stale} variant="subtle">
                        {rows.stale.component}
                    </BentoBox>
                </div>

                {/* Check In */}
                <div className="mb-4">
                    <BentoBox row={rows.checkIn} variant="subtle">
                        {rows.checkIn.component}
                    </BentoBox>
                </div>

                {/* Shows to Start */}
                <section className="home-section">
                    <SectionHeader row={rows.showsToStart} />
                    {rows.showsToStart.component}
                </section>
            </div>
        </div>
    )
}