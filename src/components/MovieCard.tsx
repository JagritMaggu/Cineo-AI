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

    // 4× duplication → -25% = one perfect loop
    const marqueeCast = useMemo(() => {
        if (!movie.fullCast?.length) return [];
        let arr = [...movie.fullCast];
        // Ensure at least 20 unique slots so marquee fills any screen
        while (arr.length < 20) arr = [...arr, ...movie.fullCast];
        return [...arr, ...arr, ...arr, ...arr];
    }, [movie.fullCast]);

    const hasFullCast = !!movie.fullCast?.length;
    const poster = movie.poster !== 'N/A' ? movie.poster : 'https://placehold.co/400x600/111/222?text=No+Poster';

    return (
        <article className="animate-fade-up w-full">

            {/* ═══════════════════════════
                MOBILE  — poster fills 100svh
            ═══════════════════════════ */}
            <div className="block md:hidden">

                {/* Full-bleed poster hero */}
                <div className="relative w-full" style={{ height: '100svh', minHeight: '600px' }}>

                    {/* Poster — fills the whole hero */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={poster}
                        alt={movie.title}
                        className="absolute inset-0 w-full h-full object-cover object-top animate-ken-burns"
                    />

                    {/* Gradient overlays */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #080808 0%, #080808 10%, rgba(8,8,8,0.4) 50%, rgba(8,8,8,0.2) 100%)' }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,8,8,0.5) 0%, transparent 20%)' }} />

                    {/* Rating chip  */}
                    <div className="absolute top-5 left-5 flex items-center gap-1.5 bg-black/55 backdrop-blur-md px-2.5 py-1.5 rounded-md border border-yellow-400/20">
                        <Star size={11} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-black text-yellow-400">{movie.rating}</span>
                    </div>

                    {/* Bottom overlay — title */}
                    <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-16">
                        {/* Genres */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {genreTags.slice(0, 3).map(g => (
                                <span key={g} className="text-[9px] font-black uppercase tracking-wider text-blue-300 border border-blue-500/35 bg-blue-500/15 px-2 py-0.5 rounded-sm">
                                    {g}
                                </span>
                            ))}
                        </div>

                        <h2 className="text-[2.4rem] font-black tracking-tighter leading-none text-white uppercase mb-2">
                            {movie.title}
                        </h2>

                        <div className="flex items-center gap-3 text-white/40">
                            <span className="text-[10px] font-bold uppercase tracking-widest">{movie.year}</span>
                            <span className="w-px h-3 bg-white/20" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{movie.runtime}</span>
                        </div>
                    </div>
                </div>

                {/* Content below hero */}
                <div className="px-5 pt-7 pb-4 bg-[#080808]">
                    <p className="text-white/50 text-sm leading-relaxed font-light mb-8">{movie.plot}</p>

                    {/* Cast marquee */}
                    {hasFullCast && (
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mb-4">Cast</p>
                            <div className="relative -mx-5 overflow-hidden">
                                <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #080808 20%, transparent)' }} />
                                <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #080808 20%, transparent)' }} />
                                <div className="animate-marquee flex items-start gap-4 px-5 py-1">
                                    {marqueeCast.map((member, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 w-[68px]">
                                            <div className="w-12 h-12 overflow-hidden bg-[#1c1c1c] shrink-0 rounded-full ring-1 ring-white/5">
                                                {member.image
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    ? <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                                    : <div className="w-full h-full flex items-center justify-center text-sm font-black text-white/15">{member.name[0]}</div>
                                                }
                                            </div>
                                            <p className="text-[9px] font-semibold text-white/60 text-center leading-tight line-clamp-2 w-full">{member.name}</p>
                                            <p className="text-[8px] text-white/25 text-center uppercase tracking-wide line-clamp-1 w-full">{member.role || 'Actor'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════════════════════════
                DESKTOP — split hero layout
                Left 48%: info panel
                Right 52%: floating poster
            ═══════════════════════════ */}
            <div className="hidden md:flex flex-col">

                {/* Hero split */}
                <div className="relative overflow-hidden" style={{ minHeight: 'calc(100vh - 60px)' }}>

                    {/* Full-bleed blurred background */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={poster}
                        alt=""
                        aria-hidden
                        className="absolute inset-0 w-full h-full object-cover object-center scale-125 blur-3xl opacity-[0.12] animate-ken-burns"
                    />
                    {/* Directional gradients */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, #080808 42%, rgba(8,8,8,0.75) 65%, rgba(8,8,8,0.1) 100%)' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />

                    {/* Content row */}
                    <div className="relative flex items-center h-full" style={{ minHeight: 'calc(100vh - 60px)' }}>

                        {/* ── Info Panel ── */}
                        <div className="flex-1 px-10 xl:px-16 py-14 max-w-[52%]">

                            {/* Rating + meta row */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center gap-1.5">
                                    <Star size={15} className="fill-yellow-400 text-yellow-400" />
                                    <span className="text-lg font-black text-white leading-none">{movie.rating}</span>
                                    <span className="text-xs text-white/25 font-medium">/10</span>
                                </div>
                                <span className="w-px h-5 bg-white/10" />
                                <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{movie.year}</span>
                                <span className="w-px h-5 bg-white/10" />
                                <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{movie.runtime}</span>
                            </div>

                            {/* Title */}
                            <h2 className="text-[clamp(3rem,6vw,5.5rem)] font-black tracking-[-0.04em] leading-[0.88] text-white uppercase mb-5">
                                {movie.title}
                            </h2>

                            {/* Genre pills — bright blue accents */}
                            <div className="flex flex-wrap gap-2 mb-7">
                                {genreTags.map(g => (
                                    <span key={g} className="text-[10px] font-black uppercase tracking-wider text-blue-300 border border-blue-500/30 bg-blue-500/10 px-3 py-1 rounded-sm">
                                        {g}
                                    </span>
                                ))}
                            </div>

                            {/* Plot */}
                            <p className="text-white/45 text-[0.92rem] leading-relaxed font-light max-w-[480px]">
                                {movie.plot}
                            </p>

                            {/* Fallback cast text */}
                            {!hasFullCast && movie.cast && (
                                <p className="mt-6 text-white/25 text-sm italic">{movie.cast}</p>
                            )}
                        </div>

                        {/* ── Poster ── */}
                        <div className="shrink-0 flex items-center justify-center pr-10 xl:pr-16 py-10">
                            <div className="relative" style={{ height: 'min(78vh, 560px)', aspectRatio: '2/3' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={poster}
                                    alt={movie.title}
                                    className="w-full h-full object-cover rounded-xl"
                                    style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.07), -24px 0 64px rgba(0,0,0,0.5)' }}
                                />
                                {/* Blue glow hint on poster edge */}
                                <div className="absolute -inset-px rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                    style={{ boxShadow: '0 0 40px rgba(59,130,246,0.15)' }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Full Cast Marquee ── */}
                {hasFullCast && (
                    <div className="relative overflow-hidden border-t border-white/[0.05] bg-[#080808] py-7">
                        <p className="text-[9px] font-black uppercase tracking-[0.45em] text-white/18 px-10 mb-5">Full Cast</p>

                        {/* Masks */}
                        <div className="absolute inset-y-0 left-0 w-44 z-10 pointer-events-none"
                            style={{ background: 'linear-gradient(to right, #080808 20%, transparent)' }} />
                        <div className="absolute inset-y-0 right-0 w-44 z-10 pointer-events-none"
                            style={{ background: 'linear-gradient(to left, #080808 20%, transparent)' }} />

                        <div className="animate-marquee flex items-center gap-2.5 whitespace-nowrap">
                            {marqueeCast.map((member, i) => (
                                <div key={i} className="flex items-center gap-3.5 shrink-0 bg-white/[0.025] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-200 px-4 py-3 rounded-md cursor-default group">
                                    <div className="w-10 h-10 overflow-hidden bg-[#1c1c1c] shrink-0 rounded-full ring-1 ring-white/6 group-hover:ring-white/12 transition-all">
                                        {member.image
                                            // eslint-disable-next-line @next/next/no-img-element
                                            ? <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full flex items-center justify-center text-xs font-black text-white/15">{member.name[0]}</div>
                                        }
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold text-white/75 whitespace-nowrap group-hover:text-white/90 transition-colors">{member.name}</p>
                                        <p className="text-[9px] text-white/25 uppercase tracking-wider mt-0.5 whitespace-nowrap">{member.role || 'Actor'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </article>
    );
});

export default MovieCard;
