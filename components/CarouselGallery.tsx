'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // ADDED: Next.js router link
import VoteButton from './VoteButton';

export default function CarouselGallery({ items }: { items: any[] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    const nextImage = () => setCurrentIndex((prev) => (prev + 1) % items.length);
    const prevImage = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') setIsZoomed(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items.length]);

    if (!items || items.length === 0) return <div className="p-8 text-white">No images found.</div>;

    const currentItem = items[currentIndex];
    const vicostoneUrl = currentItem.productId ? `https://us.vicostone.com/product/${currentItem.productId}` : '#';

    return (
        <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden">

            {/* Top Header */}
            <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-800 shadow-md z-10 flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-200">Kitchen Counter Options</h1>

                {/* ADDED: View Rankings Link & Image Counter */}
                <div className="flex items-center gap-6">
                    {isZoomed && <span className="text-sm bg-gray-800 px-2 py-1 rounded text-gray-300 hidden md:block">Press ESC or click image to exit</span>}

                    <Link
                        href="/leaderboard"
                        className="text-sm font-bold text-gray-900 bg-gray-200 hover:bg-white px-4 py-2 rounded transition-colors"
                    >
                        View Rankings 🏆
                    </Link>

                    <div className="text-gray-400 font-mono hidden sm:block">
                        {currentIndex + 1} <span className="opacity-50">/</span> {items.length}
                    </div>
                </div>
            </div>

            {/* Main Gallery Area */}
            <div className="flex-grow flex relative overflow-hidden justify-center items-center">

                <button
                    onClick={prevImage}
                    className="absolute left-0 top-0 bottom-0 w-12 md:w-20 z-20 flex items-center justify-center bg-gradient-to-r from-gray-950/90 to-transparent hover:from-gray-900 transition-all group"
                >
                    <span className="text-4xl text-gray-600 group-hover:text-white transition-colors">‹</span>
                </button>

                <div className={`w-full ${isZoomed ? 'max-w-[95vw] h-[85vh]' : 'max-w-7xl h-full max-h-[80vh]'} flex flex-col lg:flex-row p-4 lg:p-8 gap-6 z-10 items-center justify-center transition-all duration-300`}>

                    {!isZoomed && (
                        <div className="w-full lg:w-1/4 h-48 lg:h-[70vh] relative rounded-xl border border-gray-800 shadow-2xl bg-gray-900 flex-shrink-0 p-4 transition-all">
                            <Image
                                src={`/mockups/counters/${currentItem.originalFile}`}
                                alt="Swatch"
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
                    )}

                    <div
                        onClick={() => setIsZoomed(!isZoomed)}
                        className={`w-full ${isZoomed ? 'lg:w-full h-full cursor-zoom-out' : 'lg:w-3/4 h-64 lg:h-[70vh] cursor-zoom-in'} relative rounded-xl overflow-hidden border border-gray-800 shadow-2xl bg-black flex-shrink-0 transition-all duration-300 group`}
                    >
                        <Image
                            src={`/mockups/renders/${currentItem.renderFile}`}
                            alt="Mockup"
                            fill
                            style={{ objectFit: 'contain' }}
                            sizes={isZoomed ? "100vw" : "(max-width: 1024px) 100vw, 75vw"}
                            priority
                        />
                        <div className="absolute top-3 left-3 bg-black/80 text-gray-200 text-xs font-bold px-3 py-1.5 rounded tracking-widest uppercase backdrop-blur-sm z-10 transition-opacity duration-300">
                            Mockup Render
                        </div>
                    </div>

                </div>

                <button
                    onClick={nextImage}
                    className="absolute right-0 top-0 bottom-0 w-12 md:w-20 z-20 flex items-center justify-center bg-gradient-to-l from-gray-950/90 to-transparent hover:from-gray-900 transition-all group"
                >
                    <span className="text-4xl text-gray-600 group-hover:text-white transition-colors">›</span>
                </button>
            </div>

            {/* Bottom Action Bar */}
            <div className="bg-gray-900 border-t border-gray-800 p-4 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 z-10 flex-shrink-0">
                <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-100">{currentItem.displayName}</h2>
                    {currentItem.productId && (
                        <a
                            href={vicostoneUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                            View Slab Specs ↗
                        </a>
                    )}
                </div>

                <VoteButton
                    key={currentItem.originalFile}
                    imageId={currentItem.originalFile}
                    initialVotes={currentItem.votes}
                />
            </div>

        </div>
    );
}