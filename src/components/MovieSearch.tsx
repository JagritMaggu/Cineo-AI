'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Movie, SentimentResult, MovieApiResponse } from '@/types/movie';
import MovieCard from '@/components/MovieCard';
import CastMarquee from '@/components/CastMarquee';
import SentimentCard from '@/components/SentimentCard';
import SentimentSkeleton from '@/components/SentimentSkeleton';
import ErrorState from '@/components/ErrorState';
import { Search, X, Loader2, Sparkles } from 'lucide-react';

const MOVIE_FACTS = [
    "The Godfather (1972) • A sprawling epic of crime and family loyalty that redefined cinema.",
    "Citizen Kane (1941) • A visual masterpiece that pioneered modern cinematography techniques.",
    "2001: A Space Odyssey (1968) • Stanley Kubrick's definitive vision of human evolution.",
    "Pulp Fiction (1994) • Non-linear storytelling that revitalized independent filmmaking.",
    "Schindler's List (1993) • A profound, heart-wrenching exploration of the human spirit.",
    "Spirited Away (2001) • A breathtaking work of animation that captured global hearts.",
    "Blade Runner (1982) • The atmospheric blueprint for modern cyberpunk aesthetics.",
    "Seven Samurai (1954) • Akira Kurosawa's masterclass in action and honor.",
    "Eternal Sunshine (2004) • A surreal, emotional dive into the mechanics of memory.",
    "The Matrix (1999) • A revolutionary fusion of philosophy and action cinema."
];

