'use client';

import { memo, useMemo } from 'react';
import { Movie } from '@/types/movie';
import { Star, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <article className="w-full overflow-x-hidden bg-[#080808] min-h-[100svh] lg:h-[105svh] text-white relative flex flex-col pt-0 pb-10 lg:py-0">

            {/* ── 1. The Cinematic Backdrop (Ambient Cineo Glow) ── */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.25] overflow-hidden">
                <img
                    src={poster}
                    alt=""
                    className="w-full h-full object-cover blur-[160px] scale-150 saturate-[1.3]"
                />
            </div>

            {/* ── 2. The Fluid 100vh Dashboard (Inspired by Lucifer/Netflix Layout) ── */}
            <div className="relative z-10 w-full max-w-[1720px] mx-auto px-0 md:px-20 flex-1 flex flex-col justify-start lg:justify-center">

                {/* Back Button */}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="absolute top-6 left-4 md:top-10 md:left-20 text-white hover:text-white/90 transition-colors flex items-center justify-center gap-2 group z-50 p-2 md:p-3 bg-black/50 backdrop-blur-md md:bg-transparent rounded-full md:rounded-none shadow-lg md:shadow-none"
                    >
                        <ArrowLeft size={20} strokeWidth={2} />
                    </button>
                )}

                <div className="flex flex-col lg:flex-row gap-0 lg:gap-24 items-center lg:items-end">

                    {/* Right side: The Floating Portrait Piece (Moved up for mobile context) */}
                    <div className="w-full lg:w-auto h-auto flex justify-center order-1 lg:order-2 lg:-translate-y-6 lg:max-h-[90vh]">
                        <div className="relative w-full h-[71vh] lg:w-auto lg:h-[90vh] lg:aspect-[2/3] lg:rounded-sm overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)] border-0 border-transparent lg:border-white/5 bg-transparent lg:bg-black/40 [mask-image:linear-gradient(to_bottom,black_80%,transparent_100%)] lg:[mask-image:none]">
                            <img
                                src={poster}
                                alt={movie.title}
                                className="w-full h-full object-cover object-top lg:object-center saturate-[1.1] lg:saturate-100"
                            />
                        </div>
                    </div>

                    {/* Left side: The Narrative & Meta (Cineo Theme) */}
                    <div className="flex-1 text-center lg:text-left order-2 lg:order-1 lg:-translate-y-20 px-6 md:px-0 mt-4 lg:mt-0 pb-12 lg:pb-0">

                        <div className="flex flex-nowrap items-center justify-center lg:justify-start gap-3 md:gap-5 mb-4 md:mb-10 overflow-x-auto no-scrollbar px-4 lg:px-0">
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className="text-[16.5px] md:text-3xl lg:text-6xl font-black tracking-tighter leading-none text-white uppercase whitespace-nowrap shrink truncate"
                            >
                                {movie.title}
                            </motion.h1>

                            <div className="w-px h-4 bg-white/10 shrink-0 mx-1 hidden md:block" />
                            <div className="w-1 h-1 rounded-full bg-white/20 shrink-0 md:hidden" />

                            <div className={`flex items-center gap-1.5 border px-2.5 lg:px-4 py-1.5 lg:py-2 rounded shrink-0 ${movie.rating === 'N/A' ? 'bg-black/40 border-white/10 text-white/40' : 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400'}`}>
                                <Star size={10} className={`lg:w-[13px] lg:h-[13px] ${movie.rating === 'N/A' ? 'fill-white/10' : 'fill-yellow-400'}`} />
                                <span className="text-[10px] lg:text-sm font-black tracking-widest leading-none">
                                    {movie.rating === 'N/A' ? 'TBD' : movie.rating}
                                </span>
                                <span className="text-[8px] lg:text-[10px] opacity-40 font-bold uppercase ml-0.5 lg:ml-1">IMDb</span>
                            </div>

                            <span className="text-[9px] lg:text-xs font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap shrink-0">{movie.runtime}</span>
                        </div>

                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                            className="text-[12px] md:text-xl lg:text-2xl leading-[1.6] text-white/50 font-light tracking-wide max-w-2xl mb-5 lg:mb-10 px-2 lg:px-0 overflow-visible"
                        >
                            {movie.plot}
                        </motion.p>

                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-4 lg:mb-0"
                        >
                            {genreTags.map(g => (
                                <span key={g} className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-white/70 border border-white/10 bg-black/40 px-2.5 lg:px-4 py-1 lg:py-2 rounded-md">
                                    {g}
                                </span>
                            ))}
                        </motion.div>

                        {/* Top Billed OMDb Cast */}
                        {movie.cast && movie.cast !== 'N/A' && (
                            <div className="mt-2 lg:mt-12 flex flex-col items-center lg:items-start">
                                <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-4">
                                    <div className="w-6 h-px bg-yellow-400/40" />
                                    <h3 className="text-[8px] font-black uppercase tracking-[0.4em] text-yellow-400/70 whitespace-nowrap">Lead Performers</h3>
                                </div>
                                <p className="text-[10px] lg:text-sm md:text-base text-white/70 font-medium tracking-widest text-center lg:text-left leading-relaxed">
                                    {movie.cast.split(',').map((actor, idx, arr) => (
                                        <span key={idx}>
                                            <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{actor.trim()}</span>
                                            {idx < arr.length - 1 && <span className="text-white/20 mx-1.5">•</span>}
                                        </span>
                                    ))}
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* ── Seamless Bottom Merge Gradient ── */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#080808] via-[#080808] to-transparent z-20 pointer-events-none" />
        </article>
    );
});

export default MovieCard;
