'use client';

import { useMemo, useEffect, useRef, useState } from 'react';
import { CastMember } from '@/types/movie';

interface CastMarqueeProps {
    cast?: CastMember[];
    isLoading?: boolean;
}

export default function CastMarquee({ cast, isLoading }: CastMarqueeProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);

    // Triple the cast array to create enough runway for seamless infinity
    const extendedCast = useMemo(() => {
        if (!cast || cast.length === 0) return [];
        return [...cast, ...cast, ...cast];
    }, [cast]);

    useEffect(() => {
        if (isLoading || !cast || cast.length === 0 || isPaused) return;

        const container = scrollRef.current;
        if (!container) return;

        const interval = setInterval(() => {
            const firstChild = container.firstElementChild as HTMLElement;
            if (!firstChild) return;

            const cardWidth = firstChild.offsetWidth;
            const gap = 64; // md:gap-16
            const scrollStep = cardWidth + gap;

            // Current scrollWidth of exactly one set
            const singleSetWidth = (cardWidth + gap) * cast.length;

            const targetScroll = container.scrollLeft + scrollStep;

            container.scrollTo({ left: targetScroll, behavior: 'smooth' });

            // After the smooth animation finishes (~600ms), check if we need to jump back
            setTimeout(() => {
                if (container.scrollLeft >= singleSetWidth * 2) {
                    container.scrollTo({ left: container.scrollLeft - singleSetWidth, behavior: 'auto' });
                }
            }, 800);

        }, 3500); // 3.5s total: movement + ~1s pause

        return () => clearInterval(interval);
    }, [cast, isLoading, isPaused]);

    if (isLoading) {
        return (
            <div className="w-full bg-[#080808] py-20 relative z-20">
                <div className="max-w-screen-3xl mx-auto px-6 md:px-20">
                    <div className="flex items-center gap-5 mb-10 opacity-20">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-white whitespace-nowrap">The Global Ensemble</h3>
                        <div className="flex-1 h-px bg-white/20" />
                    </div>
                    <div className="flex gap-8 md:gap-16 overflow-hidden">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex items-center gap-5 shrink-0 opacity-10 animate-pulse">
                                <div className="aspect-[2/3] w-[160px] md:w-[220px] bg-white/10 rounded-sm" />
                                <div className="space-y-2 px-1">
                                    <div className="w-24 h-2 bg-white/10 rounded" />
                                    <div className="w-16 h-2 bg-white/10 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!cast || cast.length === 0) return null;

    return (
        <section className="w-full bg-[#080808] py-20 relative z-20 border-t border-white/[0.02]">
            <div className="max-w-[1720px] mx-auto px-6 md:px-20">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-6 flex-1">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.8em] text-white/40 whitespace-nowrap">The Global Ensemble</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-white/[0.05] to-transparent" />
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                        <span>Scroll to Explore</span>
                        <div className="w-10 h-px bg-white/10" />
                    </div>
                </div>

                <div className="relative overflow-hidden">
                    {/* ── 1. True Edge Blurs (Gradient Overlays) ── */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#080808] to-transparent z-40 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#080808] to-transparent z-40 pointer-events-none" />

                    <div
                        ref={scrollRef}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        className="relative overflow-x-auto no-scrollbar pb-8 flex gap-8 md:gap-16 snap-x snap-mandatory p-1"
                        style={{
                            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                        }}
                    >
                        {extendedCast.map((member, i) => (
                            <div
                                key={`${member.name}-${i}`}
                                className="flex flex-col gap-6 shrink-0 snap-start cursor-default transition-all duration-500 w-[160px] md:w-[220px]"
                            >
                                <div className="relative aspect-[2/3] w-full rounded-sm overflow-hidden border border-white/5 bg-white/[0.02]">
                                    {member.image ? (
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover grayscale-[0.2]"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white/10 uppercase bg-[#0f0f0f]">
                                            {member.name[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col px-1">
                                    <p className="text-xs md:text-sm font-black text-white/80 uppercase tracking-wider mb-1 line-clamp-1">{member.name}</p>
                                    <p className="text-[10px] md:text-[11px] text-white/20 uppercase tracking-[0.2em] font-medium line-clamp-1">{member.role || 'Principal Cast'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
