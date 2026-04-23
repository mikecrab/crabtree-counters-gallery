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
                        <div key={item.originalFile} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden flex flex-col relative group">

                            {/* Rank and Vote Badges */}
                            <div className="absolute top-3 left-3 z-10 bg-black/80 text-white font-bold px-3 py-1 rounded-full border border-gray-700 backdrop-blur-sm">
                                #{index + 1}
                            </div>
                            <div className="absolute top-3 right-3 z-10 bg-green-600/90 text-white font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                                {item.votes} {item.votes === 1 ? 'Vote' : 'Votes'}
                            </div>

                            {/* Clickable Thumbnail (Uses cover to keep grid uniform) */}
                            <div
                                onClick={() => setZoomedItem(item)}
                                className="relative w-full h-64 cursor-zoom-in overflow-hidden"
                            >
                                <Image
                                    src={`/mockups/renders/${item.renderFile}`}
                                    alt={item.displayName}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="group-hover:scale-105 transition-transform duration-500"
                                />
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

            {/* Full-Screen Zoom Modal (Uses contain to show entire image) */}
            {zoomedItem && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out backdrop-blur-sm"
                    onClick={() => setZoomedItem(null)}
                >
                    <div className="absolute top-4 right-4 text-gray-400 font-mono bg-gray-900 border border-gray-800 px-3 py-1 rounded text-sm z-50">
                        Press ESC or click anywhere to close
                    </div>

                    <div className="relative w-full max-w-[95vw] h-[90vh]">
                        <Image
                            src={`/mockups/renders/${zoomedItem.renderFile}`}
                            alt={zoomedItem.displayName}
                            fill
                            style={{ objectFit: 'contain' }}
                            sizes="100vw"
                            priority
                        />
                    </div>

                    <div className="absolute bottom-6 left-6 text-white bg-black/80 px-4 py-2 rounded-lg border border-gray-700 backdrop-blur-md">
                        <h2 className="text-xl font-bold">{zoomedItem.displayName}</h2>
                        <p className="text-green-400 font-bold">{zoomedItem.votes} Votes</p>
                    </div>
                </div>
            )}
        </div>
    );
}