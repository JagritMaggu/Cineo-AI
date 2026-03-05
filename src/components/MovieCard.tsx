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
    const poster = (movie.poster && movie.poster !== 'N/A') ? movie.poster : '/placeholder-poster.png';

    return (
        <article className="animate-fade-up w-full bg-[#080808]">

            {/* ── 1. Immersive Full-Screen Hero (Inspired by Chernobyl UI) ── */}
            <div className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden">

                {/* Layer 1: Blurred Ambient Backdrop (Fills the sides flawlessly) */}
                <div className="absolute inset-0 z-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={poster}
                        alt=""
                        className="w-full h-full object-cover blur-[80px] opacity-40 scale-125"
                    />
                </div>

                {/* Layer 2: Primary Cinematic Poster (Dominates the view without stretching) */}
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={poster}
                        alt={movie.title}
                        className="w-full h-full md:w-auto md:h-[90vh] object-cover md:object-contain object-top shadow-[0_0_100px_rgba(0,0,0,0.8)]"
                    />
                </div>

                {/* Layer 3: Atmospheric Gradients (The 'Secret Sauce' for readability) */}
                {/* Heavy bottom fade */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent" />
                {/* Subtle side vignettes */}
                <div className="absolute inset-y-0 left-0 w-1/3 z-20 bg-gradient-to-r from-[#080808]/60 to-transparent" />
                <div className="absolute inset-y-0 right-0 w-1/3 z-20 bg-gradient-to-l from-[#080808]/60 to-transparent" />

                {/* Layer 4: Hero Content Overlay (Title & Meta positioned like Screenshot 1) */}
                <div className="absolute bottom-0 left-0 right-0 z-30 px-6 md:px-20 pb-16 md:pb-24 max-w-screen-2xl mx-auto">
                    <div className="flex flex-col gap-6 scale-95 origin-bottom-left transition-all hover:scale-100 duration-500">

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
