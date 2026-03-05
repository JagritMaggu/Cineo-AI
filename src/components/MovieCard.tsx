'use client';

import { memo, useMemo } from 'react';
import { Movie } from '@/types/movie';
import { Star } from 'lucide-react';

interface MovieCardProps {
    movie: Movie;
    onSearchOpen?: () => void;
}

const MovieCard = memo(function MovieCard({ movie }: MovieCardProps) {
    const genreTags = useMemo(
        () => movie.genre.split(',').map(g => g.trim()).filter(Boolean),
        [movie.genre]
    );

    const marqueeCast = useMemo(() => {
        if (!movie.fullCast?.length) return [];
        let arr = [...movie.fullCast];
        while (arr.length < 20) arr = [...arr, ...movie.fullCast];
        return [...arr, ...arr, ...arr, ...arr];
    }, [movie.fullCast]);

    const hasFullCast = !!movie.fullCast?.length;

    // High-resolution poster extraction (stripping OMDb SX300/SX400 suffixes)
    const poster = useMemo(() => {
        if (!movie.poster || movie.poster === 'N/A') return '/placeholder-poster.png';
        // If it's an IMDb/OMDb URL, strip the scaling suffix to get the master file
        if (movie.poster.includes('._V1_')) {
            return movie.poster.split('._V1_')[0] + '._V1_.jpg';
        }
        return movie.poster;
    }, [movie.poster]);

    return (
        <article className="animate-fade-up w-full bg-[#080808]">

            {/* ── 1. Immersive Centered Hero (Inspired by Netflix/Chernobyl style) ── */}
            <div className="relative w-full h-[100svh] overflow-hidden flex flex-col items-center justify-end">

                {/* Layer 1: Atmospheric Background (Ambient Glow) */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={poster}
                        alt=""
                        className="w-full h-full object-cover blur-[100px] opacity-40 scale-150 saturate-[1.5]"
                    />
                </div>

                {/* Layer 2: Centered Master Poster (Zero-Crop) */}
                <div className="relative z-10 w-full h-full flex items-center justify-center pt-10 pb-40">
                    <div className="relative h-full max-h-[85vh] aspect-[2/3] group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={poster}
                            alt={movie.title}
                            className="w-full h-full object-contain shadow-[0_0_120px_rgba(0,0,0,0.8)] rounded-sm"
                        />

                        {/* Layer 3: The "Merge" Effect — Left & Right Gradient Blurs */}
                        <div className="absolute inset-y-0 -left-40 w-40 z-20 bg-gradient-to-r from-transparent via-[#080808]/40 to-transparent blur-3xl pointer-events-none" />
                        <div className="absolute inset-y-0 -right-40 w-40 z-20 bg-gradient-to-l from-transparent via-[#080808]/40 to-transparent blur-3xl pointer-events-none" />
                    </div>
                </div>

                {/* Layer 4: Global Atmospheric Gradients */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-transparent" />
                <div className="absolute inset-y-0 left-0 w-1/4 z-20 bg-gradient-to-r from-[#080808]/80 to-transparent" />
                <div className="absolute inset-y-0 right-0 w-1/4 z-20 bg-gradient-to-l from-[#080808]/80 to-transparent" />

                {/* Layer 5: Hero Content Overlay */}
                <div className="relative z-30 w-full max-w-screen-2xl mx-auto px-6 md:px-20 pb-16 md:pb-24">
                    <div className="flex flex-col gap-6 max-w-4xl">

                        {/* Meta row with rating */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/20 backdrop-blur-xl px-3.5 py-2 rounded text-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.1)]">
                                <Star size={12} className="fill-yellow-400" />
                                <span className="text-sm font-black tracking-widest">{movie.rating}</span>
                                <span className="text-[10px] opacity-40 font-bold uppercase ml-1">IMDb</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">{movie.year}</span>
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">{movie.runtime}</span>
                        </div>

                        <h2 className="text-[clamp(3rem,8vw,7rem)] font-black tracking-[-0.04em] leading-[0.85] text-white uppercase drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
                            {movie.title}
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            {genreTags.map(g => (
                                <span key={g} className="text-[9px] font-black uppercase tracking-[0.5em] text-white/30 border border-white/5 bg-white/[0.04] px-4 py-2 rounded-sm backdrop-blur-md">
                                    {g}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 2. Detailed Plot & Cast Section ── */}
            <div className="max-w-screen-2xl mx-auto px-6 md:px-20 py-24 bg-[#080808] relative z-40">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    <div className="lg:col-span-12">
                        <div className="flex items-center gap-5 mb-12">
                            <div className="w-16 h-px bg-white/5" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.7em] text-white/15 whitespace-nowrap">Cinematic Narrative</h3>
                            <div className="flex-1 h-px bg-white/5" />
                        </div>

                        <p className="text-white/50 text-xl md:text-3xl leading-[1.8] md:leading-[2] font-light tracking-wide max-w-6xl">
                            {movie.plot}
                        </p>

                        {!hasFullCast && movie.cast && (
                            <p className="mt-12 text-white/20 text-base italic border-l-2 border-white/5 pl-8 max-w-4xl">{movie.cast}</p>
                        )}
                    </div>
                </div>

                {/* ── Ensemble Marquee ── */}
                {hasFullCast && (
                    <div className="mt-40 relative group">
                        <div className="flex items-center gap-5 mb-16">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/15">The Global Ensemble</h3>
                            <div className="flex-1 h-px bg-white/[0.03]" />
                        </div>

                        <div className="relative -mx-6 md:-mx-20 overflow-hidden">
                            <div className="absolute inset-y-0 left-0 w-32 md:w-72 z-10 pointer-events-none bg-gradient-to-r from-[#080808] via-[#080808]/80 to-transparent" />
                            <div className="absolute inset-y-0 right-0 w-32 md:w-72 z-10 pointer-events-none bg-gradient-to-l from-[#080808] via-[#080808]/80 to-transparent" />

                            <div className="animate-marquee flex items-center gap-8 md:gap-14 whitespace-nowrap py-10">
                                {marqueeCast.map((member, i) => (
                                    <div key={i} className="flex items-center gap-6 shrink-0 group/member cursor-pointer">
                                        <div className="w-20 h-20 md:w-24 md:h-24 overflow-hidden bg-white/[0.02] shrink-0 rounded-full ring-1 ring-white/5 p-1 transition-all duration-500 group-hover/member:ring-white/20 group-hover/member:scale-105">
                                            <div className="w-full h-full rounded-full overflow-hidden">
                                                {member.image
                                                    ? <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale opacity-50 group-hover/member:grayscale-0 group-hover/member:opacity-100 transition-all duration-700" />
                                                    : <div className="w-full h-full flex items-center justify-center text-sm font-black text-white/10 uppercase bg-white/[0.03]">{member.name[0]}</div>
                                                }
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-xs md:text-sm font-black text-white/40 group-hover/member:text-white transition-all duration-300 uppercase tracking-[0.15em]">{member.name}</p>
                                            <p className="text-[10px] text-white/15 uppercase tracking-[0.3em] mt-1.5 group-hover/member:text-white/40 transition-all">{member.role || 'Performer'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
});

export default MovieCard;
