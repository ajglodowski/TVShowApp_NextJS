'use client'

import { searchWikidataAction, WikidataSearchResult } from '@/app/(main)/newShow/import/actions';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { backdropBackground } from '@/app/utils/stylingConstants';

export function WikiImportSearchClient() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<WikidataSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const data = await searchWikidataAction(query);
                setResults(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (id: string) => {
        router.push(`/newShow/import?qid=${id}`);
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white z-10 pointer-events-none" />
                <Input
                    placeholder="Search for a show on Wikidata..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={`pl-11 text-lg py-6 ${backdropBackground} !bg-neutral-800/60 text-white border-white/20 focus-visible:ring-white/40 placeholder:text-gray-400`}
                />
                {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                    </div>
                )}
            </div>

            <div className="space-y-2">
                {results.map((item) => (
                    <Card 
                        key={item.id} 
                        className={`cursor-pointer hover:bg-white/10 transition-colors ${backdropBackground} text-white border-white/20`}
                        onClick={() => handleSelect(item.id)}
                    >
                        <CardContent className="p-4">
                            <div className="font-semibold text-lg flex justify-between">
                                <span>{item.label}</span>
                                <span className="text-xs text-gray-300 bg-white/10 px-2 py-1 rounded">{item.id}</span>
                            </div>
                            <p className="text-sm text-gray-300">{item.description}</p>
                        </CardContent>
                    </Card>
                ))}
                {query.length >= 2 && !loading && results.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                        No results found
                    </div>
                )}
            </div>
        </div>
    );
}