const MARQUEE_MOVIES = [
    { title: "Pulp Fiction", poster: "https://image.tmdb.org/t/p/w500/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg", backdrop: "https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg" },
    { title: "Inception", poster: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg", backdrop: "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg" },
    { title: "The Dark Knight", poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", backdrop: "https://image.tmdb.org/t/p/original/dqK9Hag1054tghRQSqLSfrkvQnA.jpg" },
    { title: "A Beautiful Mind", poster: "https://image.tmdb.org/t/p/w500/zwzWCmH72OSC9NA0ipoqw5Zjya8.jpg", backdrop: "https://image.tmdb.org/t/p/original/vVBcIN68kFq681b4lObiNJhEVro.jpg" },
    { title: "The Godfather", poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", backdrop: "https://image.tmdb.org/t/p/original/tSPT36ZKlP2WVHJLM4cQPLSzv3b.jpg" },
    { title: "Good Will Hunting", poster: "https://image.tmdb.org/t/p/w500/z2FnLKpFi1HPO7BEJxdkv6hpJSU.jpg", backdrop: "https://image.tmdb.org/t/p/original/bpV8wn48s82au37QyUJ51S7X2Vf.jpg" },
    { title: "Bohemian Rhapsody", poster: "https://image.tmdb.org/t/p/w500/lHu1wtNaczFPGFDTrjCSzeLPTKN.jpg", backdrop: "https://image.tmdb.org/t/p/original/dcvbs8z0GEXslC1kCT77x19XDeR.jpg" }
];

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

function PosterStepMarquee({ onStep }: { onStep: (movie: { title: string; poster: string; backdrop: string }, index: number) => void }) {
    const [index, setIndex] = useState(0);
    const CARD_WIDTH = 220; // Reduced to fit 4 cards easily

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => prev + 1);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        onStep(MARQUEE_MOVIES[index % MARQUEE_MOVIES.length], index % MARQUEE_MOVIES.length);
    }, [index, onStep]);

    // Huge number of clones for practically infinite scroll without resetting
    const extendedMovies = useMemo(() => {
        const arr = [];
        for (let i = 0; i < 50; i++) {
            arr.push(...MARQUEE_MOVIES);
        }
        return arr;
    }, []);

    return (
        <div
            className="relative w-full h-[400px] overflow-hidden flex items-end"
            style={{ maskImage: 'linear-gradient(to right, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 80%, transparent 100%)' }}
        >
            {/* Added a subtle blur overlay on the right edge */}
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black/20 to-transparent backdrop-blur-[2px] z-20 pointer-events-none" />

            <motion.div
                className="flex gap-4 items-end"
                animate={{ x: -(index) * (CARD_WIDTH + 16) }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: 'max-content' }}
            >
                {extendedMovies.map((movie: { title: string; poster: string; backdrop: string }, i: number) => {
                    return (
                        <div
                            key={`${movie.title}-${i}`}
                            className="w-[220px] shrink-0 group"
                        >
                            <div className="aspect-[2/3] w-full rounded-sm overflow-hidden bg-[#0a0a0a] relative shadow-2xl">
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-full h-full object-cover opacity-80 pointer-events-none"
                                />

                            </div>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Landing — shown before any search is run
───────────────────────────────────────────── */
function Landing({
    inputVal,
    setInputVal,
    onSubmit,
    isLoading,
    onMobileSearch,
    isDesktop
}: {
    inputVal: string;
    setInputVal: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    onMobileSearch: () => void;
    isDesktop: boolean;
}) {
    const [activeMovie, setActiveMovie] = useState(MARQUEE_MOVIES[0]);
    const [activeIdx, setActiveIdx] = useState(0);

    const handleStep = useCallback((movie: { title: string; poster: string; backdrop: string }, index: number) => {
        setActiveMovie(movie);
        setActiveIdx(index);
    }, []);

    return (
        <div className="relative flex flex-col h-[100svh] lg:h-svh lg:min-h-svh justify-end pb-7.5 lg:pb-32 overflow-y-clip overscroll-y-none w-full max-w-[100vw]">

            {/* Brighter Proper Poster Background */}
            <div className="fixed inset-0 z-0 pointer-events-none transition-all duration-300 ease-out bg-[#080808]">

                {/* Mobile: Ambient Blur Section (Full Screen) */}
                <div className="absolute inset-0 md:hidden opacity-50 saturate-150">
                    <img
                        key={`blur-${activeMovie.title}`}
                        src={activeMovie.poster.replace('/w500/', '/original/')}
                        alt=""
                        className="w-full h-full object-cover blur-[60px] scale-110"
                        style={{ transition: 'opacity 0.2s ease-in-out' }}
                    />
                </div>

                {/* Mobile: Top Poster (Full Width, Natural Height) */}
                <div className="absolute top-0 left-0 right-0 h-[74vh] md:hidden">
                    <Image
                        key={`${activeMovie.title}-mobile`}
                        src={activeMovie.poster.replace('/w500/', '/original/')}
                        alt=""
                        fill
                        unoptimized
                        priority
                        className="object-cover object-top saturate-[1.1]"
                        style={{
                            transition: 'opacity 0.2s ease-in-out',
                            maskImage: 'linear-gradient(to bottom, black 95%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, black 95%, transparent 100%)'
                        }}
                    />
                </div>

                {/* Desktop: Full Landscape Backdrop */}
                <picture className="absolute inset-0 hidden md:block">
                    <source media="(min-width: 768px)" srcSet={activeMovie.backdrop} />
                    <img
                        key={`${activeMovie.title}-desktop`}
                        src={activeMovie.backdrop}
                        alt=""
                        className="w-full h-full object-cover object-[center_15%] saturate-[1.1] opacity-[0.6] scale-[1]"
                        style={{
                            transition: 'opacity 0.4s ease-in-out, transform 0.4s ease-out',
                            imageRendering: 'auto'
                        }}
                    />
                </picture>
            </div>

            {/* Subtle Overlay for legibility only */}
            <div className="fixed inset-0 bg-black/20 z-[1] pointer-events-none hidden md:block" />
            <div className="fixed inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent z-[2] pointer-events-none opacity-40 hidden md:block" />

            <div className="relative z-10 w-full max-w-full px-0 md:px-20 flex flex-col lg:grid lg:grid-cols-[1fr_1.5fr] items-center lg:items-end gap-2 lg:gap-24">
                {/* Left side: Tagline, Narrative & Search */}
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left pt-0 lg:pt-0 w-full max-w-full -translate-x-[2px] lg:translate-x-0">


                    <div className="flex flex-col items-center lg:items-start mb-4 lg:mb-16">
                        <div className="flex flex-row items-center gap-4 lg:gap-8 mb-4">
                            {/* Desktop: Stopwatch Count */}
                            <div className="hidden lg:flex items-center text-3xl font-black tracking-[-0.05em] leading-none text-white">
                                <span>0</span>
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={activeIdx}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        {(activeIdx + 1)}
                                    </motion.span>
                                </AnimatePresence>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.h1
                                    key={activeMovie.title}
                                    initial={isDesktop ? { x: -20, opacity: 0 } : { opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={isDesktop ? { x: 20, opacity: 0 } : { opacity: 0 }}
                                    transition={isDesktop ? { duration: 0.8, ease: [0.22, 1, 0.36, 1] } : { duration: 0.2 }}
                                    className="hidden lg:block text-[clamp(1.8rem,5vw,6rem)] lg:text-3xl font-black tracking-[0.02em] leading-none uppercase"
                                >
                                    <span className="text-white block truncate max-w-xl mx-auto lg:mx-0">{activeMovie.title}</span>
                                </motion.h1>
                            </AnimatePresence>
                        </div>

                        <motion.p
                            initial={isDesktop ? { opacity: 0, y: 10 } : { opacity: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={isDesktop ? { duration: 0.8, delay: 0.2 } : { duration: 0.4 }}
                            className="text-white/60 text-[9px] md:text-sm leading-[1.6] max-w-xs lg:max-w-xl mx-auto lg:mx-0 font-medium tracking-[0.15em] uppercase px-2 lg:px-0"
                        >
                            Reveal the true audience pulse behind every film through AI-powered sentiment analysis.
                        </motion.p>
                    </div>

                    {/* Search Input */}
                    <motion.form
                        initial={isDesktop ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                        animate={isDesktop ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                        transition={isDesktop ? { duration: 0.8, delay: 0.3 } : { duration: 0 }}
                        onSubmit={onSubmit}
                        className="flex items-center w-[88vw] lg:w-full max-w-xl mx-auto lg:mx-0 -translate-x-[6px] lg:translate-x-0 border border-white/5 bg-black/40 rounded-md overflow-hidden hover:border-white/10 focus-within:border-white/20 transition-all duration-500"
                    >
                        <div className="flex items-center pl-4 lg:pl-6 text-white/30 shrink-0">
                            <Search size={15} className="scale-90 md:scale-100" />
                        </div>
                        <input
                            type="text"
                            value={inputVal}
                            onChange={e => setInputVal(e.target.value)}
                            onFocus={!isDesktop ? onMobileSearch : undefined}
                            onClick={!isDesktop ? onMobileSearch : undefined}
                            placeholder="Enter IMDB ID"
                            readOnly={!isDesktop}
                            disabled={isLoading}
                            className="flex-1 px-3 lg:px-5 py-3 lg:py-5 text-[10px] lg:text-[11px] bg-transparent focus:outline-none placeholder:text-white/20 placeholder:text-[8px] lg:placeholder:text-[11px] text-white tracking-[0.3em] font-bold uppercase transition-all"
                        />
                        <button
                            type={isDesktop ? "submit" : "button"}
                            onClick={!isDesktop ? onMobileSearch : undefined}
                            disabled={isLoading || (isDesktop && !inputVal.trim())}
                            className="px-4 lg:px-8 py-2 lg:py-3 m-1.5 lg:m-3 text-[9px] lg:text-[10px] font-black bg-white text-black hover:bg-[#e0e0e0] transition-all disabled:opacity-40 disabled:hover:bg-white rounded-sm uppercase tracking-[0.2em] shrink-0"
                        >
                            Analyze
                        </button>
                    </motion.form>
                </div>

                {/* Right side: The Infinite Poster Stream */}
                <div className="hidden lg:block w-full overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.4 }}
                    >
                        <PosterStepMarquee onStep={handleStep} />
                    </motion.div>
                </div>
            </div >
        </div >
    );
}

/* ─────────────────────────────────────────────
   Main orchestrator
───────────────────────────────────────────── */
export default function MovieSearch() {
    const [loadingStep, setLoadingStep] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [movieData, setMovieData] = useState<Movie | null>(null);
    const [isCastLoading, setIsCastLoading] = useState<boolean>(false);
    const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
    const [inputVal, setInputVal] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [currentFactIdx, setCurrentFactIdx] = useState(0);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        setIsDesktop(window.innerWidth >= 1024);
    }, []);

    // Rotate facts during loading
    const rotateFact = useCallback(() => {
        setCurrentFactIdx(prev => (prev + 1) % MOVIE_FACTS.length);
    }, []);

    const handleSearch = useCallback(async (imdbId: string) => {
        const id = imdbId.trim();
        if (!id) return;
        setError(null);
        setMovieData(null);
        setSentiment(null);
        setMobileOpen(false);

        try {
            setLoadingStep('movie');
            setIsCastLoading(true);
            const factInterval = setInterval(rotateFact, 3500);

            // --- FIRE ALL 3 APIS SIMULTANEOUSLY (FIRST COME FIRST SERVE) ---

            // 1. Fetch Core Movie
            fetch(`/api/movie?imdbId=${id}`)
                .then(res => {
                    if (!res.ok) {
                        clearInterval(factInterval);
                        throw new Error(res.status === 404 ? 'Movie not found. Check the IMDb ID.' : 'Failed to fetch movie data.');
                    }
                    return res.json();
                })
                .then((movieJson: MovieApiResponse) => {
                    clearInterval(factInterval); // Stop spinner once core data arrives
                    setMovieData(movieJson.movie);

                    // If sentiment already arrived, we can stop the loading phase entirely
                    setLoadingStep(prev => {
                        if (prev === 'movie') {
                            // If sentiment isn't here yet, transition to sentiment loading
                            return sentiment ? null : 'sentiment';
                        }
                        return prev;
                    });
                })
                .catch(err => {
                    clearInterval(factInterval);
                    setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
                    setLoadingStep(null);
                });

            // --- FIRE BACKGROUND TASKS IN PARALLEL ---

            // 1. Fetch Cast securely in the background
            setIsCastLoading(true);
            fetch(`/api/cast?imdbId=${id}`)
                .then(res => res.json())
                .then(resData => {
                    if (resData.fullCast) {
                        setMovieData(prev => prev ? { ...prev, fullCast: resData.fullCast } : prev);
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch full cast", err);
                })
                .finally(() => {
                    setIsCastLoading(false);
                });

            // 2. Fetch Sentiment securely in the background in PARALLEL
            fetch('/api/sentiment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imdbId: id }),
            })
                .then(res => res.json())
                .then(sentimentData => {
                    setSentiment(sentimentData);
                })
                .catch(err => {
                    console.error("Failed to fetch sentiment", err);
                })
                .finally(() => {
                    setLoadingStep(prev => prev === 'sentiment' ? null : prev); // Finish loading phase when sentiment finishes
                });

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
            setLoadingStep(null);
        }
    }, []);

    const isLoading = !!loadingStep;
    const hasResult = !!movieData || !!error;

    const onDesktopSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(inputVal);
    };

    const onMobileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(inputVal);
    };

    return (
        <div className={`flex flex-col w-full max-w-full overflow-x-hidden touch-pan-y ${!movieData && !error && !loadingStep ? 'h-svh overflow-y-clip overscroll-y-none' : 'min-h-svh'}`}>


            {/* ── Scrollable Content ── */}
            <div className="flex-1 flex flex-col">

                {/* Landing */}
                {!movieData && !error && !loadingStep && (
                    <Landing
                        inputVal={inputVal}
                        setInputVal={setInputVal}
                        onSubmit={onDesktopSubmit}
                        isLoading={isLoading}
                        onMobileSearch={() => setMobileOpen(true)}
                        isDesktop={isDesktop}
                    />
                )}

                {/* Movie loading spinner - only show if we don't have movie data yet */}
                {loadingStep === 'movie' && !movieData && (
                    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-8">
                        <div className="text-center animate-fade-up max-w-lg">
                            <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center mx-auto mb-8 relative">
                                <div className="absolute inset-0 rounded-full border-t border-white/40 animate-spin-fast" />
                                <Sparkles size={20} className="text-white/40" />
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 animate-pulse">Running Neural Analysis</p>
                                <p className="text-[11px] font-light text-white/40 leading-relaxed italic animate-fade-in" key={currentFactIdx}>
                                    {MOVIE_FACTS[currentFactIdx]}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="px-5 md:px-8 pt-8 pb-4 max-w-2xl">
                        <ErrorState message={error} />
                    </div>
                )}

                {/* Movie card — full width, poster-dominant */}
                {movieData && (
                    <MovieCard
                        movie={movieData}
                        onSearchOpen={() => setMobileOpen(true)}
                        onBack={() => {
                            setMovieData(null);
                            setSentiment(null);
                            setError(null);
                            setLoadingStep(null);
                        }}
                    />
                )}

                {/* Cast Marquee - renders below hero, paints skeleton if loading */}
                {((movieData || isCastLoading) && !(!movieData && !error && !loadingStep) && !(isDesktop && loadingStep === 'movie')) && (
                    <div className="relative w-full max-w-[100vw] overflow-hidden flex justify-center">
                        <div className="w-full">
                            <CastMarquee cast={movieData?.fullCast} isLoading={isCastLoading} />
                        </div>
                    </div>
                )}

                {/* Sentiment - paints skeleton if loading regardless of movieData state */}
                {((movieData || sentiment || loadingStep === 'sentiment') && !(!movieData && !error && !loadingStep) && !(isDesktop && loadingStep === 'movie')) && (
                    <div className="relative w-full max-w-[100vw] mx-auto px-6 md:px-20 pb-20 overflow-hidden flex justify-center">
                        <div className="w-full max-w-[1720px]">
                            {sentiment ? (
                                <SentimentCard sentiment={sentiment} />
                            ) : (loadingStep === 'sentiment' || (loadingStep === 'movie' && !sentiment)) ? (
                                <SentimentSkeleton />
                            ) : null}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Mobile Search Modal ── */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex flex-col justify-end">
                    <div className="bg-[#0f0f0f] border-t border-white/8 px-5 pt-5 pb-10 rounded-t-2xl animate-slide-up">
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-white">Search Movie</p>
                            <button onClick={() => setMobileOpen(false)} className="text-white/30 hover:text-white p-1 transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                        <form onSubmit={onMobileSubmit} className="space-y-3">
                            <div className="flex items-center gap-2 border border-white/12 bg-white/[0.04] rounded-md overflow-hidden focus-within:border-white/30 transition-colors">
                                <div className="pl-3.5 text-white/25 shrink-0"><Search size={14} /></div>
                                <input
                                    autoFocus
                                    type="text"
                                    value={inputVal}
                                    onChange={e => setInputVal(e.target.value)}
                                    placeholder="e.g. tt0468569"
                                    className="flex-1 px-3 py-3.5 text-sm bg-transparent focus:outline-none placeholder:text-white/20 text-white"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!inputVal.trim()}
                                className="w-full py-3.5 bg-white text-black text-xs font-black rounded-md uppercase tracking-[0.3em] hover:bg-white/80 transition-all active:scale-[0.97] disabled:bg-white/8 disabled:text-white/20"
                            >
                                Analyze
                            </button>
                            <p className="text-[10px] text-white/18 text-center">Find the ID at imdb.com/title/<strong className="text-white/30">tt0468569</strong></p>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
