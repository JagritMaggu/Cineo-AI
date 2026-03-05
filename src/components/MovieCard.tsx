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
    const hasPoster = movie.poster && movie.poster !== 'N/A';

    return (
        <article className="animate-fade-up w-full bg-[#080808]">

            {/* ── 1. Poster at the Top ── */}
            {hasPoster && (
                <div className="relative w-full overflow-hidden" style={{ height: 'clamp(300px, 65vh, 750px)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover object-top"
                    />
                    {/* Cinematic bottom fade to blend with title section */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-100" />
                </div>
            )}

            {/* ── Content Container ── */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16">

                {/* ── 2. Movie Name and Rating Side by Side ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="flex-1">
                        <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-black tracking-tighter leading-[0.9] text-white uppercase break-words">
                            {movie.title}
                        </h2>
                    </div>

                    <div className="shrink-0 flex items-center gap-3 bg-white/[0.03] border border-white/10 px-6 py-4 rounded-xl backdrop-blur-md">
                        <Star size={24} className="fill-yellow-400 text-yellow-400 shrink-0" />
                        <div className="flex flex-col">
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-white leading-none">{movie.rating}</span>
                                <span className="text-xs text-white/30 font-bold uppercase tracking-widest">/10</span>
                            </div>
                            <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-1">Global Rating</span>
                        </div>
                    </div>
                </div>

                {/* Meta details */}
                <div className="flex items-center gap-4 mb-10 overflow-x-auto no-scrollbar whitespace-nowrap">
                    <span className="text-xs text-white/40 font-bold uppercase tracking-[0.2em]">{movie.year}</span>
                    <span className="w-px h-4 bg-white/10 shrink-0" />
                    <span className="text-xs text-white/40 font-bold uppercase tracking-[0.2em]">{movie.runtime}</span>
                    <span className="w-px h-4 bg-white/10 shrink-0" />
                    <div className="flex gap-2">
                        {genreTags.map(g => (
                            <span key={g} className="text-[10px] font-black uppercase tracking-widest text-white/60 border border-white/10 bg-white/5 px-3 py-1 rounded-full">
                                {g}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── 3. Movie Description ── */}
                <div className="max-w-4xl mb-20 lg:mb-32">
                    <p className="text-white/60 text-lg md:text-xl leading-relaxed md:leading-[2.2] font-light tracking-wide">
                        {movie.plot}
                    </p>
                    {!hasFullCast && movie.cast && (
                        <p className="mt-8 text-white/30 text-sm italic tracking-wide">{movie.cast}</p>
                    )}
                </div>

                {/* ── 4. Cast ── */}
                {hasFullCast && (
                    <div className="relative group">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">The Ensemble</h3>
                            <div className="hidden md:block h-px flex-1 mx-8 bg-white/5" />
                        </div>

                        <div className="relative -mx-6 md:-mx-12 overflow-hidden">
                            {/* Gradient Masks */}
                            <div className="absolute inset-y-0 left-0 w-24 md:w-44 z-10 pointer-events-none bg-gradient-to-r from-[#080808] to-transparent" />
                            <div className="absolute inset-y-0 right-0 w-24 md:w-44 z-10 pointer-events-none bg-gradient-to-l from-[#080808] to-transparent" />

                            <div className="animate-marquee flex items-center gap-4 md:gap-6 whitespace-nowrap py-4">
                                {marqueeCast.map((member, i) => (
                                    <div key={i} className="flex flex-col items-center gap-3 shrink-0 group/member">
                                        <div className="w-16 h-16 md:w-20 md:h-20 overflow-hidden bg-[#1c1c1c] shrink-0 rounded-full ring-1 ring-white/5 group-hover/member:ring-white/20 transition-all duration-300 transform group-hover/member:scale-105">
                                            {member.image
                                                ? <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                                : <div className="w-full h-full flex items-center justify-center text-xs font-black text-white/15 uppercase">{member.name[0]}</div>
                                            }
                                        </div>
                                        <div className="text-center w-full max-w-[100px]">
                                            <p className="text-[10px] md:text-[11px] font-bold text-white/80 group-hover/member:text-white transition-colors truncate">{member.name}</p>
                                            <p className="text-[8px] md:text-[9px] text-white/25 uppercase tracking-wider mt-1 truncate">{member.role || 'Actor'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ── 5. Reviews at the Bottom — handled in MovieSearch.tsx container ── */}

        </article>
    );
});

export default MovieCard;
