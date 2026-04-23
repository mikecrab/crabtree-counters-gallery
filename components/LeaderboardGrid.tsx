'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LeaderboardGrid({ items }: { items: any[] }) {
    const [zoomedItem, setZoomedItem] = useState<any | null>(null);

    // Allow closing the zoom modal with the Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setZoomedItem(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">

            {/* Ranked Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, index) => {
                    const vicostoneUrl = item.productId ? `https://us.vicostone.com/product/${item.productId}` : '#';

                    return (
                        <div key={item.originalFile} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col relative group shadow-lg">

                            {/* Rank and Vote Badges */}
                            <div className="absolute top-3 left-3 z-20 bg-black/80 text-white font-bold px-3 py-1 rounded-full border border-gray-700 backdrop-blur-sm shadow-md">
                                #{index + 1}
                            </div>
                            <div className="absolute top-3 right-3 z-20 bg-green-600/90 text-white font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                                {item.votes} {item.votes === 1 ? 'Vote' : 'Votes'}
                            </div>

                            {/* Clickable Split Thumbnail Container */}
                            <div
                                onClick={() => setZoomedItem(item)}
                                className="flex w-full h-64 cursor-zoom-in overflow-hidden border-b border-gray-800"
                            >
                                {/* 1/3 Swatch */}
                                <div className="relative w-1/3 h-full bg-gray-950 border-r border-gray-800 flex-shrink-0 z-10">
                                    <Image
                                        src={`/mockups/counters/${item.originalFile}`}
                                        alt={`${item.displayName} Swatch`}
                                        fill
                                        style={{ objectFit: 'contain' }}
                                        className="p-3"
                                        sizes="(max-width: 768px) 33vw, 11vw"
                                    />
                                    <div className="absolute bottom-2 left-2 bg-black/80 text-gray-300 text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase">
                                        Swatch
                                    </div>
                                </div>

                                {/* 2/3 Render */}
                                <div className="relative w-2/3 h-full bg-black overflow-hidden flex-shrink-0">
                                    <Image
                                        src={`/mockups/renders/${item.renderFile}`}
                                        alt={`${item.displayName} Render`}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        sizes="(max-width: 768px) 66vw, 22vw"
                                        className="group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-2 right-2 bg-black/80 text-gray-300 text-[10px] font-bold px-2 py-1 rounded tracking-wider uppercase">
                                        Render
                                    </div>
                                </div>
                            </div>

                            {/* Info Footer */}
                            <div className="p-4 flex flex-col gap-1">
                                <h2 className="text-lg font-bold text-gray-100 truncate" title={item.displayName}>
                                    {item.displayName}
                                </h2>
                                {item.productId && (
                                    <a
                                        href={vicostoneUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-semibold text-blue-400 hover:text-blue-300 w-fit"
                                    >
                                        View Slab Specs ↗
                                    </a>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Full-Screen Zoom Modal (Shows both side-by-side) */}
            {zoomedItem && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 lg:p-8 cursor-zoom-out backdrop-blur-sm"
                    onClick={() => setZoomedItem(null)}
                >
                    <div className="absolute top-4 right-4 text-gray-400 font-mono bg-gray-900 border border-gray-800 px-3 py-1 rounded text-sm z-50 shadow-lg">
                        Press ESC or click anywhere to close
                    </div>

                    <div className="w-full max-w-[95vw] h-[85vh] flex flex-col lg:flex-row gap-6 items-center justify-center relative">

                        {/* Zoomed Swatch */}
                        <div className="relative w-full lg:w-1/4 h-48 lg:h-[70vh] bg-gray-900 rounded-xl border border-gray-800 p-4 shadow-2xl flex-shrink-0">
                            <Image
                                src={`/mockups/counters/${zoomedItem.originalFile}`}
                                alt={`${zoomedItem.displayName} Swatch`}
                                fill
                                style={{ objectFit: 'contain' }}
                                className="p-4"
                                sizes="(max-width: 1024px) 100vw, 25vw"
                                priority
                            />
                            <div className="absolute top-3 left-3 bg-black/80 text-gray-200 text-xs font-bold px-3 py-1.5 rounded tracking-widest uppercase backdrop-blur-sm z-10">
                                Swatch
                            </div>
                        </div>

                        {/* Zoomed Render */}
                        <div className="relative w-full lg:w-3/4 h-64 lg:h-[70vh] bg-black rounded-xl border border-gray-800 overflow-hidden shadow-2xl flex-shrink-0">
                            <Image
                                src={`/mockups/renders/${zoomedItem.renderFile}`}
                                alt={`${zoomedItem.displayName} Render`}
                                fill
                                style={{ objectFit: 'contain' }}
                                sizes="(max-width: 1024px) 100vw, 75vw"
                                priority
                            />
                            <div className="absolute top-3 left-3 bg-black/80 text-gray-200 text-xs font-bold px-3 py-1.5 rounded tracking-widest uppercase backdrop-blur-sm z-10">
                                Mockup Render
                            </div>
                        </div>

                    </div>

                    <div className="absolute bottom-6 left-6 text-white bg-gray-900/90 px-6 py-3 rounded-xl border border-gray-700 backdrop-blur-md shadow-2xl flex items-center gap-4">
                        <h2 className="text-xl font-bold text-gray-100">{zoomedItem.displayName}</h2>
                        <div className="h-6 w-px bg-gray-600"></div>
                        <p className="text-green-400 font-bold text-lg">{zoomedItem.votes} Votes</p>
                    </div>
                </div>
            )}
        </div>
    );
}