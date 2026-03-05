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

            {/* ── 1. Immersive Full-Screen Hero (Inspired by Screenshot 1 & 2) ── */}
            <div className="relative w-full h-[100svh] overflow-hidden flex flex-col justify-end">

                {/* Layer 1: Ambient Backdrop (Zero-crop color fill) */}
                <div className="absolute inset-0 z-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={poster}
                        alt=""
                        className="w-full h-full object-cover blur-[120px] opacity-30 brightness-[0.4] scale-150"
                    />
                </div>

                {/* Layer 2: The Main Event — 100% Poster Visibility on the Right */}
                <div className="absolute inset-0 z-10 flex flex-row items-stretch">
                    {/* Left: Empty space for text */}
                    <div className="hidden lg:block w-[45%]" />

                    {/* Right: The full poster, zero cropping */}
                    <div className="w-full lg:w-[55%] relative flex items-center justify-end pr-0 lg:pr-12 xl:pr-32">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={poster}
                            alt={movie.title}
                            className="w-full h-full lg:w-auto lg:h-[95vh] object-cover lg:object-contain object-center lg:object-right shadow-[0_0_150px_rgba(0,0,0,0.9)] transition-all duration-1000"
                        />
                        {/* Feathered side-blend mask (Makes the poster look like it belongs to the BG) */}
                        <div className="absolute inset-0 z-20 hidden lg:block bg-gradient-to-r from-[#080808] via-transparent to-transparent pointer-events-none" />
                    </div>
                </div>

                {/* Layer 3: Atmospheric Overlays */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent" />
                <div className="absolute inset-y-0 left-0 w-full lg:w-1/2 z-20 bg-gradient-to-r from-[#080808] via-[#080808]/70 to-transparent" />

                {/* Layer 4: Content Overlay (Locked to the left) */}
                <div className="relative z-30 px-6 md:px-20 pb-20 md:pb-40 max-w-screen-2xl mx-auto w-full h-full flex flex-col justify-end">
                    <div className="flex flex-col gap-8 max-w-3xl">

                        {/* Rating row chips */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/20 backdrop-blur-xl px-3 py-1.5 rounded text-yellow-400">
                                <Star size={12} className="fill-yellow-400" />
                                <span className="text-sm font-black tracking-widest">{movie.rating}</span>
                                <span className="text-[10px] opacity-50 font-bold uppercase">IMDb</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{movie.year}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{movie.runtime}</span>
                        </div>

                        {/* Epic Title Overlay */}
                        <h2 className="text-[clamp(3.5rem,10vw,8.5rem)] font-black tracking-[-0.04em] leading-[0.85] text-white uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            {movie.title}
                        </h2>

                        {/* Quick Metadata */}
                        <div className="flex flex-wrap gap-2">
                            {genreTags.map(g => (
                                <span key={g} className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 border border-white/5 bg-white/[0.03] px-3 py-1.5 rounded-sm backdrop-blur-md">
                                    {g}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 2. Detailed Plot & Cast Section ── */}
            <div className="max-w-screen-2xl mx-auto px-6 md:px-20 py-20">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

                    {/* Left: Plot Summary */}
                    <div className="lg:col-span-12">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-px bg-white/10" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 whitespace-nowrap">Neural Plot Extraction</h3>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        <p className="text-white/60 text-lg md:text-2xl leading-[1.8] md:leading-[2.2] font-light tracking-wide max-w-5xl">
                            {movie.plot}
                        </p>

                        {!hasFullCast && movie.cast && (
                            <p className="mt-10 text-white/20 text-sm italic border-l border-white/10 pl-6">{movie.cast}</p>
                        )}
                    </div>
                </div>

                {/* ── Ensemble Marquee ── */}
                {hasFullCast && (
                    <div className="mt-32 relative group">
                        <div className="flex items-center gap-4 mb-12">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.55em] text-white/15">The Cinematic Ensemble</h3>
                            <div className="flex-1 h-px bg-white/[0.04]" />
                        </div>

                        <div className="relative -mx-6 md:-mx-20 overflow-hidden">
                            {/* Cinematic Gradient Masks */}
                            <div className="absolute inset-y-0 left-0 w-32 md:w-60 z-10 pointer-events-none bg-gradient-to-r from-[#080808] to-transparent" />
                            <div className="absolute inset-y-0 right-0 w-32 md:w-60 z-10 pointer-events-none bg-gradient-to-l from-[#080808] to-transparent" />

                            <div className="animate-marquee flex items-center gap-6 md:gap-10 whitespace-nowrap py-6">
                                {marqueeCast.map((member, i) => (
                                    <div key={i} className="flex items-center gap-5 shrink-0 group/member cursor-pointer">
                                        <div className="w-16 h-16 md:w-20 md:h-20 overflow-hidden bg-white/[0.02] shrink-0 rounded-full ring-1 ring-white/5 active:scale-95 transition-all duration-300">
                                            {member.image
                                                ? <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale opacity-60 group-hover/member:grayscale-0 group-hover/member:opacity-100 transition-all duration-500" />
                                                : <div className="w-full h-full flex items-center justify-center text-xs font-black text-white/10 uppercase">{member.name[0]}</div>
                                            }
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-[11px] md:text-xs font-bold text-white/60 group-hover/member:text-white transition-colors uppercase tracking-[0.1em]">{member.name}</p>
                                            <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] mt-1 group-hover/member:text-white/40">{member.role || 'Actor'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── 3. Reviews handled globally in MovieSearch.tsx ── */}

        </article>
    );
});

export default MovieCard;
