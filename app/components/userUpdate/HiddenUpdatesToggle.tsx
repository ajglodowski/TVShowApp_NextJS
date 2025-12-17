'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { EyeOff } from 'lucide-react';

interface HiddenUpdatesToggleProps {
    includeHidden: boolean;
}

export default function HiddenUpdatesToggle({ includeHidden }: HiddenUpdatesToggleProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    function handleToggle(checked: boolean) {
        const params = new URLSearchParams(searchParams?.toString() ?? '');
        
        if (checked) {
            params.set('hidden', '1');
        } else {
            params.delete('hidden');
        }
        
        // Reset to page 1 when toggling
        params.delete('page');
        
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
            <EyeOff className="w-4 h-4 text-white/50" />
            <Label htmlFor="hidden-toggle" className="text-sm text-white/70 cursor-pointer">
                Show hidden
            </Label>
            <Switch 
                id="hidden-toggle"
                checked={includeHidden}
                onCheckedChange={handleToggle}
                className="data-[state=checked]:bg-primary"
            />
        </div>
    );
}

