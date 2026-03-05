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

    const hasFullCast = !!movie.fullCast?.length;

    const poster = useMemo(() => {
        if (!movie.poster || movie.poster === 'N/A') return '/placeholder-poster.png';
        if (movie.poster.includes('._V1_')) {
            return movie.poster.split('._V1_')[0] + '._V1_.jpg';
        }
        return movie.poster;
    }, [movie.poster]);

    const marqueeCast = useMemo(() => {
        if (!movie.fullCast?.length) return [];
        let arr = [...movie.fullCast];
        while (arr.length < 20) arr = [...arr, ...movie.fullCast];
        return [...arr, ...arr];
    }, [movie.fullCast]);

    return (
        <article className="w-full bg-[#080808] h-[100svh] text-white relative overflow-hidden flex flex-col">

            {/* ── 1. The Cinematic Backdrop (Ambient Cineo Glow) ── */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.2] overflow-hidden">
                <img
                    src={poster}
                    alt=""
                    className="w-full h-full object-cover blur-[140px] scale-150 saturate-[1.3]"
                />
            </div>

            {/* ── 2. The Fluid 100vh Dashboard (Inspired by Lucifer/Netflix Layout) ── */}
            <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 md:px-20 flex-1 flex flex-col justify-center">

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-24 items-center">

                    {/* Left side: The Narrative & Meta (Cineo Theme) */}
                    <div className="flex-1 text-center lg:text-left order-2 lg:order-1">

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                            <div className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/20 backdrop-blur-xl px-4 py-2 rounded text-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.05)]">
                                <Star size={13} className="fill-yellow-400" />
                                <span className="text-sm font-black tracking-widest leading-none">{movie.rating}</span>
                                <span className="text-[10px] opacity-40 font-bold uppercase ml-1">IMDb</span>
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap">{movie.year}</span>
                            <span className="hidden md:block w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-xs font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap">{movie.runtime}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-white uppercase mb-8 max-w-2xl drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            {movie.title}
                        </h1>

                        <p className="text-base md:text-xl lg:text-2xl leading-[1.6] text-white/50 font-light tracking-wide max-w-2xl mb-10">
                            {movie.plot}
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                            {genreTags.map(g => (
                                <span key={g} className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 border border-white/5 bg-white/[0.03] px-3 py-1.5 rounded-sm">
                                    {g}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right side: The Floating Portrait Piece */}
                    <div className="w-full lg:w-auto h-auto max-h-[65vh] flex justify-center order-1 lg:order-2">
                        <div className="relative h-[65vh] aspect-[2/3] rounded-sm overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.9)] border border-white/5 bg-black/40">
                            <img
                                src={poster}
                                alt={movie.title}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* ── 3. The Infinite Global Ensemble (Marquee Section at Bottom) ── */}
            {hasFullCast && (
                <div className="relative z-20 w-full bg-gradient-to-t from-black via-black/40 to-transparent pt-10 pb-10">
                    <div className="max-w-screen-2xl mx-auto px-6 md:px-20">
                        <div className="flex items-center gap-5 mb-6">
                            <h3 className="text-[9px] font-black uppercase tracking-[0.6em] text-white/15 whitespace-nowrap">The Global Ensemble</h3>
                            <div className="flex-1 h-px bg-white/[0.03]" />
                        </div>

                        <div className="relative -mx-6 md:-mx-20 overflow-hidden group">
                            {/* Edge Blurs for smooth blending */}
                            <div className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none bg-gradient-to-r from-black to-transparent" />
                            <div className="absolute inset-y-0 right-0 w-32 z-10 pointer-events-none bg-gradient-to-l from-black to-transparent" />

                            <div className="animate-marquee flex items-center gap-10 md:gap-20 whitespace-nowrap py-4">
                                {marqueeCast.map((member, i) => (
                                    <div key={i} className="flex items-center gap-5 shrink-0 group/member cursor-default">
                                        <div className="w-12 h-12 md:w-16 md:h-16 overflow-hidden bg-white/[0.02] shrink-0 rounded-full ring-1 ring-white/5 p-1 transition-all duration-500">
                                            <div className="w-full h-full rounded-full overflow-hidden">
                                                {member.image
                                                    ? <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
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
            )}

        </article>
    );
});

export default MovieCard;
