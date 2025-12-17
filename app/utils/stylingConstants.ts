/**
 * Styling constants using the new design token system.
 * These use CSS variables defined in globals.css for consistency.
 */

// Backdrop background - uses --backdrop-surface token for consistent styling
export const backdropBackground = 'backdrop-blur supports-[backdrop-filter]:bg-backdrop-surface';
export const hoverBackdropBackground = 'hover:backdrop-blur hover:supports-[backdrop-filter]:bg-backdrop-surface-hover';

// Tabs styling for backdrop contexts
export const backdropTabs = 'bg-white/5 text-white h-auto w-auto gap-1 p-1 border-2 border-white/10';
export const backdropTabsTrigger = 'aria-selected:bg-white aria-selected:text-black hover:bg-gray-200 hover:text-black rounded-lg';
