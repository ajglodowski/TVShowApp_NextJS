/**
 * Styling constants using the new design token system.
 * These use CSS variables defined in globals.css for consistency.
 */

// Backdrop background - uses --backdrop-surface token for consistent styling
export const backdropBackground = 'backdrop-blur supports-[backdrop-filter]:bg-backdrop-surface';
export const hoverBackdropBackground = 'hover:backdrop-blur hover:supports-[backdrop-filter]:bg-backdrop-surface-hover';

// Tabs styling for backdrop contexts - subtle styling matching landing page cards
export const backdropTabs = 'bg-white/[0.03] text-white h-auto w-auto gap-1 p-1 border border-white/10 rounded-lg';
export const backdropTabsTrigger = 'aria-selected:bg-white/[0.12] aria-selected:text-white aria-selected:font-medium rounded-md transition-all duration-200';
