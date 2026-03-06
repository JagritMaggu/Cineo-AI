'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Home, Clapperboard, Film } from 'lucide-react';
import Image from 'next/image';

const MARQUEE_MOVIES = [
    { title: "Pulp Fiction", poster: "https://image.tmdb.org/t/p/w500/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg", backdrop: "https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg" },
    { title: "Inception", poster: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg", backdrop: "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg" },
    { title: "The Dark Knight", poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", backdrop: "https://image.tmdb.org/t/p/original/dqK9Hag1054tghRQSqLSfrkvQnA.jpg" },
    { title: "A Beautiful Mind", poster: "https://image.tmdb.org/t/p/w500/zwzWCmH72OSC9NA0ipoqw5Zjya8.jpg", backdrop: "https://image.tmdb.org/t/p/original/vVBcIN68kFq681b4lObiNJhEVro.jpg" },
    { title: "The Godfather", poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", backdrop: "https://image.tmdb.org/t/p/original/tSPT36ZKlP2WVHJLM4cQPLSzv3b.jpg" },
    { title: "Good Will Hunting", poster: "https://image.tmdb.org/t/p/w500/z2FnLKpFi1HPO7BEJxdkv6hpJSU.jpg", backdrop: "https://image.tmdb.org/t/p/original/bpV8wn48s82au37QyUJ51S7X2Vf.jpg" },
    { title: "Bohemian Rhapsody", poster: "https://image.tmdb.org/t/p/w500/lHu1wtNaczFPGFDTrjCSzeLPTKN.jpg", backdrop: "https://image.tmdb.org/t/p/original/dcvbs8z0GEXslC1kCT77x19XDeR.jpg" }
];

function NotFoundContent() {
    const [index, setIndex] = useState(0);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Detection logic: Cinephile way to distinguish error types
    const isImdbError = pathname.includes('/tt') || searchParams.get('error') === 'invalid_id' || searchParams.get('id');

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % MARQUEE_MOVIES.length);
        }, 4000); // Preserved manual change from user
        return () => clearInterval(interval);
    }, []);

    const activeMovie = MARQUEE_MOVIES[index];

    // Cinematic content variations
    const errorTitle = isImdbError ? "INVALID IMDB ID" : "SCENE NOT FOUND";
    const errorSub = isImdbError ? "Missing Archivist Tag" : "Directed to a Dead End";
    const errorDesc = isImdbError
        ? "The IMDB ID provided does not match any entry in our records. Please verify the 'tt' sequence and re-submit for analysis."
        : "The coordinates you provided don't exist in our cinematic library. This sequence appears to have been cut in the editing room.";
    const ErrorIcon = isImdbError ? Film : Clapperboard;

    return (
        <div className="relative min-h-screen bg-[#080808] flex items-center justify-center overflow-hidden">

            {/* ── Background Animation (Dulled Movie Cycle) ── */}
            <div className="fixed inset-0 z-0 pointer-events-none transition-all duration-300 ease-out bg-[#080808]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeMovie.title}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                    >
                        <div className="absolute inset-0 md:hidden opacity-30 saturate-150">
                            <Image src={activeMovie.poster.replace('/w500/', '/original/')} alt="" fill unoptimized className="object-cover blur-[100px] scale-125" />
                        </div>
                        <div className="absolute top-0 left-0 right-0 h-[80vh] md:hidden opacity-40">
                            <Image src={activeMovie.poster.replace('/w500/', '/original/')} alt="" fill unoptimized priority className="object-cover object-top"
                                style={{
                                    maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                                    WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
                                }}
                            />
                        </div>
                        <div className="hidden md:block absolute inset-0 opacity-[0.25]">
                            <Image src={activeMovie.backdrop} alt="" fill unoptimized priority className="object-cover object-[center_15%] saturate-[0.8]" />
                        </div>
                    </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/40 z-[1]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/80 to-transparent z-[2]" />
            </div>

            {/* ── Main Content ── */}
            <div className="relative z-10 w-full max-w-2xl px-8 flex flex-col items-center text-center">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="w-full">


                    <h1 className="text-5xl md:text-9xl font-black tracking-[-0.05em] text-white leading-none mb-4 selection:bg-white selection:text-black min-w-0">
                        {isImdbError ? "ID ERROR" : "404"}
                    </h1>

                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="h-[1px] w-6 md:w-8 bg-white/10" />
                        <h2 className="text-xs md:text-base font-black text-white/90 uppercase tracking-[0.3em] md:tracking-[0.4em]">
                            {errorTitle}
                        </h2>
                        <div className="h-[1px] w-6 md:w-8 bg-white/10" />
                    </div>

                    <div className="mb-8">
                        <span className="text-[10px] md:text-xs font-bold text-white/60 uppercase tracking-[0.2em] px-4 py-1.5 border border-white/5 bg-white/[0.02] rounded-md">
                            {errorSub}
                        </span>
                    </div>

                    <p className="text-white/40 text-[10px] md:text-xs font-medium leading-relaxed mb-12 max-w-sm mx-auto uppercase tracking-[0.14em] md:tracking-[0.2em] px-4">
                        {errorDesc}
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full px-4 md:px-0">
                        <Link href="/" className="w-full md:w-auto px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-sm hover:bg-[#d0d0d0] transition-all transform active:scale-95 flex items-center justify-center gap-3">
                            <Home size={14} /> Home
                        </Link>
                        <button onClick={() => window.location.href = '/'} className="w-full md:w-auto px-10 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-sm hover:bg-white/10 transition-all transform active:scale-95 flex items-center justify-center gap-3">
                            <Search size={14} /> Search
                        </button>
                    </div>
                </motion.div>
            </div>

            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}</style>
        </div>
    );
}

export default function NotFound() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#080808]" />}>
            <NotFoundContent />
        </Suspense>
    );
}
