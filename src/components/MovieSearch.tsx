'use client';

import { useState, useCallback } from 'react';
import { Movie, SentimentResult, MovieApiResponse } from '@/types/movie';
import MovieCard from '@/components/MovieCard';
import SentimentCard from '@/components/SentimentCard';
import SentimentSkeleton from '@/components/SentimentSkeleton';
import ErrorState from '@/components/ErrorState';
import { Search, X, Loader2, Sparkles } from 'lucide-react';

/* ─────────────────────────────────────────────
   Landing — shown before any search is run
───────────────────────────────────────────── */
function Landing({ onMobileSearch }: { onMobileSearch: () => void }) {
    return (
        <div className="relative flex flex-col min-h-svh md:min-h-[calc(100vh-60px)]">

            {/* Animated ambient glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.03]"
                    style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }} />
                <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full opacity-[0.02]"
                    style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }} />
                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.025]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
            </div>

            {/* Headline */}
            <div className="relative flex-1 flex flex-col justify-center px-8 md:px-12 max-w-3xl">
                <div className="flex items-center gap-2.5 mb-7">
                    <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">AI-Powered Cinema Analysis</span>
                </div>

                <h1 className="text-[clamp(3.5rem,10vw,7rem)] font-black tracking-[-0.04em] leading-[0.88] mb-7">
                    <span className="text-white">Understand</span><br />
                    <span className="text-white/20">movie audiences.</span>
                </h1>

                <p className="text-white/35 text-sm md:text-base leading-relaxed max-w-sm font-light mb-10">
                    Enter any IMDb ID to surface sentiment, cast intelligence, and critic breakdowns — powered by Gemini AI.
                </p>

                {/* Desktop: inline quick-hint */}
                <div className="hidden md:flex items-center gap-3">
                    <div className="flex items-center gap-2 text-[10px] text-white/25 border border-white/8 px-3.5 py-2 rounded-md font-mono">
                        <Search size={11} className="text-white/60" />
                        <span>Search above ↑</span>
                    </div>
                    <span className="text-[10px] text-white/15">or press Enter with an IMDb ID like <strong className="text-white/30">tt0468569</strong></span>
                </div>

                {/* Mobile: tap hint pointing to FAB */}
                <div className="flex md:hidden items-center gap-2 text-white/25">
                    <span className="text-xs font-light">Tap</span>
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                        <Search size={12} className="text-white/60" />
                    </div>
                    <span className="text-xs font-light">below to search any movie</span>
                </div>
            </div>

            {/* Floating search FAB — mobile only */}
            <button
                onClick={onMobileSearch}
                className="md:hidden fixed bottom-8 right-6 z-50 w-14 h-14 bg-white rounded-full flex items-center justify-center"
                style={{ boxShadow: '0 8px 32px rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.6)' }}
            >
                <Search size={20} className="text-black" />
            </button>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Main orchestrator
───────────────────────────────────────────── */
export default function MovieSearch() {
    const [loadingStep, setLoadingStep] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [movieData, setMovieData] = useState<Movie | null>(null);
    const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
    const [inputVal, setInputVal] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSearch = useCallback(async (imdbId: string) => {
        const id = imdbId.trim();
        if (!id) return;
        setError(null);
        setMovieData(null);
        setSentiment(null);
        setMobileOpen(false);

        try {
            setLoadingStep('movie');
            const movieRes = await fetch(`/api/movie?imdbId=${id}`);
            if (!movieRes.ok) throw new Error(
                movieRes.status === 404 ? 'Movie not found. Check the IMDb ID.' : 'Failed to fetch movie data.'
            );
            const data: MovieApiResponse = await movieRes.json();
            setMovieData(data.movie);

            setLoadingStep('sentiment');
            const sentimentRes = await fetch('/api/sentiment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviews: data.reviews, title: data.movie.title, imdbId: id }),
            });
            if (sentimentRes.ok) setSentiment(await sentimentRes.json());
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
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
        <div className="flex flex-col min-h-screen">

            {/* ── Desktop Header ── */}
            <header className="hidden md:flex items-center gap-6 px-7 h-[60px] shrink-0 border-b border-white/[0.05] bg-[#080808]/90 backdrop-blur-xl sticky top-0 z-40">
                {/* Branding */}
                <div className="flex items-center gap-2 shrink-0">
                    <Sparkles size={13} className="text-white/60" />
                    <span className="text-xs font-black uppercase tracking-[0.25em] text-white">Cineo AI</span>
                </div>

                {/* Search */}
                <form onSubmit={onDesktopSubmit} className="flex-1 max-w-md flex items-center border border-white/8 bg-white/[0.03] rounded-md overflow-hidden hover:border-white/15 focus-within:border-white/30 transition-all duration-200">
                    <div className="flex items-center pl-3.5 text-white/20 shrink-0">
                        {isLoading
                            ? <Loader2 size={13} className="animate-spin text-white/60" />
                            : <Search size={13} />
                        }
                    </div>
                    <input
                        type="text"
                        value={inputVal}
                        onChange={e => setInputVal(e.target.value)}
                        placeholder="IMDb ID — e.g. tt0468569"
                        disabled={isLoading}
                        className="flex-1 px-3 py-2.5 text-xs bg-transparent focus:outline-none placeholder:text-white/18 text-white disabled:opacity-40 tracking-wide"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputVal.trim()}
                        className="px-3 py-1 m-1 text-[9px] font-black bg-white text-black hover:bg-white/80 transition-colors disabled:bg-white/5 disabled:text-white/20 rounded-sm uppercase tracking-widest shrink-0"
                    >
                        {isLoading ? '…' : 'Run'}
                    </button>
                </form>

                <p className="hidden xl:block text-[9px] text-white/20 uppercase tracking-[0.3em] ml-auto">Audience Intelligence</p>
            </header>

            {/* ── Scrollable Content ── */}
            <div className="flex-1 flex flex-col">

                {/* Landing */}
                {!hasResult && !isLoading && (
                    <Landing onMobileSearch={() => setMobileOpen(true)} />
                )}

                {/* Movie loading spinner */}
                {loadingStep === 'movie' && (
                    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                        <div className="text-center animate-fade-up">
                            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-4"
                                style={{ boxShadow: '0 0 24px rgba(255,255,255,0.05)' }}>
                                <Loader2 size={20} className="animate-spin text-white/60" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/25">Fetching movie data</p>
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
                    <MovieCard movie={movieData} onSearchOpen={() => setMobileOpen(true)} />
                )}

                {/* Sentiment */}
                {movieData && (
                    <div className="px-5 md:px-8 pb-12 mt-3 md:mt-4">
                        {sentiment ? (
                            <SentimentCard sentiment={sentiment} />
                        ) : loadingStep === 'sentiment' ? (
                            <SentimentSkeleton />
                        ) : null}
                    </div>
                )}
            </div>

            {/* ── Mobile FAB (shown after result too) ── */}
            <button
                onClick={() => setMobileOpen(false)}
                className="md:hidden fixed bottom-7 right-5 z-50 w-12 h-12 bg-white rounded-full flex items-center justify-center"
                style={{ boxShadow: '0 8px 24px rgba(255,255,255,0.1)' }}
            >
                <Search size={18} className="text-black" />
            </button>

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
                                style={{ boxShadow: inputVal.trim() ? '0 4px 20px rgba(255,255,255,0.1)' : 'none' }}
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
