"use client"

import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { ShowTagWithId } from '@/app/utils/userService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { backdropBackground } from "@/app/utils/stylingConstants";

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full flex items-center justify-center text-muted-foreground">Loading Network...</div>
});

interface TagNetworkChartProps {
    data: ShowTagWithId[] | null;
}

export default function TagNetworkChart({ data }: TagNetworkChartProps) {
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const containerRef = useRef<HTMLDivElement>(null);
    const fgRef = useRef<any>(null);

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: 600 // Fixed height
                });
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Configure simulation forces when graph mounts/data changes
    useEffect(() => {
        if (fgRef.current) {
            // Use d3's force simulation directly for more control
            // Increase repulsion to spread out nodes significantly
            fgRef.current.d3Force('charge').strength(-300).distanceMax(500);
            
            // Add strong collision force to prevent overlap, including the radius of the node
            // Node radius is roughly Math.sqrt(val) * 4 + 4 (plus padding)
            fgRef.current.d3Force('collide', (d: any) => Math.sqrt(d.val) * 4 + 10);
            
            // Adjust link distance to be looser
            fgRef.current.d3Force('link').distance(70);
            
            // Add center force to keep graph somewhat centered but loose
            fgRef.current.d3Force('center').strength(0.05);
        }
    }, [fgRef.current]); // eslint-disable-line

    const graphData = useMemo(() => {
        if (!data || data.length === 0) return { nodes: [], links: [] };

        const nodesMap = new Map();
        const linksMap = new Map();
        const showTagsMap = new Map();

        // 1. Group tags by show
        data.forEach(item => {
            if (!showTagsMap.has(item.showId)) {
                showTagsMap.set(item.showId, []);
            }
            showTagsMap.get(item.showId).push(item.tag);

            // Count tag frequency (node size)
            if (!nodesMap.has(item.tag.id)) {
                nodesMap.set(item.tag.id, {
                    id: item.tag.id,
                    name: item.tag.name,
                    val: 0,
                    group: item.tag.category?.name || 'Unknown'
                });
            }
            nodesMap.get(item.tag.id).val += 1;
        });

        // 2. Create links
        showTagsMap.forEach((tags: any[]) => {
            // For every pair of tags in the show
            for (let i = 0; i < tags.length; i++) {
                for (let j = i + 1; j < tags.length; j++) {
                    const source = tags[i].id;
                    const target = tags[j].id;
                    // Ensure consistent order for key
                    const linkKey = source < target ? `${source}-${target}` : `${target}-${source}`;

                    if (!linksMap.has(linkKey)) {
                        linksMap.set(linkKey, { source, target, value: 0 });
                    }
                    linksMap.get(linkKey).value += 1;
                }
            }
        });
        
        const nodes = Array.from(nodesMap.values());
        let links = Array.from(linksMap.values());

        // Filter out weak links if there are too many to reduce "blob" effect
        // If graph is large (> 1000 links), only show connections with > 1 co-occurrence
        if (links.length > 1000) {
            links = links.filter((l: any) => l.value > 1);
        }

        return { nodes, links };
    }, [data]);

    const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const label = node.name;
        const val = node.val;
        const r = Math.sqrt(val) * 4 + 4; // Larger node radius for better visibility
        
        // Draw node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
        ctx.fillStyle = node.color || 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.lineWidth = 1 / globalScale;
        ctx.stroke();

        // Draw count inside the bubble
        // Show count if bubble is large enough or zoomed in
        if (globalScale >= 1.0 || r > 8) {
            const fontSize = Math.min(r, 10); 
            ctx.font = `bold ${fontSize}px Sans-Serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgba(0,0,0,0.8)'; // Dark text for inside the bubble
            ctx.fillText(`${val}`, node.x, node.y);
        }

        // Draw label below
        // Only draw label if node is significant or zoomed in
        const shouldDrawLabel = globalScale >= 1.5 || val > 2; 
        
        if (shouldDrawLabel) {
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Text outline for readability
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3 / globalScale; // Thicker outline
            ctx.strokeText(label, node.x, node.y + r + fontSize);
            
            ctx.fillStyle = 'white';
            ctx.fillText(label, node.x, node.y + r + fontSize);
        }
    }, []);

    if (!data || data.length === 0) return null;

    return (
        <Card className={`${backdropBackground} text-white border-2 border-white/10`}>
            <CardHeader>
                <CardTitle>Tag Association Network</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
                <div ref={containerRef} className="h-[600px] w-full">
                    <ForceGraph2D
                        ref={fgRef}
                        width={dimensions.width}
                        height={dimensions.height}
                        graphData={graphData}
                        nodeLabel={(node: any) => `${node.name}: ${node.val} shows`}
                        nodeAutoColorBy="group"
                        // Link width based on value (co-occurrence count), scaled
                        linkWidth={(link: any) => Math.sqrt(link.value) * 0.5}
                        // Custom node painting to include labels
                        nodeCanvasObject={paintNode}
                        nodePointerAreaPaint={(node: any, color, ctx) => {
                            const r = Math.sqrt(node.val) * 4 + 4;
                            ctx.fillStyle = color;
                            ctx.beginPath();
                            ctx.arc(node.x, node.y, r, 0, 2 * Math.PI, false);
                            ctx.fill();
                        }}
                        backgroundColor="rgba(0,0,0,0)"
                        linkColor={() => 'rgba(255,255,255,0.15)'}
                        d3VelocityDecay={0.2} // Slightly higher decay for stability
                        cooldownTicks={100}
                        onEngineStop={() => fgRef.current?.zoomToFit(400, 50)}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

