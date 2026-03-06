'use client';

import { useState, useCallback } from 'react';
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

/* ─────────────────────────────────────────────
   Landing — shown before any search is run
───────────────────────────────────────────── */
function Landing({
    inputVal,
    setInputVal,
    onSubmit,
    isLoading,
    onMobileSearch
}: {
    inputVal: string;
    setInputVal: (v: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    onMobileSearch: () => void;
}) {
    return (
        <div className="relative flex flex-col min-h-svh">

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
            <div className="relative flex-1 flex flex-col justify-center items-center text-center px-8 md:px-12 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-2.5 mb-7">
                    <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">AI-Powered Cinema Analysis</span>
                </div>

                <h1 className="text-[clamp(4.5rem,14vw,11rem)] font-black tracking-[-0.05em] leading-[0.78] mb-12 uppercase">
                    <span className="text-white">Decode the</span><br />
                    <span className="text-white/20">Cinema.</span>
                </h1>

                <p className="text-white/35 text-xs md:text-sm leading-[2] max-w-4xl font-light mb-28 mx-auto tracking-[0.25em] uppercase">
                    Go beyond the ratings. Our AI analyzes thousands of audience reviews to reveal the true pulse of any movie in seconds.
                </p>

                {/* Desktop Search Bar below content */}
                <form onSubmit={onSubmit} className="hidden md:flex items-center w-full max-w-2xl mx-auto border border-white/8 bg-white/[0.03] rounded-md overflow-hidden hover:border-white/18 focus-within:border-white/30 transition-all duration-300">
                    <div className="flex items-center pl-4 text-white/20 shrink-0">
                        <Search size={14} />
                    </div>
                    <input
                        type="text"
                        value={inputVal}
                        onChange={e => setInputVal(e.target.value)}
                        placeholder="ENTER IMDB ID (e.g. tt0468569)"
                        disabled={isLoading}
                        className="flex-1 px-4 py-4 text-[10px] bg-transparent focus:outline-none placeholder:text-white/15 text-white disabled:opacity-40 tracking-[0.2em] font-medium"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputVal.trim()}
                        className="px-6 py-2 m-2 text-[10px] font-black bg-white text-black hover:bg-white/90 transition-all disabled:bg-white/5 disabled:text-white/18 rounded-sm uppercase tracking-widest shrink-0"
                    >
                        Analyze
                    </button>
                </form>

                {/* Hints */}
                <div className="hidden md:block mt-8 text-[9px] text-white/15 tracking-[0.3em] uppercase">
                    Powered by Gemini 2.0 Flash • IMDb Large Dataset Repository
                </div>

                {/* Mobile: tap hint pointing to FAB */}
                <div className="flex md:hidden items-center justify-center gap-2 text-white/25">
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
    const [isCastLoading, setIsCastLoading] = useState<boolean>(false);
    const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
    const [inputVal, setInputVal] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [currentFactIdx, setCurrentFactIdx] = useState(0);

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
                    if (!sentiment) setLoadingStep('sentiment'); // Switch UI to AI loading state
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
        <div className="flex flex-col min-h-screen">


            {/* ── Scrollable Content ── */}
            <div className="flex-1 flex flex-col">

                {/* Landing */}
                {!hasResult && !isLoading && (
                    <Landing
                        inputVal={inputVal}
                        setInputVal={setInputVal}
                        onSubmit={onDesktopSubmit}
                        isLoading={isLoading}
                        onMobileSearch={() => setMobileOpen(true)}
                    />
                )}

                {/* Movie loading spinner */}
                {loadingStep === 'movie' && (
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
                    <MovieCard movie={movieData} onSearchOpen={() => setMobileOpen(true)} />
                )}

                {/* Cast Marquee - renders below hero to prevent blocking */}
                {movieData && (
                    <CastMarquee cast={movieData.fullCast} isLoading={isCastLoading} />
                )}

                {/* Sentiment */}
                {movieData && (
                    <div className="max-w-screen-2xl mx-auto w-full px-6 md:px-16 pb-20">
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
