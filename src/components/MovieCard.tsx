'use client';

import { memo, useMemo } from 'react';
import { Movie } from '@/types/movie';
import { Star, ArrowLeft } from 'lucide-react';

interface MovieCardProps {
    movie: Movie;
    onSearchOpen?: () => void;
    onBack?: () => void;
}

const MovieCard = memo(function MovieCard({ movie, onBack }: MovieCardProps) {
    const genreTags = useMemo(
        () => movie.genre.split(',').map(g => g.trim()).filter(Boolean),
        [movie.genre]
    );

    const poster = useMemo(() => {
        if (!movie.poster || movie.poster === 'N/A') return '/placeholder-poster.png';
        if (movie.poster.includes('._V1_')) {
            return movie.poster.split('._V1_')[0] + '._V1_.jpg';
        }
        return movie.poster;
    }, [movie.poster]);

    return (
        <article className="w-full bg-[#080808] h-[100svh] text-white relative overflow-hidden flex flex-col">

            {/* ── 1. The Cinematic Backdrop (Ambient Cineo Glow) ── */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.25] overflow-hidden">
                <img
                    src={poster}
                    alt=""
                    className="w-full h-full object-cover blur-[160px] scale-150 saturate-[1.3]"
                />
            </div>

            {/* ── 2. The Fluid 100vh Dashboard (Inspired by Lucifer/Netflix Layout) ── */}
            <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 md:px-20 flex-1 flex flex-col justify-center">

                {/* Back Button */}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="absolute top-8 left-6 md:left-20 text-white/30 hover:text-white/60 transition-colors flex items-center gap-2 group z-50 p-2"
                    >
                        <ArrowLeft size={20} strokeWidth={1.5} />
                    </button>
                )}

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-24 items-center lg:items-end">

                    {/* Left side: The Narrative & Meta (Cineo Theme) */}
                    <div className="flex-1 text-center lg:text-left order-2 lg:order-1">

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                            <div className={`flex items-center gap-1.5 border backdrop-blur-xl px-4 py-2 rounded shadow-[0_0_20px_rgba(250,204,21,0.05)] ${movie.rating === 'N/A' ? 'bg-white/5 border-white/10 text-white/40' : 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400'}`}>
                                <Star size={13} className={movie.rating === 'N/A' ? 'fill-white/10' : 'fill-yellow-400'} />
                                <span className="text-sm font-black tracking-widest leading-none">
                                    {movie.rating === 'N/A' ? 'TBD' : movie.rating}
                                </span>
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

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                            {genreTags.map(g => (
                                <span key={g} className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70 border border-white/10 bg-white/[0.08] px-4 py-2 rounded-md shadow-sm">
                                    {g}
                                </span>
                            ))}
                        </div>

                        {/* Top Billed OMDb Cast */}
                        {movie.cast && movie.cast !== 'N/A' && (
                            <div className="mt-10 lg:mt-12 flex flex-col items-center lg:items-start">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-px bg-yellow-400/40" />
                                    <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-yellow-400/70 whitespace-nowrap">Lead Performers</h3>
                                </div>
                                <p className="text-sm md:text-base text-white/70 font-medium tracking-widest text-center lg:text-left leading-relaxed">
                                    {movie.cast.split(',').map((actor, idx, arr) => (
                                        <span key={idx}>
                                            <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{actor.trim()}</span>
                                            {idx < arr.length - 1 && <span className="text-white/20 mx-2">•</span>}
                                        </span>
                                    ))}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right side: The Floating Portrait Piece */}
                    <div className="w-full lg:w-auto h-auto max-h-[85vh] flex justify-center order-1 lg:order-2 lg:translate-y-4">
                        <div className="relative h-[85vh] aspect-[2/3] rounded-sm overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)] border border-white/5 bg-black/40">
                            <img
                                src={poster}
                                alt={movie.title}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Seamless Bottom Merge Gradient ── */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#080808] to-transparent z-20 pointer-events-none" />
        </article>
    );
});

export default MovieCard;
