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
        <div className="animate-fade-up border border-white/[0.05] bg-white/[0.02] rounded-2xl p-8 backdrop-blur-md relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                            <Brain size={20} strokeWidth={2.5} className="text-white/40" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-1 block">Neural Analysis</span>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/70">
                                    {sentiment.classification} Vibe
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] rounded-full px-5 py-2">
                        <Icon size={14} className="text-white/30" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Verified Insight</span>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                    <p className="text-base md:text-lg lg:text-xl leading-[1.8] text-white/60 font-light italic tracking-wide pl-4">
                        &ldquo;{sentiment.summary}&rdquo;
                    </p>
                </div>

                <div className="mt-10 pt-8 border-t border-white/[0.05] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20">
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
    );
});

export default SentimentCard;
