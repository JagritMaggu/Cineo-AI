import { memo, useMemo } from 'react';
import { SentimentResult } from '@/types/movie';
import { Brain, Smile, Meh, Frown } from 'lucide-react';

const SentimentCard = memo(function SentimentCard({ sentiment }: { sentiment: SentimentResult }) {
    const Icon = useMemo(() => {
        const c = sentiment.classification?.toLowerCase() || '';
        if (c.includes('pos')) return Smile;
        if (c.includes('neg')) return Frown;
        return Meh;
    }, [sentiment.classification]);

    return (
        <div className="animate-fade-up relative overflow-hidden w-full max-w-full flex justify-center">
            <div className="relative z-10 w-full mx-auto">
                {/* Mobile View: Clean Summary Layout */}
                <div className="md:hidden flex flex-col w-full text-left">
                    <h3 className="text-xl lg:text-3xl font-black text-white uppercase tracking-tighter mb-4">Summary</h3>
                    <p className="text-[13px] leading-[1.7] text-white/80 font-medium tracking-wide mb-6">
                        {sentiment.summary}
                    </p>
                    <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                            AI-generated from user reviews
                        </p>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                            {sentiment.classification} Vibe
                        </p>
                    </div>
                </div>

                {/* Desktop View: Interactive Analysis Layout (Keep Untouched) */}
                <div className="hidden md:block w-full">
                    <div className="flex flex-col md:flex-row items-center md:items-center justify-between gap-6 mb-8 md:mb-10 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] md:p-0 md:rounded-none md:bg-transparent md:border-none">
                                <Brain size={20} strokeWidth={2.5} className="text-white/40" />
                            </div>
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] lg:tracking-[0.5em] text-white/40 mb-1 block">
                                    <span className="md:hidden">AI Summary</span>
                                    <span className="hidden md:inline">Neural Analysis</span>
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-white/40" />
                                    <h4 className="text-xs lg:text-sm font-black uppercase tracking-[0.1em] lg:tracking-[0.2em] text-white">
                                        {sentiment.classification} Vibe
                                    </h4>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] rounded-full px-5 py-2 w-fit mx-auto md:mx-0 md:bg-transparent md:border-none md:px-0">
                            <Icon size={14} className="text-white/40" />
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Verified Insight</span>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block" />
                        <p className="text-base md:text-lg lg:text-3xl leading-[1.8] text-white font-light italic tracking-wide md:pl-8 text-center md:text-left break-words">
                            &ldquo;{sentiment.summary}&rdquo;
                        </p>
                    </div>

                    <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-white/[0.05] flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-4 lg:gap-0">
                        <div className="flex items-center gap-3">
                            <p className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] lg:tracking-[0.4em] text-white/20 text-center lg:text-left">
                                Powered by {sentiment.model || 'Cineo Semantic Engine'}
                            </p>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-1 h-1 rounded-full bg-white/[0.05]" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default SentimentCard;
