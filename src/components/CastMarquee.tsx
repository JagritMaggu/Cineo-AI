'use client';

import { useMemo } from 'react';
import { CastMember } from '@/types/movie';

interface CastMarqueeProps {
    cast?: CastMember[];
    isLoading?: boolean;
}

export default function CastMarquee({ cast, isLoading }: CastMarqueeProps) {
    if (isLoading) {
        return (
            <div className="w-full bg-[#080808] py-20 relative z-20">
                <div className="max-w-screen-2xl mx-auto px-6 md:px-20">
                    <div className="flex items-center gap-5 mb-10 opacity-20">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-white whitespace-nowrap">The Global Ensemble</h3>
                        <div className="flex-1 h-px bg-white/20" />
                    </div>
                    <div className="flex gap-8 md:gap-12 overflow-hidden">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex items-center gap-5 shrink-0 opacity-10 animate-pulse">
                                <div className="w-14 h-14 md:w-20 md:h-20 bg-white/10 rounded-full" />
                                <div className="space-y-2">
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
            <div className="max-w-screen-2xl mx-auto px-6 md:px-20">
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

                <div
                    className="relative -mx-6 md:-mx-20 px-6 md:px-20 overflow-x-auto no-scrollbar pb-8 flex gap-8 md:gap-16 snap-x snap-mandatory"
                >
                    {cast.map((member, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-6 shrink-0 snap-start cursor-default transition-all duration-500"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border border-white/5 bg-white/[0.02] relative z-10 transition-colors duration-500">
                                    {member.image ? (
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover grayscale-[0.2] transition-all duration-700 ease-out"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-lg font-black text-white/10 uppercase">
                                            {member.name[0]}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1.5 transition-colors duration-500">Artist</span>
                                <p className="text-sm md:text-lg font-black text-white/60 uppercase tracking-[0.1em] transition-colors duration-500 mb-1">{member.name}</p>
                                <p className="text-[10px] md:text-[11px] text-white/10 uppercase tracking-[0.2em] font-medium transition-colors duration-500">{member.role || 'Principal Cast'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
