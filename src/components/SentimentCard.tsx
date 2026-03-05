import { memo, useMemo } from 'react';
import { SentimentResult } from '@/types/movie';
import { Brain, Smile, Meh, Frown } from 'lucide-react';

const SentimentCard = memo(function SentimentCard({ sentiment }: { sentiment: SentimentResult }) {
    const { isPositive, isNegative } = useMemo(() => ({
        isPositive: sentiment.classification === 'positive',
        isNegative: sentiment.classification === 'negative',
    }), [sentiment.classification]);

    const config = isPositive
        ? { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', dot: 'bg-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300', text: 'text-emerald-400', quote: 'text-emerald-100/80' }
        : isNegative
            ? { border: 'border-red-500/30', bg: 'bg-red-500/10', dot: 'bg-red-400', badge: 'bg-red-500/20 text-red-300', text: 'text-red-400', quote: 'text-red-100/80' }
            : { border: 'border-blue-500/30', bg: 'bg-blue-500/10', dot: 'bg-blue-400', badge: 'bg-blue-500/20 text-blue-300', text: 'text-blue-400', quote: 'text-blue-100/80' };

    const Icon = isPositive ? Smile : isNegative ? Frown : Meh;

    return (
        <div className={`animate-fade-up border rounded-md ${config.border} ${config.bg} p-6 md:p-8`}>

            {/* Header */}
            <div className="flex items-start justify-between gap-6 mb-5">
                <div className="flex items-center gap-3">
                    <Brain size={16} className={`shrink-0 ${config.text}`} />
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.35em] text-white/30 mb-1.5">
                            AI Audience Insight
                        </p>
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`} />
                            <p className={`text-sm font-black uppercase tracking-widest ${config.text}`}>
                                {sentiment.classification} Sentiment
                            </p>
                        </div>
                    </div>
                </div>

                {/* Vivid icon badge */}
                <div className={`shrink-0 rounded-md p-2.5 ${config.badge}`}>
                    <Icon size={18} />
                </div>
            </div>

            {/* Divider */}
            <div className={`border-t ${config.border} mb-5`} />

            {/* Summary */}
            <blockquote className={`text-sm md:text-[15px] leading-relaxed font-light italic ${config.quote}`}>
                &ldquo;{sentiment.summary}&rdquo;
            </blockquote>

            {/* Footer */}
            <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">
                Analyzed by — {sentiment.model || 'Gemini 2.5 Pro'}
            </p>
        </div>
    );
});

export default SentimentCard;
