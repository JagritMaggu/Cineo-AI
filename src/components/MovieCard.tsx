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

    const starsDisplay = useMemo(() => {
        if (hasFullCast) {
            return movie.fullCast.slice(0, 5).map(c => c.name).join(', ');
        }
        return movie.cast;
    }, [hasFullCast, movie.fullCast, movie.cast]);

    return (
        <article className="w-full bg-[#080808] min-h-screen text-white relative overflow-hidden">

            {/* ── 1. The Cinematic Backdrop (Ambient Cineo Glow) ── */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.15] overflow-hidden">
                <img
                    src={poster}
                    alt=""
                    className="w-full h-full object-cover blur-[140px] scale-150 saturate-[1.2]"
                />
            </div>

            {/* ── 2. The Multi-Column Profile ── */}
            <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 md:px-20 py-20 lg:py-40">

                <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-center lg:items-start text-center lg:text-left">

                    {/* Left: The Uncropped Portrait Masterpiece */}
                    <div className="w-full max-w-[400px] lg:max-w-none lg:w-[480px] shrink-0">
                        <div className="relative aspect-[2/3] w-full rounded-sm overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/5 bg-black/40">
                            <img
                                src={poster}
                                alt={movie.title}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Right: Immersive Movie Details */}
                    <div className="flex-1 flex flex-col pt-4">

                        {/* Rating & Global Metadata */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
                            <div className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/20 backdrop-blur-xl px-4 py-2 rounded text-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.05)]">
                                <Star size={13} className="fill-yellow-400" />
                                <span className="text-sm font-black tracking-widest leading-none">{movie.rating}</span>
                                <span className="text-[10px] opacity-40 font-bold uppercase ml-1">IMDb</span>
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap">{movie.year}</span>
                            <span className="hidden md:block w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-xs font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap">{movie.runtime}</span>
                        </div>

                        {/* Epic Title */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] text-white uppercase mb-12 max-w-4xl">
                            {movie.title}
                        </h1>

                        <div className="w-20 h-1 bg-white/5 mb-14 hidden lg:block" />

                        {/* Plot Core */}
                        <div className="mb-16">
                            <p className="text-lg md:text-2xl leading-[1.8] text-white/50 font-light tracking-wide max-w-3xl">
                                {movie.plot}
                            </p>
                        </div>

                        {/* Technical Narrative Lists (Cast, Genre) */}
                        <div className="flex flex-col gap-8 border-t border-white/5 pt-12">
                            <div className="flex flex-col md:flex-row gap-2 md:gap-10">
                                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/10 min-w-[140px] pt-1">Starring</span>
                                <span className="text-sm md:text-base text-white/40 leading-relaxed font-medium">{starsDisplay}</span>
                            </div>
                            <div className="flex flex-col md:flex-row gap-2 md:gap-10">
                                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/10 min-w-[140px] pt-1">Visual Theme</span>
                                <div className="flex flex-wrap gap-2">
                                    {genreTags.map(g => (
                                        <span key={g} className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 border border-white/5 bg-white/[0.03] px-3 py-1.5 rounded-sm">
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </article>
    );
});

export default MovieCard;
