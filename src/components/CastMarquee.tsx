'use client';

import { useMemo } from 'react';
import { CastMember } from '@/types/movie';

interface CastMarqueeProps {
    cast?: CastMember[];
    isLoading?: boolean;
}

export default function CastMarquee({ cast, isLoading }: CastMarqueeProps) {
    const marqueeCast = useMemo(() => {
        if (!cast?.length) return [];
        let arr = [...cast];
        while (arr.length < 20) arr = [...arr, ...cast];
        return [...arr, ...arr];
    }, [cast]);

    if (isLoading) {
        return (
            <div className="w-full bg-[#080808] py-14 relative z-20 flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full border border-white/5 relative mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-t border-white/40 animate-spin-fast" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 animate-pulse text-center">
                    Fetching Global Ensemble
                </p>
            </div>
        );
    }

    if (!cast || cast.length === 0) return null;

    return (
        <div className="w-full bg-[#080808] py-10 relative z-20 overflow-hidden">
            <div className="max-w-screen-2xl mx-auto px-6 md:px-20">
                <div className="flex items-center gap-5 mb-8">
                    <h3 className="text-[9px] font-black uppercase tracking-[0.6em] text-white/40 whitespace-nowrap">The Global Ensemble</h3>
                    <div className="flex-1 h-px bg-white/[0.03]" />
                </div>

                <div
                    className="relative -mx-6 md:-mx-20 overflow-hidden group"
                    style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
                >
                    <div className="animate-marquee flex items-center gap-10 md:gap-20 whitespace-nowrap py-4">
                        {marqueeCast.map((member, i) => (
                            <div key={i} className="flex items-center gap-5 shrink-0 group/member cursor-default">
                                <div className="w-12 h-12 md:w-16 md:h-16 overflow-hidden bg-white/[0.02] shrink-0 rounded-full">
                                    <div className="w-full h-full rounded-full overflow-hidden">
                                        {member.image
                                            ? <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-white/10 uppercase bg-white/[0.03]">{member.name[0]}</div>
                                        }
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.1em]">{member.name}</p>
                                    <p className="text-[9px] text-white/10 uppercase tracking-[0.2em] mt-1">{member.role || 'Performer'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
