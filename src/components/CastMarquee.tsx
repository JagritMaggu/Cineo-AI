'use client';

import { useMemo, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { CastMember } from '@/types/movie';

interface CastMarqueeProps {
    cast?: CastMember[];
    isLoading?: boolean;
}

export default function CastMarquee({ cast, isLoading }: CastMarqueeProps) {

    // Duplicate the cast array to create enough runway for seamless continuous loop
    const extendedCast = useMemo(() => {
        if (!cast || cast.length === 0) return [];
        // We use 4 repetitions to ensure a smooth 100% -> 0% loop with the CSS animation
        return [...cast, ...cast, ...cast, ...cast];
    }, [cast]);

    if (isLoading) {
        return (
            <div className="w-full bg-[#080808] py-20 relative z-20">
                <div className="max-w-[1720px] mx-auto px-6 md:px-20">
                    <div className="flex items-center justify-center mb-12">
                        <div className="flex items-center gap-6 flex-1 opacity-20">
                            <div className="flex-1 h-px bg-white/20" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] lg:tracking-[0.8em] text-white whitespace-nowrap">The Global Ensemble</h3>
                            <div className="flex-1 h-px bg-white/20" />
                        </div>
                    </div>

                    <div className="relative overflow-hidden">
                        {/* ── 1. Edge Blurs for Skeleton ── */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-48 bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent z-40 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-48 bg-gradient-to-l from-[#080808] via-[#080808]/80 to-transparent z-40 pointer-events-none" />

                        <div
                            className="flex gap-8 md:gap-16 p-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] md:[-webkit-mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="flex flex-col gap-6 shrink-0 opacity-10 animate-pulse w-[160px] md:w-[220px]">
                                    <div className="aspect-[2/3] w-full bg-[#0f0f0f] rounded-sm border border-white/5" />
                                    <div className="space-y-3 px-1">
                                        <div className="w-2/3 h-2 bg-white/20 rounded-full" />
                                        <div className="w-1/2 h-1.5 bg-white/10 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!cast || cast.length === 0) return null;

    return (
        <section className="w-full bg-[#080808] py-20 relative z-20 border-t border-white/[0.02]">
            <div className="max-w-[1720px] mx-auto px-6 md:px-20">
                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center gap-6 flex-1">
                        <div className="flex-1 h-px bg-gradient-to-l from-white/[0.05] to-transparent md:hidden" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] lg:tracking-[0.8em] text-white/40 whitespace-nowrap">The Global Ensemble</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-white/[0.05] to-transparent" />
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                        <span>Continuous Gallery</span>
                        <div className="w-10 h-px bg-white/10" />
                    </div>
                </div>

                <div className="relative overflow-hidden">
                    {/* ── 1. Edge Blurs (Gradient Overlays) ── */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 md:w-64 bg-gradient-to-r from-[#080808] via-[#080808] to-transparent z-40 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 md:w-64 bg-gradient-to-l from-[#080808] via-[#080808] to-transparent z-40 pointer-events-none" />

                    <div
                        className="flex gap-8 md:gap-16 p-1 animate-marquee [mask-image:linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)] md:[mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)] md:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)]"
                    >
                        {extendedCast.map((member, i) => (
                            <div
                                key={`${member.name}-${i}`}
                                className="flex flex-col gap-6 shrink-0 cursor-default w-[160px] md:w-[220px]"
                            >
                                <div className="relative aspect-[2/3] w-full rounded-sm overflow-hidden border border-white/5 bg-[#0f0f0f]">
                                    {member.image ? (
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            unoptimized
                                            className="object-cover grayscale-[0.2] pointer-events-none"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white/10 uppercase bg-[#0f0f0f]">
                                            {member.name[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col px-1">
                                    <p className="text-[10px] md:text-sm font-black text-white/80 uppercase tracking-wider mb-1 line-clamp-1">{member.name}</p>
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
