'use client';

import { memo, useMemo } from 'react';
import { Movie } from '@/types/movie';
import { Star, Play } from 'lucide-react';

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

    // High-resolution poster extraction
    const poster = useMemo(() => {
        if (!movie.poster || movie.poster === 'N/A') return '/placeholder-poster.png';
        if (movie.poster.includes('._V1_')) {
            return movie.poster.split('._V1_')[0] + '._V1_.jpg';
        }
        return movie.poster;
    }, [movie.poster]);

    // Format cast for display
    const stars = useMemo(() => {
        if (hasFullCast) {
            return movie.fullCast.slice(0, 3).map(c => c.name).join(', ');
        }
        return movie.cast;
    }, [hasFullCast, movie.fullCast, movie.cast]);

    return (
        <article className="w-full bg-[#141414] min-h-screen text-white font-sans overflow-x-hidden">

            {/* Ambient Backdrop Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
                <img
                    src={poster}
                    alt=""
                    className="w-full h-full object-cover blur-[120px] scale-125 saturate-150"
                />
            </div>

            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-20 lg:py-32">

                <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-start">

                    {/* Left side: Vertical Poster */}
                    <div className="w-full lg:w-[450px] shrink-0 relative group">
                        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black/40">
                            <img
                                src={poster}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay Details (Netflix style "Resume") */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                                <p className="text-red-600 font-bold uppercase tracking-wider text-xs mb-2">Resume</p>
                                <p className="text-white text-lg font-bold mb-4">{movie.title}</p>
                                <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full w-[40%] bg-red-600" />
                                </div>
                            </div>

                            {/* Play Button Overlay */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-red-600/90 rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 pointer-events-none">
                                <Play size={32} className="fill-white text-white ml-2" />
                            </div>
                        </div>
                    </div>

                    {/* Right side: Netflix Detail Layout */}
                    <div className="flex-1 pt-4 lg:pt-0">

                        {/* Title & Branding */}
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-red-600 font-black text-xs tracking-[0.2em] uppercase">Netflix Original</span>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-6">
                                <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-2xl leading-[1.05]">
                                    {movie.title}
                                </h1>
                                <div className="flex items-center gap-2 text-2xl font-bold">
                                    <span>{movie.rating}</span>
                                    <Star size={24} className="fill-yellow-400 text-yellow-400" />
                                </div>
                            </div>
                        </div>

                        {/* Metadata line */}
                        <div className="flex items-center gap-4 text-sm font-medium text-gray-400 mb-10">
                            <span className="text-white">{movie.year}</span>
                            <span className="w-px h-3 bg-gray-700" />
                            <span>{movie.runtime}</span>
                            <span className="w-px h-3 bg-gray-700" />
                            <span className="border border-gray-600 px-1.5 py-0.5 text-[10px] rounded shrink-0">16+</span>
                        </div>

                        {/* Tabs Navigation (Simulated Netflix Tabs) */}
                        <div className="flex items-center gap-10 border-b border-white/10 mb-10">
                            <button className="relative pb-4 text-xs font-black uppercase tracking-widest text-white border-b-2 border-red-600">
                                Overview
                            </button>
                            <button className="pb-4 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                                Episodes
                            </button>
                            <button className="pb-4 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                                Trailers & More
                            </button>
                            <button className="pb-4 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
                                More Like This
                            </button>
                        </div>

                        {/* Overview Content */}
                        <div className="max-w-3xl mb-12">
                            <p className="text-lg md:text-xl leading-relaxed text-gray-200 font-medium">
                                {movie.plot}
                            </p>
                        </div>

                        {/* Technical Details Sidebar-style List */}
                        <div className="flex flex-col gap-4 text-sm md:text-base border-t border-white/5 pt-8">
                            <div className="flex gap-4">
                                <span className="text-gray-500 min-w-[100px] shrink-0">Starring</span>
                                <span className="text-gray-300 font-medium">{stars}</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-gray-500 min-w-[100px] shrink-0">Genre</span>
                                <span className="text-gray-300 font-medium">{movie.genre}</span>
                            </div>
                            <div className="flex gap-4">
                                <span className="text-gray-500 min-w-[100px] shrink-0">Director</span>
                                <span className="text-gray-300 font-medium">The Duffer Brothers (Placeholder)</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Row: Episode-style cards (Placeholder visuals) */}
                <div className="mt-32">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="relative aspect-video rounded-sm overflow-hidden mb-4 bg-white/5">
                                    <img
                                        src={poster}
                                        alt=""
                                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-red-600/60 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                                </div>
                                <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-tighter">S1:E{i}</p>
                                <p className="text-sm font-bold text-white group-hover:text-red-500 transition-colors">Neural Sentiment Analysis Part {i}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </article>
    );
});

export default MovieCard;
